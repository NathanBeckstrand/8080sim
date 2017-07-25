"use strict";

//simConsole.buffer = "Hello World!  This is a test.";
simConsole.draw();
var myVar = setInterval(runSimulatorFrame, 50);

function runSimulatorFrame() {
	if (simConsole.isScreenChanged) simConsole.draw();
}