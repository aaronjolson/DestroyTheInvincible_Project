#pragma strict

var myExplosion : GameObject;
var myTarget : Transform;
var myRange : float = 10;
var mySpeed : float = 10;
var myDist : float;

function OnTriggerEnter(other : Collider)
{
	if(other.gameObject.tag == "Ground Enemy")
	{
		Explode();
	}
}

function Explode()
{
	Instantiate(myExplosion, transform.position, Quaternion.identity);
	Destroy(gameObject);
}