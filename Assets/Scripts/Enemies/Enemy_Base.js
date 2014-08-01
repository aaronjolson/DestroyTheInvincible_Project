#pragma strict
//Base class for all enemies

var levelMaster : LevelMaster;
var smokeTrail : ParticleEmitter;
var explosionEffect : GameObject;
var myCashValue : int = 50;
var speedRange : Vector2 = Vector2(7.0, 10.0);
var forwardSpeed : float = 10.0;
var health : float = 100;
var maxHealth : float = 100;

function Awake() 
{
	//connect to levelmaster
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
	
	//set health and speed
	maxHealth = health;
	forwardSpeed = Random.Range(speedRange.x, speedRange.y);
	
	//multiply the speed and health based on difficulty
	forwardSpeed*= levelMaster.difficultyMultiplier;
	health*= levelMaster.difficultyMultiplier;
	maxHealth*= levelMaster.difficultyMultiplier;	
}

function TakeDamage(damageAmount : float)
{
	if(health>=0)
	{
		health -= damageAmount;
		if(health <= 0)
		{
			Explode();
			return;
		}
		else if(health/maxHealth <= .75) //health is less than half
		{
			smokeTrail.emit = true;
		}
	}
}

function Explode()
{
	//tell the level master an enemy was destroyed!
	Destroy(gameObject);
	levelMaster.enemyCount = levelMaster.enemyCount -1;
	levelMaster.cashCount+=myCashValue;
	//levelMaster.scoreCount+=(maxHealth+forwardSpeed*levelMaster.difficultyMultiplier);
	levelMaster.UpdateGUI();
	
	Instantiate(explosionEffect, transform.position, Quaternion.identity);
}