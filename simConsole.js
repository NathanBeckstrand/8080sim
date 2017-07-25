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
	draw                 : function() {
		var HTMLstr = "";
        var textBeforeCursor = "";
        var textAtCursor = "";
        var textAfterCursor = "";
		var textColorCSS = ""
		var cursorColorCSS = ""
        //var HTMLBeforeTextNormal = "<span style=\"background-color:#" + this.textBackgroundColor + 
        //    ";color:#" + this.textForegroundColor + ";\">";
        //var HTMLBeforeTextReverse = "<span style=\"background-color:#" + this.textForegroundColor + 
        //   ";color:#" + this.textBackgroundColor + ";\">";
        //var HTMLAfterText = "</span>";
        
		if (this.xSize == 0 || this.Size == 0) {
			return;
		}
		
        //this.fillScreenBuffer();
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
		
        //textBeforeCursor += HTMLBeforeTextNormal;
        //textAtCursor += HTMLBeforeTextReverse;
        //textAfterCursor += HTMLBeforeTextNormal;
        
        for (var i = 0; i < this.ySize; i++) {
            var textLine = "";
            var beforeTextLine = "";
            var afterTextLine = "";
            
            //if (this.ySize > 9 && i < 10) beforeTextLine += "0";      // For testing
			//if (this.ySize > 99 && i < 100) beforeTextLine += "0";    // For testing
			//beforeTextLine += i + ":&gt";                             // For testing
			//afterTextLine = "&lt\r";
            afterTextLine = "\r";
            //textLine = this.buffer.substr(this.offset + (i * this.xSize), this.xSize);
            
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
        //textBeforeCursor += HTMLAfterText;
        //textAtCursor += HTMLAfterText;
        //textAfterCursor += HTMLAfterText;
        
        textAfterCursor += "\rInput buffer=<span style=\"background-color:#eee\">'" + this.inputBuffer + "'</span>";
        
        this.textBeforeCursorHTML.innerHTML = textBeforeCursor;
        this.textAtCursorHTML.innerHTML = textAtCursor;
        this.textAfterCursorHTML.innerHTML = textAfterCursor;
        
        if (this.cursorBlinkSetInterval == null) {
            this.cursorBlinkSetInterval = setInterval(simConsole.cursorBlink, this.cursonFlashRate);
        }
		
		this.isScreenChanged = false;
		console.log("Screen repainted at " + "TIME" + ".");  // For testing.
	},
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
        //if (this.cursorX < 0) {
        //    this.cursorX = 0;
        //    if (this.cursorY > 0) this.cursorX = this.xSize - 1;
        //    this.cursorY -= 1;
        //}
        //if (this.cursorX > this.xSize - 1) {
        //    this.cursorX = 0;
        //    this.cursorY += 1;
        //}
        if (this.cursorY < 0) this.cursorY = 0;
        if (this.cursorY > this.ySize -1) this.cursorY = this.ySize -1;
    },
    charOut : function(s) {
        this.outputBuffer += s;
		this.isScreenChanged = true;
    },
    fillScreenBuffer : function() {
        //if (this.buffer.length < (this.xSize * this.ySize) + this.offset) {
		//	this.buffer += " ".repeat((this.xSize * this.ySize) + this.offset - this.buffer.length);
		//}
    },
    addTextToLine : function(lineNumber, offset, textToAdd) {
        var s = "";
        while (this.buffer.length < lineNumber) {
            this.buffer.push("");
        }
        s = this.buffer[lineNumber];
        if (s.length < offset) s += " ".repeat(offset - s.length);
        s += textToAdd;
        if (s.length > this.xSize) {
            this.addTextToLine(lineNumber + 1, 0, s.substr(this.xSize,s.length));
            s = s.substr(0,this.xSize);
        }
        this.buffer[lineNumber] = s;
    },
    updateConsoleText : function() {
        if (this.outputBuffer.length > 0) {
            this.addTextToLine(this.offset + this.cursorY, this.cursorX, this.outputBuffer);
            this.moveCursorRel(this.outputBuffer.length,0);
            this.outputBuffer = "";
        }
    }
};