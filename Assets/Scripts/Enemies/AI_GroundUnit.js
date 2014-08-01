
//This line should always be present at the top of scripts which use pathfinding
import Pathfinding;

var tankTurret : Transform;
var tankBody : Transform;
var tankCompass : Transform;
var turnSpeed : float = 10.0;

var targetPosition : Vector3; //the destination postion
var seeker : Seeker; //the seeker component on this object, this aids in building my path
var controller : CharacterController; //the charactor controller component on this object
var path : Path; //this will hold the path to follow
var speed : float = 100; //speed of movement along the path
var nextWaypointDistance : float = 3.0; //mininum distance required to move toward next waypoint
private var currentWaypoint : int = 0; //index of the waypoint this object is currently at

//do this right away, of course!
function Start()
{
	targetPosition = GameObject.FindWithTag("GroundTargetObject").transform.position;
	GetNewPath();
}

//this function, when called, will generate a new path from this object to the "targetPosition"
function GetNewPath()
{
	//Debug.Log("getting new path!");
	seeker.StartPath(transform.position,targetPosition, OnPathComplete); //tell the seeker component to determine the path
}

//this function will be called when the seeker has finished determining the path
function OnPathComplete(newPath : Path) //the newly determined path is sent over as "newPath", type of "Path"
{
	if (!newPath.error) //if the new path does not have any errors...
	{
        path = newPath; //set the path to this new one
        currentWaypoint = 0; //now that we have a new path, make sure to start at the first waypoint
    }
}

//this function is called by Unity every physics "frame" (ie, many times per second, much like "function Update()")
function FixedUpdate()
{
	if(path == null) //no path?
	{
		return; //...then don't do anything!
	}
	if(currentWaypoint >= path.vectorPath.Length) //reached end of path?
	{
		return; //do...something? We'll do nothing for now...
	}
	
	//find direction to next waypoint
	var dir : Vector3 = (path.vectorPath[currentWaypoint]-transform.position).normalized;
	//find an amount, based on speed, direction, and delta time, to move
    dir *= speed * Time.fixedDeltaTime;
    
    //move! :)
    controller.SimpleMove (dir);
	
	//rotate to face next waypoint
	//transform.rotation = Quaternion.Lerp(transform.rotation, Quaternion.LookRotation(path.vectorPath[currentWaypoint]),1);
	//tankCompass.LookAt(path.vectorPath[currentWaypoint]);
	//tankBody.rotation = Quaternion.Lerp(tankBody.rotation, tankCompass.rotation, Time.deltaTime*turnSpeed); 
	//transform.LookAt(path.vectorPath[currentWaypoint]);
    
    //Check if we are close enough to the next waypoint
    if (Vector3.Distance (transform.position,path.vectorPath[currentWaypoint]) < nextWaypointDistance) 
    {
        currentWaypoint++; //If we are, proceed to follow the next waypoint
    }
}