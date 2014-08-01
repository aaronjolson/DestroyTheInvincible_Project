#pragma strict

var AstarController : AstarPath;

//States
var waveActive : boolean = false;
var upgradePanelOpen : boolean = false;
var endMenuOpen : boolean = false;
var levelOver: boolean = false;

//Player Variables
var scoreCount : float = 0;
var cashCount : int = 500;

// Timer
var Seconds : float = 11;
var Minutes : float = 1;

var startWaveTimeSec : float = 5;
var startWaveTimeMin : float = 0;
var nextWaveTimeSec : float = 5;
var nextWaveTimeMin : float = 0;

// Define Wave Specific Variables
var waveLevel : int = 0;
var difficultyMultiplier : float = 1.0;
var intermissionTime : float = 5.0;
var teleportedThisWave : boolean = false;
var playerReady : boolean = false;
var wavesThisLevel : int;
var cashGrant : int;

//Enemy Variables
var enemyCount : int = 0;
var enemyPrefabs : GameObject[];
var tankSpawns : Transform;
private var SpawnPoints : Transform[];

//Turrets
var turretCosts : int[];
var onColor : Color;
var offColor : Color;
var allStructures : GameObject[];
var buildBtnGraphics : UISlicedSprite[];
var costTexts : UILabel[];
private var structureIndex : int =0;
var turretSold : boolean = false;
var sellPrice : float = 20;


//--- GUI Items

//GUI Variables
var waveTimer: UILabel;
var waveText : UILabel;
//var healthText : UILabel;
var scoreText : UILabel;
var scoreText2 : UILabel;
var cashText : UILabel;
var levelCompleteText : UILabel;
var upgradeText : UILabel;
var damageUpText : UILabel;
var speedUpText : UILabel;
var damageUpgradeBtn : GameObject;
var speedUpgradeBtn : GameObject;

//NGUI items
var buildPanelOpen : boolean = true;
var upgradePanelTweener : TweenPosition;

var levelEndTweener : TweenPosition;
//

//Placement Plane items
var placementPlanesRoot : Transform;
var hoverMat : Material;
var placementLayerMask : LayerMask;
private var originalMat : Material;
private var lastHitObj : GameObject;
//

//upgrade vars
var focusedPlane : PlacementPlane;
private var structureToUpgradeScript : Turret_Cannon;
private var upgradeStructure : GameObject; //for changing the model
private var upgradeCost : int;
//

//write boolean for explosion
//write if statement in update to graph scan when explosion true and turn boolean to false after
var explosionEvent : boolean = false;


//called first thing on level start
function Start()
{
	//reset the structure index, refresh the GUI
	structureIndex = 0;
	UpdateGUI();
	
	//gather all the tank spawn points into an array in case we want more than one at some point.
	SpawnPoints = new Transform[tankSpawns.childCount];
	var i : int = 0;
	for(var theSpawnPoint : Transform in tankSpawns)
	{
		SpawnPoints[i] = theSpawnPoint;
		i++;
	}
	
	
	//setup
	Minutes = startWaveTimeMin;
	Seconds = startWaveTimeSec;
	
	SetNextWave(); //setup the next wave variables (ie difficulty, speed, etc)
} // End Start()

