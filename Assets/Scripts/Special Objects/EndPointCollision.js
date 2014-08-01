#pragma strict

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
		Debug.Log("enemy destroyed", col.gameObject);
		
		Destroy(col.gameObject);
		levelMaster.enemyCount--;
	}
}
