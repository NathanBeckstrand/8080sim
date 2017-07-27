"use strict";

var simConsole = {
	buffer               : [],
	xSize                : 80,
	ySize                : 25,
	offset               : 0,
    cursor               : null,
	cursorX              : 0,
	cursorY              : 0,
	textUnderCursor      : "",
	cursorShow           : true,
	cursorLastFlashTime  : null, 
	cursonFlashRate      : 500,        // Miliseconds
	simConsoleHTML       : document.getElementById("CRT"),
    textBeforeCursorHTML : document.getElementById("textBeforeCursor"),
    textAtCursorHTML     : document.getElementById("textAtCursor"),
    textAfterCursorHTML  : document.getElementById("textAfterCursor"),
	textForegroundColor  : "#0f0",
    textBackgroundColor  : "#040",
    inputBuffer          : "",
    outputBuffer         : "",
    inputBufferMaxSize   : 10,
    localEcho            : true,
	isScreenChanged      : false,
    cursorBlinkSetInterval : null,
    cursorBlink : function() {
        var cursorHTML = "";
        var foregroundColor = "";
        var backgroundColor = "";
        
        simConsole.cursorShow = ! simConsole.cursorShow;
        
        if (simConsole.cursorShow) {
            foregroundColor = simConsole.textBackgroundColor;
            backgroundColor = simConsole.textForegroundColor;
        } else {
            foregroundColor = simConsole.textForegroundColor;
            backgroundColor = simConsole.textBackgroundColor;
        }
        
		simConsole.textAtCursorHTML.style = "background-color:" + backgroundColor +
											"; color:" + foregroundColor + ";";
    },
    getKeyPress : function(event) {
        //this.inputBuffer += String.fromCharCode(event.charCode);
        switch(event.key) {
            case "ArrowUp":
                this.moveCursorRel(0,-1)
                break;
            case "ArrowDown":
                this.moveCursorRel(0,1)
                break;
            case "ArrowLeft":
                this.moveCursorRel(-1,0)
                break;
            case "ArrowRight":
                this.moveCursorRel(1,0)
                break;

            default:
                if (event.key.length == 1) {
					this.inputBuffer += event.key;
					if (this.localEcho) this.charOut(event.key);
				} else {
					console.log("Warning: The key '" + event.key + "' was not processed.");
				}
        }
        //this.draw();
    },
    moveCursorRel : function(x, y) {
        this.isScreenChanged = true;
		this.cursorX += x;
        this.cursorY += y;
        while(this.cursorX >= this.xSize) {
            if (this.cursorY >= this.ySize - 1) {
                this.cursorX = this.xSize - 1;
            } else {
                this.cursorX -= this.xSize;
                this.cursorY += 1;
            }
        }
        while(this.cursorX < 0) {
            if (this.cursorY <= 0) {
                this.cursorX = 0;
            } else {
                this.cursorX += this.xSize;
                this.cursorY -= 1;
            }
        }
        if (this.cursorY < 0) this.cursorY = 0;
        if (this.cursorY > this.ySize -1) this.cursorY = this.ySize -1;
    },
    charOut : function(s) {
        this.outputBuffer += s;
		this.isScreenChanged = true;
    },
    addTextToLineOLD1 : function(lineNumber, offset, textToAdd) {
        var s = "";
        while (this.buffer.length < lineNumber) {
            this.buffer.push("");
        }
        s = this.buffer[lineNumber];
        if (s.length < offset) s += " ".repeat(offset - s.length);
        s += textToAdd;
        if (s.length > this.xSize) {
            this.addTextToLine(lineNumber + 1, 0, s.substring(this.xSize,s.length));
            s = s.substring(0,this.xSize);
        }
        this.buffer[lineNumber] = s;
    },
	addTextToLine : function(lineNumber, offset, textToAdd) {
		//this.addTextToLineOLD(lineNumber, offset, textToAdd);
        while (this.buffer.length < lineNumber) {
            this.buffer.push("");
		}
		var s = this.buffer[lineNumber];
		if (s.length < offset) s += " ".repeat(offset - s.length);
		for (var c in textToAdd) {
			//console.log("'" + textToAdd[c] + "'");
			//if (textToAdd.substr(c,1) == "\n") console.log("CR Detected");
			//console.log("'" + textToAdd.charAt(c) + "'");
			if (offset < this.xSize && textToAdd[c] != "\n") {
				//console.log("'" + textToAdd[c] + "'");
				console.log("Char='" + textToAdd.charAt(c) + "' charCode=" + textToAdd.charCodeAt(c) + ".");
				s = s.substring(0,offset) + textToAdd[c] + s.substring(offset,s.length);
				offset += 1;
			} else {
				console.log("New Line - offset=" + offset + "  xSize=" + this.xSize + "  charCodeAt(c)=" + textToAdd.charCodeAt(c));
				this.cursorX = 0;
				this.addTextToLine(lineNumber + 1, 0, s.substring(c,s.length));
			}
		}
		this.buffer[lineNumber] = s;
	},
	addTextToLineNew : function(lineNumber, offset, textToAdd) {
		// If buffer has less lines than lineNumber then add lines until buffer
		// has number of lines == lineNumber.
		
		// If buffer line 
		
		for (var i = 0; i < textToAdd.length; i++) {
			console.log("'" + textToAdd.charAt(i) + "', chr " + textToAdd.charCodeAt(i) + ".");
		}
	},
    lineFeed : function() {
		if (this.emptyLine.length != this.xSize) this.emptyLine = " ".repeat this.xSize;
	},
	updateConsoleText : function() {
        if (this.outputBuffer.length > 0) {
            //for (var i = 0; i < this.outputBuffer.length; i++) {
			//	console.log("'" + this.outputBuffer.charAt(i) + "', chr " + this.outputBuffer.charCodeAt(i) + ".");
			//}
			this.addTextToLine(this.offset + this.cursorY, this.cursorX, this.outputBuffer);
            this.moveCursorRel(this.outputBuffer.length,0);
            this.outputBuffer = "";
        }
    }
};