//called every frame
function Update () 
{
     // This is where building towers happens
	//create a ray, and shoot it from the mouse position, forward into the game
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	if(Physics.Raycast (ray, hit, 1000, placementLayerMask)) //if the ray hits anything on right LAYER, within 1000 meters, save the hit item in variable "hit", then...
	{
		if(lastHitObj) //if we had previously hit an object...
		{
			lastHitObj.renderer.material = originalMat; //visually de-select that object
		}
		
		lastHitObj = hit.collider.gameObject; //replace the "selected plane" with this new plane that the raycast just hit
		originalMat = lastHitObj.renderer.material; //store the new plane's starting material, so we can reset it later
		lastHitObj.renderer.material = hoverMat; //set the plane's material to the highlighted look
	}
	else //...if the raycast didn't hit anything (ie, the mouse moved outside the tiles) ...
	{
		if(lastHitObj) //if we had previously hit something...
		{
			lastHitObj.renderer.material = originalMat; //visually de-select that object
			lastHitObj = null; //nullify the plane selection- this is so that we can't accidentally drop turrets without a proper and valid location selected
		}
	}
	
	//drop turrets on click
		if(Input.GetMouseButtonDown(0) && lastHitObj && !upgradePanelOpen) //left mouse was clicked, and we have a tile selected
		{
			focusedPlane = lastHitObj.GetComponent(PlacementPlane); //cache the script for this plane
			if(focusedPlane.isOpen && turretCosts[structureIndex] <= cashCount && !waveActive) //if the plane has nothing obstructing it, and we have enough cash
			{
				//drop the chosen structure exactly at the tile's position, and rotation of zero.
				var newStructure : GameObject = Instantiate(allStructures[structureIndex], lastHitObj.transform.position, Quaternion.identity);
				//set the new structure to have a left facing rotation, for looks and to mke all the colliders line up evenly
				newStructure.transform.localEulerAngles.y = 270;
				//set this tile's tag to "Taken", so we can't double-place structures
				focusedPlane.myStructure = newStructure;
				focusedPlane.isOpen = false;
				
				audio.Play();
				
				cashCount -= turretCosts[structureIndex];
				UpdateGUI();
				
				
			}
			else if(focusedPlane.myStructure != null && structureIndex == 0 ) //if the plane already holds a turret and the turret builder is selected
			{
				ShowUpgradeGUI(); //show upgrade option if available
				UpdateGUI();			
			}
			
			
		}// End building block

	//Wave State
	if(waveActive)
	{
		Seconds = 0;
		Minutes = 0;
		//check for remaining enemies
		if(enemyCount <= 0)
		{
			FinishWave(); //end this wave
		}
	}
				
	//Timer
	
	// This if statement checks how many seconds there are to decide what to do.
    // If there are more than 0 seconds it will continue to countdown.
    // If not then it will reset the amount of seconds to 59 and handle the minutes;
    // Handling the minutes is very similar to handling the seconds.
    if(Seconds <= 0)
    {
        Seconds = 59;
        if(Minutes >= 1)
        {
            Minutes--;
        }
        else
        {
            Minutes = 0;
            Seconds = 0;
            // This makes the guiText show the time as X:XX. ToString.("f0") formats it so there is no decimal place.
            waveTimer.text = "Next Wave " + Minutes.ToString("f0") + ":0" + Seconds.ToString("f0");
        }
    }
    else
    {
        Seconds -= Time.deltaTime;
    }
     
    // These lines will make sure the time is shown as X:XX and not X:XX.XXXXXX
    if(Mathf.Round(Seconds) <= 9)
    {
    	waveTimer.text = "Next Wave " + Minutes.ToString("f0") + ":0" + Seconds.ToString("f0");
    }
    else
    {
        waveTimer.text = "Next Wave " + Minutes.ToString("f0") + ":" + Seconds.ToString("f0");
    }
    
    if(Minutes <= 0 && Seconds <= 0 && !waveActive)
	{
		//Debug.Log("New wave started");
		StartNewWave(); //start the new wave!
	}
	
	if(explosionEvent)
	{
	AstarController.Scan();
	//Debug.Log("explosion scan");
	explosionEvent = false;
	
	}

	if (!waveActive && playerReady)
	{
		Seconds = 0;
		Minutes = 0;
		playerReady = false;
	}
	
	 if (Input.GetKeyDown(KeyCode.Escape)) {
		Application.LoadLevel("MainMenu");
		}
	
				
} // end update function


//Spawn new enemies
function SpawnNewEnemy()
{
	//get a random index to choose an enemy prefab with
	var enemyChoice = 0;
	
	//give the potential to spawn different kinds of enemies from different places, spawn based on tag
	var spawnChoice : int;
	if(enemyPrefabs[enemyChoice].tag == "Ground Enemy") //spawn ground enemy
	{
		//get a random index to choose spawn location with
		spawnChoice = 0;
		//spawn the tank, at the chosen location and rotation
		Instantiate(enemyPrefabs[enemyChoice], SpawnPoints[spawnChoice].position, SpawnPoints[spawnChoice].rotation);
	}
	//let the game know we just added an enemy, for keeping track of wave completion
	enemyCount++;
}

