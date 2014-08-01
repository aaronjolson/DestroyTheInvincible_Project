#pragma strict

	var turretScript : Turret_Cannon;
	
function Start () {

}

function Update () 
{

}

function OnTriggerEnter(other : Collider)
	{
		if(other.gameObject.tag == "BlockingCollider")
		{
			//Debug.Log("Collision with turret"); 
			turretScript = other.transform.parent.GetComponent(Turret_Cannon);
			turretScript.damageDoubled = true; 
		}
		
	}
		
			