#pragma strict

//This script controls the main menu used in the beginning of the game

var mainMenuTweener : TweenPosition;

var levelSelectTweener : TweenPosition;

function Start () 
{
	mainMenuTweener.Play(false);
	levelSelectTweener.Play(false);
}

function Update () 
{

}

//Main Menu Block
function ChooseLevelBtn()
{
	LevelSelectionMenu();
	mainMenuTweener.Play(true);

}

function TutorialGameBtn()
{
	yield WaitForSeconds(0.3);
	Application.LoadLevel("TutorialLevel1");

}

function Quit()
{
	yield WaitForSeconds(0.3);
	Application.Quit();
}
//End Main Menu Block

// Level Selection Block
function LevelSelectionMenu()
{
	levelSelectTweener.Play(true);
	mainMenuTweener.Play(true);

}

function CancelLevelSelection()
{
	mainMenuTweener.Play(false);
	levelSelectTweener.Play(false);
}