function Go()
{
	playerReady = true;
}

//start the new wave
function StartNewWave()
{
	//Set the GUI
	UpdateGUI();
	AstarController.Scan();
	teleportedThisWave = false;
	
	if (enemyCount <=0 && !waveActive)
	{
	//spawn the enemies
		//Debug.Log("New enemy spawned");
		SpawnNewEnemy();
		waveActive = true;
	}
}

//Prepare for next wave
function SetNextWave()
{
	waveLevel++; //up the wave level
	difficultyMultiplier = ((Mathf.Pow(waveLevel, 2))*.005)+1; //up the difficulty, exponentially
}

//End the wave
function FinishWave()
{
	waveActive = false;
	cashCount += (cashGrant + (10 * waveLevel) * Mathf.Round(scoreCount*.000066)); 
	
	//on to the next one
	SetNextWave();
	Seconds = nextWaveTimeSec;
	Minutes = nextWaveTimeMin;
	
	
		if (waveLevel == wavesThisLevel)
		{
		ShowEndMenu();
		levelOver = true;
		
		
//		yield WaitForSeconds (3);
//		Application.LoadLevel("MainMenu");
		}
	UpdateGUI();
}

function ShowEndMenu()
{
	endMenuOpen = true;
	levelEndTweener.Play(true);

}


//Upgrading Structures
function ShowUpgradeGUI()
{	
	//get the plane's structure, and that structure's upgrade options
	structureToUpgradeScript = focusedPlane.myStructure.GetComponent(Turret_Cannon);
	
	upgradeStructure = structureToUpgradeScript.myUpgrade;

	//if the structure can be upgraded, show menu
	if(upgradeStructure != null)
	{
		upgradePanelOpen = true; //first off, set the state
		//Debug.Log(structureToUpgradeScript);
		
		upgradePanelTweener.Play(true); //fly in the panel
	}
}

function UpgradeSpeed()
{
 upgradeCost = (2 *structureToUpgradeScript.speedLevel) - 1; // each upgrade costs (2* upgradelevel) -1
	if (upgradeCost < cashCount)
	{
	structureToUpgradeScript.reloadTime = 1 / (structureToUpgradeScript.speedLevel); // this increases the turrets firing speed each upgrade

	structureToUpgradeScript.speedLevel += 1; // Increases the speed level by 1
	cashCount -= upgradeCost; //subtract upgrade cost

	UpdateGUI(); //update the GUI
	Debug.Log(structureToUpgradeScript.reloadTime);
	}

}

function UpgradeDamage()
{
upgradeCost = (2 *structureToUpgradeScript.damageLevel) - 1; // each upgrade costs (2* upgradelevel) -1

if (upgradeCost < cashCount)
	{
	structureToUpgradeScript.myDamageAmount += 1 + (Mathf.Round(0.0876 * (structureToUpgradeScript.myDamageAmount + structureToUpgradeScript.damageLevel)))  ; // algorithm to increase damage each upgrade

	structureToUpgradeScript.damageLevel += 1; //Increase the damage level by 1
	cashCount -= upgradeCost; //subtract upgrade cost
	UpdateGUI(); //update the GUI
	Debug.Log(structureToUpgradeScript.myDamageAmount);
	}

}

function SellTower()
{
	if (!waveActive)
	{
		Debug.Log(lastHitObj);
		Destroy(structureToUpgradeScript.gameObject); //destroy old tower
		turretSold = true;
		focusedPlane.isOpen = true;
		focusedPlane.myStructure = null;
		cashCount += sellPrice + ((2 *structureToUpgradeScript.damageLevel) - 2) + ((2 *structureToUpgradeScript.speedLevel) - 2); 
		UpdateGUI(); //update the GUI
		upgradePanelTweener.Play(false); //hide the upgrade panel
		upgradePanelOpen = false; //update the state
		AstarController.Scan();
	}

}

