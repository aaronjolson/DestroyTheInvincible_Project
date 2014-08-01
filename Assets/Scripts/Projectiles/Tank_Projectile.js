#pragma strict

var bombExplosion : GameObject;
//var mySpeed : float = 10;



function OnTriggerEnter(other : Collider)
{
	if(other.gameObject.tag == "Turret")
	{
		Explode();
		Destroy(other.gameObject);
	}
}

function OnTriggerStay(other : Collider)
{
	if(other.gameObject.tag == "Turret")
	{
		Debug.Log("turretLocked");
		Explode();
		Destroy(other.gameObject);
	}
}
// Call a damage function on all objects caught in the
	// radius of an explosion.
	function ExplosionDamage(center: Vector3, radius: float) {
		var hitColliders = Physics.OverlapSphere(center, radius);
		
		for (var i = 0; i < hitColliders.Length; i++) {
			hitColliders[i].SendMessage("AddDamage");
		}
	}

function Explode()
{
	Instantiate(bombExplosion, transform.position, Quaternion.identity);
	Destroy(gameObject);
}