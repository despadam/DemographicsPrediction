
/*
document.onmousemove = handleMouseMove;
setInterval(getMouseMove, 200); //track mouse movements every K milliseconds
document.onclick = handleMouseClick
document.onwheel = handleWheelMove;
document.onkeydown = handleTyping;

*/


/*
var mouseSpeedAvg=0.0, mouseSpeedMax=0.0, mouseSpeedMin=Infinity, mouseSpeedSum=0.0, nofMouseMoves=0;
var mouseX, mouseY, oldmouseX, oldmouseY, timestamp, oldtimestamp;
var mouseMoved = false;
var nofMouseClicks=0, lastTimeClicked = Date.now(), timeBetweenClicksMin=Infinity, timeBetweenClicksMax=0.0, timeBetweenClicksAvg=0.0, timeBetweenClicksSum=0.0;
var nofWheelEvents=0; // scrolledUpwards=0, scrolledDownwards=0;
var nofKeysPressed=0, timeBetweenKeysMin=Infinity, timeBetweenKeysMax=0.0, timeBetweenKeysSum=0.0, timeBetweenKeysAvg=0.0, lastTimePressed = Date.now();
*/


function handleMouseMove(e) {
    oldtimestamp = timestamp;
    oldmouseX = mouseX;
    oldmouseY = mouseY;
    timestamp = Date.now();
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseMoved = true;
};


function getMouseMove() {
    if (mouseMoved == true) {
        mouseMoved = false;
        mouseSpeed = ( Math.sqrt( Math.pow(oldmouseX - mouseX, 2) + Math.pow(oldmouseY - mouseY, 2) )  ) / ( (timestamp - oldtimestamp) / 1000 ); 
        mouseSpeedSum += mouseSpeed;
        nofMouseMoves += 1;
        mouseSpeedAvg = mouseSpeedSum / nofMouseMoves;
        if(mouseSpeed > mouseSpeedMax)
            mouseSpeedMax = mouseSpeed;
        if(mouseSpeed < mouseSpeedMin)
            mouseSpeedMin = mouseSpeed

        //console.log(mouseSpeed);
        //console.log(mouseSpeedSum);
        //console.log(nofMouseMoves);
        //console.log(mouseSpeedAvg);
        //console.log(mouseSpeedMax);
        //console.log(mouseSpeedMin);
    }
};


function handleMouseClick(e) {
    nofMouseClicks += 1;
    timeBetweenClicks = (Date.now() - lastTimeClicked) / 1000;
    lastTimeClicked = Date.now();
    timeBetweenClicksSum += timeBetweenClicks;
    timeBetweenClicksAvg = timeBetweenClicksSum / nofMouseClicks;
    if(timeBetweenClicks > timeBetweenClicksMax)
        timeBetweenClicksMax = timeBetweenClicks;
    if(timeBetweenClicks < timeBetweenClicksMin)
        timeBetweenClicksMin = timeBetweenClicks;

    //console.log(nofMouseClicks);
    //console.log(timeBetweenClicksAvg);
    //console.log(timeBetweenClicksMax);
    //console.log(timeBetweenClicksMin);
};


function handleWheelMove(e) {
    nofWheelEvents += 1;
    /*
    if(e.deltaY > 0)	// not crossplatformed, reported in pixels for every browser, lines for firefox
        scrolledUpwards += e.deltaY;
    else
        scrolledDownwards -= e.deltaY;
    */
    //console.log(nofWheelEvents);
    //console.log(scrolledUpwards);
    //console.log(scrolledDownwards);
};


function handleTyping(e){
    nofKeysPressed += 1;
    timeBetweenKeys = (Date.now() - lastTimePressed) / 1000;	// in seconds
    lastTimePressed = Date.now();
    timeBetweenKeysSum += timeBetweenKeys;
    timeBetweenKeysAvg = timeBetweenKeysSum / nofKeysPressed;
    if(timeBetweenKeys > timeBetweenKeysMax)
        timeBetweenKeysMax = timeBetweenKeys;
    if(timeBetweenKeys < timeBetweenKeysMin)
        timeBetweenKeysMin = timeBetweenKeys;


    //console.log(timeBetweenKeysAvg);
    //console.log(timeBetweenKeysMax);
    //console.log(timeBetweenKeysMin);
};