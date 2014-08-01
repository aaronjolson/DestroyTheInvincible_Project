	

    //zoom camera
    var distance : float = 60;
    var sensitivityDistance : float = 50;
    var damping : float = 5;
    var minFOV : float = 40;
    var maxFOV : float = 60;
     
     
     
    function Start () {
     
    distance = camera.fieldOfView;
     
    }
     
     
    function Update () {
     
     
    distance -= Input.GetAxis("Mouse ScrollWheel") * sensitivityDistance;
    distance = Mathf.Clamp(distance, minFOV, maxFOV);
    camera.fieldOfView = Mathf.Lerp(camera.fieldOfView, distance, Time.deltaTime * damping);
     
    }

