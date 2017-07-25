"use strict";

CPU.ADD = function(inputVal) {
	CPU.regA = (inputVal + CPU.regA) & 0xFF;
};

