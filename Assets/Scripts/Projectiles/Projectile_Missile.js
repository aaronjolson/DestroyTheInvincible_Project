#pragma strict

class Projectile_Missile extends Projectile_Base
{
	function Update () 
	{
		transform.Translate(Vector3.forward * Time.deltaTime * mySpeed);
		myDist += Time.deltaTime * mySpeed;
		if(myDist >= myRange)
			Explode();
		
		if(myTarget)
		{
			transform.LookAt(myTarget);
		}
		else
		{
			Explode();
		}
	}
}