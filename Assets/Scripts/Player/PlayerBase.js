#pragma strict

//levelmaster
var levelMaster : LevelMaster;

function Start () 
{
	//connect to levelmaster
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
}

function OnTriggerEnter (other : Collider)
{
	if(other.gameObject.tag == "Ground Enemy" || other.gameObject.tag == "Air Enemy")
	{
		Destroy(other.gameObject);
		levelMaster.enemyCount--;
		//levelMaster.healthCount--;
		levelMaster.UpdateGUI();
	}
}