"use strict";

simConsole.draw = function() {
	var HTMLstr = "";
	var textBeforeCursor = "";
	var textAtCursor = "";
	var textAfterCursor = "";
	var textColorCSS = ""
	var cursorColorCSS = ""
	if (this.xSize == 0 || this.Size == 0) {
		return;
	}
	
	while (this.buffer.length < this.offset + this.ySize) {
		this.buffer.push("");
	}
	
	this.updateConsoleText();
	
	textColorCSS = "background-color: " + this.textBackgroundColor +
				   "; color: " + this.textForegroundColor + ";";
	if (this.cursorShow) {
		cursorColorCSS = "background-color: " + this.textForegroundColor +
						 "; color: " + this.textBackgroundColor + ";";
	} else {
		cursorColorCSS = textColorCSS;
	}
	simConsole.textBeforeCursorHTML.style = textColorCSS;
	simConsole.textAtCursorHTML.style = cursorColorCSS;
	simConsole.textAfterCursorHTML.style = textColorCSS;
	
	textBeforeCursor += "buffer.length=" + this.buffer.length + "\r\r"; // For testing

	for (var i = 0; i < this.ySize; i++) {
		var textLine = "";
		var beforeTextLine = "";
		var afterTextLine = "";
		
		afterTextLine = "\r";
		
		textLine = this.buffer[this.offset + i];
		if (textLine.length < this.xSize) textLine += " ".repeat(this.xSize - textLine.length);  // Pad line to screen width
		
		if (i < this.cursorY) {
			textBeforeCursor += beforeTextLine + textLine + afterTextLine;
		} else if (i > this.cursorY) {
			textAfterCursor +=  beforeTextLine + textLine + afterTextLine;
		} else {
			this.textUnderCursor = textLine.substr(this.cursorX, 1)
			textBeforeCursor += beforeTextLine + textLine.substr(0, this.cursorX);
			textAtCursor     += this.textUnderCursor;
			textAfterCursor  += textLine.substring(this.cursorX + 1, textLine.length) + afterTextLine;
		}
	}
	
	textAfterCursor += "\rInput buffer=<span style=\"background-color:#eee\">'" + this.inputBuffer + "'</span>";
	
	this.textBeforeCursorHTML.innerHTML = textBeforeCursor;
	this.textAtCursorHTML.innerHTML = textAtCursor;
	this.textAfterCursorHTML.innerHTML = textAfterCursor;
	
	if (this.cursorBlinkSetInterval == null) {
		this.cursorBlinkSetInterval = setInterval(simConsole.cursorBlink, this.cursonFlashRate);
	}
	
	this.isScreenChanged = false;
	console.log("Screen repainted at " + "TIME" + ".");  // For testing.
};