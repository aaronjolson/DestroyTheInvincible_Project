#pragma strict	
    
//This script is to be placed on the enemy object    
    
    var target : Transform;
 
 function Awake() 
	{
	//connect to outbound teleporter
	target = GameObject.FindWithTag("TeleportOut").GetComponent(Transform);
	}    
     
    function Update () 
    {    
    }       
     
    function OnTriggerEnter (col : Collider) 
    {  
    //need TeleportIn tag on TeleportIn Object
	    if(col.gameObject.tag == "TeleportIn" && gameObject.GetComponent(Enemy_GroundUnit).levelMaster.teleportedThisWave == false) 
	    {        
	    	this.transform.position = target.position;
	    	//the script Enemy_GroundUnit needs to be attached to the Enemy object so the function GetNewPath(); can be called after teleportation
	    	gameObject.GetComponent(Enemy_GroundUnit).GetNewPath();
	    	gameObject.GetComponent(Enemy_GroundUnit).levelMaster.teleportedThisWave = true;
	    	gameObject.GetComponent(Enemy_GroundUnit).horizontalSpeed = 13;      
	    }
	}

