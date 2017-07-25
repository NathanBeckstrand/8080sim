"use strict";

CPU.execute = function() {
	var opcode;
	opcode = MMU.read(CPU.PC);
	CPU.PC += 1;
	switch(opcode) {
		case 0x00: // NOP - No Operation
			//saveData(DEST,instruction(TYPE,readData(SOURCE)));
			break;
		case 0x01:
			
			break;
		case 0x02:
			
			break;
		case 0x80: // ADD B - ADD
			CPU.ADD(CPU.regB);
			break;

		default:
		console.log("Warning: Opcode " + opcode + " was not processed.");
	}
};