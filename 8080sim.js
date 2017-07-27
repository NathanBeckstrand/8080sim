"use strict";

//simConsole.buffer = "Hello World!  This is a test.";
simConsole.draw();
var myVar = setInterval(runSimulatorFrame, 50);

function runSimulatorFrame() {
	if (simConsole.isScreenChanged) simConsole.draw();
}

function conPrint(s) {
	simConsole.charOut(s + "\n");
	//s += "\n";
	//for (var i = 0; i < s.length; i++) {
	//	console.log("'" + s.charAt(i) + "', chr " + s.charCodeAt(i) + ".");
	//}
}

conPrint("hello");

// TEST ADD B
//conPrint("CPU.regA= " + CPU.regA + " CPU.regB= " + CPU.regB + " - A and B = 0");
//CPU.regB = 1;
//conPrint("CPU.regA= " + CPU.regA + " CPU.regB= " + CPU.regB + " - A = 0 and B = 1");
//CPU.execute();
//conPrint("CPU.regA= " + CPU.regA + " CPU.regB= " + CPU.regB + " - A = 1 and B = 1");
//CPU.execute();
//conPrint("CPU.regA= " + CPU.regA + " CPU.regB= " + CPU.regB + " - A = 2 and B = 1");