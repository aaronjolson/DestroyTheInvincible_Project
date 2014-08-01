#pragma strict

class Turret_Cannon extends Turret_Base
{
	var levelMaster : LevelMaster;
	
	var myProjectile : GameObject;
	var turnSpeed : float = 20f;
	var firePauseTime : float = .25f;
	var muzzleEffect : GameObject;
	var errorAmount : float = 0f;
	var myTarget : Transform;
	var muzzlePositions : Transform[];
	var turretBall : Transform;
	var rayorigin : Transform;
	
	var reloadTime : float = 1f;
	var myDamageAmount : float = 5f;
	var rayRange: float = 30f; // firing range
	var nextFireTime : float;
	
	//private var nextMoveTime : float;
	private var desiredRotation : Quaternion;
	private var aimError : float;
	
	//var damageUpgradeCost : int;
	//var speedUpgradeCost : int;
	var speedLevel: float = 1f;
	var damageLevel: int = 1;
	
	var damageDoubled : boolean = false;

	function Start () 
	{
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
	}

	function Update () 
	{
		if(myTarget) 
		{
			//if(Time.time >= nextMoveTime)
			//{
				CalculateAimPosition(myTarget.position);
				turretBall.rotation = Quaternion.Lerp(turretBall.rotation, desiredRotation, Time.deltaTime*turnSpeed);
			//}
			
			//Debug.Log(nextFireTime); 
			if(Time.time >= nextFireTime)
			{
				FireProjectile();
				
			}
		}
	}

//	function OnTriggerEnter(other : Collider)
//	{
//		if(other.gameObject.tag == "Ground Enemy")
//		{
//			myTarget = other.gameObject.transform;
//		}
//	}
	
	function OnTriggerStay(other : Collider)
	{
		if(other.gameObject.tag == "Ground Enemy")
		{
			myTarget = other.gameObject.transform;
		}
	}

	function OnTriggerExit(other : Collider)
	{
		if(other.gameObject.transform == myTarget)
//		if(other.gameObject.tag == "TurretTarget")
		{
			myTarget = null;
		}
	}

	function CalculateAimPosition(targetPos : Vector3)
	{
	var aimPoint = Vector3(targetPos.x-transform.position.x, targetPos.y-transform.position.y, targetPos.z-transform.position.z);
	desiredRotation = Quaternion.LookRotation(aimPoint);
	}

	function FireProjectile()
	{
		
		audio.Play();
		nextFireTime = Time.time+reloadTime;	
		
		var hit : RaycastHit;
		
			if (Physics.Raycast(rayorigin.position, rayorigin.forward, hit, rayRange, 1<<13)) {
				if(hit.collider != null ){
	    			if (hit.collider.tag == "Ground Enemy") {
	    				if (damageDoubled){
		    				hit.collider.SendMessage("TakeDamage", (myDamageAmount * 2), SendMessageOptions.DontRequireReceiver);
		    				//Debug.Log(" double damage projectile fired");
		    				levelMaster.scoreCount += (myDamageAmount * 2);
		    				levelMaster.UpdateGUI();
	    				}
	    				else {
		    				hit.collider.SendMessage("TakeDamage", myDamageAmount, SendMessageOptions.DontRequireReceiver);
		    				//Debug.Log("projectile fired");
		    				levelMaster.scoreCount += myDamageAmount;
		    				levelMaster.UpdateGUI();
	    				}
	    				
	    			}
	    			else {
	    				Debug.Log("Hit a different collider");
	    			}
	    		 }
			 }
		
		for(theMuzzlePos in muzzlePositions)
		{
			Instantiate(myProjectile, theMuzzlePos.position, theMuzzlePos.rotation);
			Instantiate(muzzleEffect, theMuzzlePos.position, theMuzzlePos.rotation);
		}
	}
}