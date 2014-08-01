#pragma strict

	var nextWayTarget : Transform;
	var wayPointIndex : int = 0;

function Start () {
	wayPointIndex = 0;
	nextWayTarget = GameObject.FindWithTag("WayPoint").GetComponent(Transform);
	
}

function Update () {

}

function OnTriggerEnter(col : Collider)
{
	if(col.gameObject.tag == "WayPoint")
	{
		//getcomponent waypoint's Transform
		//getcomponent groundtarget transfrom
		//GroundTargetObject.transform.position = waypoint2.position || endpoint.position;
		
		gameObject.GetComponent(Enemy_GroundUnit).GetNewPath();		
	}
}