function CancelUpgrade()
{
	upgradePanelTweener.Play(false); //hide the upgrade panel
	upgradePanelOpen = false; //update the state
}

//-- Custom Functions --//

//One Update to Rule them All!
//this function will eventually contain all generic update events
//this makes sure we don't have the same small parts being called over and over in different ways, throughout the script
function UpdateGUI()
{
	//Go through all structure buttons (the buttons in the build panel), and set them to "off"
	for(var theBtnGraphic : UISlicedSprite in buildBtnGraphics)
	{
		theBtnGraphic.color = offColor;
	}
	//set the selected build button to "on"
	buildBtnGraphics[structureIndex].color = onColor;
	
	waveText.text = "Wave: "+waveLevel;
	scoreText.text = "Score: "+scoreCount;
	cashText.text = "Cash: "+cashCount;
	scoreText2.text = "Score: "+scoreCount;
	
	if(upgradePanelOpen)
	{
		damageUpText.text = "Damage lv: "+ structureToUpgradeScript.damageLevel;
		speedUpText.text = "Speed lv: "+ structureToUpgradeScript.speedLevel;
	}
	
	CheckTurretCosts();
}

//Called whenever a structure choice is clicked (the button in the build panel)
function SetBuildChoice(btnObj : GameObject)
{
	//when the buttons are clicked, they send along thier GameObject as a parameter, which is caught by "btnObj" above
	//we then use that btnObj variable, and get it's name, so we can easily check exactly which button was pressed
	var btnName : String = btnObj.name;
	
	//set an "index"  based on which button was pressed
	//by doing this, we can easily tell, from anywhere in the script, which structure is currently selected
	//also, if we order things just right, we can use this "index" to reference the correct array items automatically!
	if(btnName == "Btn_Cannon")
	{
		structureIndex = 0;
	}
	else if(btnName == "Btn_Missile")
	{
		structureIndex = 3;
	}
	else if(btnName == "Btn_Mine")
	{
		structureIndex = 2;
	}
	
	//call this as a seperate function so that, as things get more complicated,
	//all GUI can be updated at once, in the same way
	UpdateGUI();
}

//Checks to make sure we can purchase!
function CheckTurretCosts()
{
	//iterate over all structure buttons
	for(var i : int = 0;i<allStructures.length;i++)
	{
		if(turretCosts[i] > cashCount) //is the cost of this button's turret too much?
		{
			costTexts[i].color = Color.red; //set cost text to red color
			buildBtnGraphics[i].color = Color(.5,.5,.5,.5); //set btn graphic to half-alpha grey
			buildBtnGraphics[i].transform.parent.gameObject.collider.enabled = false; //disable this btn
		}
		else //hurray, we can afford this button's turret!
		{
			costTexts[i].color = Color.green; //set cost text to green color
			
			if(structureIndex == i) //is this button currently selected for placement?
				buildBtnGraphics[i].color = onColor; //set the color to "on"
			else //nope, this button is not currently selected, so...
				buildBtnGraphics[i].color = offColor; //...set the color to "off"
				
			buildBtnGraphics[i].transform.parent.gameObject.collider.enabled = true; //enable this button
		}
	}
}

//Generic function to quickly check if we can afford an item, and apply colors and settings to the item's button
function CostCheckButton(theBtn : GameObject, itemCost : int) 
{
	if(cashCount < itemCost) // can't afford this item
	{
		theBtn.transform.Find("Label").gameObject.GetComponent(UILabel).color = Color.red; //set cost text to red color
		theBtn.transform.Find("Background").gameObject.GetComponent(UISlicedSprite).color = Color(.5,.5,.5,.5); //set btn graphic to half-alpha grey
		theBtn.collider.enabled = false; //disable button collider
	}
	else // can afford this item
	{
		theBtn.transform.Find("Label").gameObject.GetComponent(UILabel).color = Color.green; //set cost text to red color
		theBtn.transform.Find("Background").gameObject.GetComponent(UISlicedSprite).color = onColor; //set the color to "on"
		theBtn.collider.enabled = true; //enable button collider
	}
}

