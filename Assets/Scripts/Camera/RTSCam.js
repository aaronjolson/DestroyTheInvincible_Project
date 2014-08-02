#pragma strict

	// This script controls the movement of the camera, it translates the camera when the mouse touches near the edges of the viewport

    var CamSpeed: float = 1.00;
    var GUIsize: float = 45;
    
    var CamLimitUp: float = 0;
    var CamLimitDown: float = 0;
    var CamLimitLeft: float = 0;
    var CamLimitRight: float = 0;
     
    function Start()
    {
    CamLimitUp = CamLimitUp + (Screen.height /10);
    CamLimitUp = -Screen.height /10;
    
    CamLimitLeft = CamLimitLeft + (-Screen.width / (Screen.width * 0.023));
    CamLimitRight = CamLimitRight + (Screen.width / (Screen.width * 0.023));
    
//    Debug.Log(CamLimitUp);
//    Debug.Log(CamLimitUp);
//    Debug.Log(CamLimitLeft);
//    Debug.Log(CamLimitRight);
    
    }
    
    function Update () {
    
    var recdown = Rect (0, 0, Screen.width, GUIsize);
    var recup = Rect (0, Screen.height-GUIsize, Screen.width, GUIsize);
    var recleft = Rect (0, 0, GUIsize, Screen.height);
    var recright = Rect (Screen.width-GUIsize, 0, GUIsize, Screen.height);
     
        if (recdown.Contains(Input.mousePosition)){
        	if (transform.position.z > CamLimitDown){
            transform.Translate(0, 0, -CamSpeed, Space.World);
            }
            }
     
        if (recup.Contains(Input.mousePosition)){
        	if (transform.position.z < CamLimitUp){
            transform.Translate(0, 0, CamSpeed, Space.World);
            }
            }
     
        if (recleft.Contains(Input.mousePosition)){
        	if (transform.position.x > CamLimitLeft){
            transform.Translate(-CamSpeed, 0, 0, Space.World);
            }
            }
            
     
        if (recright.Contains(Input.mousePosition)){
        	if (transform.position.x < CamLimitRight){
            transform.Translate(CamSpeed, 0, 0, Space.World);
            }
            }
    }