#pragma strict

// This script is attached to the end point, 
// gets the component LevelMaster
// and  tells level master when the enemy reaches the end point.

var levelMaster : LevelMaster;

function Awake() 
{
	//connect to levelmaster
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
}


function OnTriggerEnter (col : Collider)
{
	if (col.gameObject.tag == "Ground Enemy" || col.gameObject.tag == "Air Enemy")
	{
		//Debug.Log("enemy destroyed", col.gameObject);
		
		Destroy(col.gameObject);
		levelMaster.enemyCount--;
	}
}
