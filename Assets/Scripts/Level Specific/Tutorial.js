// This script is used for changing between levels during the tutorial game.

#pragma strict
 
 var levelMaster : LevelMaster;
 
 var scoreToProgress : int;
 var gameWaves : int;
 
 var nextLevelName : String;
 var currentLevelName : String;
 
function Start () 
	{
	levelMaster = GetComponent(LevelMaster);
	levelMaster.wavesThisLevel = gameWaves;
	
	}

function Update () {

	if (levelMaster.scoreCount > scoreToProgress && levelMaster.levelOver == true)
		{
			levelComplete();
		}
	else if (levelMaster.scoreCount < scoreToProgress && levelMaster.levelOver == true)
		{
			levelFail();
		}

}

function levelComplete()
{
	levelMaster.levelCompleteText.text = "Level: Complete";
	yield WaitForSeconds (3);
	Application.LoadLevel(nextLevelName);

}

function levelFail()
{
	levelMaster.levelCompleteText.text = "Level: Failed";
	yield WaitForSeconds (3);
	Application.LoadLevel(currentLevelName);
}
