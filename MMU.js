"use strict";

var MMU = {
	read : function(address) {
		return 0x80; // Force any memory read to return this value. 0x80 is ADD B opcode.
	}
};