

/*
  Setting up the editor
*/
function makeEditor(ename) {
    
    let initializeEditor = function() {
	var editor = ace.edit(ename);
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/javascript");
	return editor;
    }
    
    let editor = initializeEditor();

    /* 
       Setting up execution
    */
    if (!String.prototype.trim) {
	String.prototype.trim = function () {
	    return this.replace(/^\s+|\s+$/g, '');
	};
    }

    let getVal = function(id) {
	let e = document.getElementById(id);
	let s = e.value;
	if (s != "1" && s != "0")
	    throw "Error! Input must be either 1 or 0.";
	return Number(s);
    }
    
    let setVal = function(id,val) {
	let e = document.getElementById(id);
	e.value = String(val);
	e.style.background = (val == "" || val == null || val == undefined) ? "white" : "yellow"; 
    }

    let clrVal = function(id) {
	let e = document.getElementById(id);
	e.value = String();
	e.style.background="white";
    }
    
    let setMsg = function(id,val) {
	let e = document.getElementById(id);
	e.innerHTML = String(val);
    }
    
    var execit = function(ida,idb,idres,idmsg) {
	setMsg(idmsg,"");
	setVal(idres,"");
	try {
	    let res = runit(getVal(ida),
			    (idb != undefined && idb != null)? getVal(idb) : null);
	    if (res == "") {
		setMsg(idmsg,"Warning!  No output given.");
	    }
	    else {
		setVal(idres,res);
		// set things up so value disappears ... at the right time
		setTimeout(function(){clrVal(idres);},2000);
	    }
	}
	catch(e) {
	    setMsg(idmsg,e);
	}
    }
    
    var runit = function(valA,valB) {
	let errException = null;
	let header =
	    'var inputAValue = ' + valA + ';\n' + 
	    'var inputBValue = ' + valB + ';\n' + 
	    'var overallRes = "";\n' + 
	    'var getA = function() { return inputAValue; };\n' + 
	    'var getB = function() { return inputBValue; };\n' +
	    'var output = function(x) { overallRes = overallRes + x; };\n';
	let tail = '\n' + 'overallRes;';
	progText = editor.getValue();
	var myInterpreter = new Interpreter('');
	try {
	    myInterpreter.appendCode(header + progText + tail);
	    myInterpreter.run();
	}catch(e) {
	    errException = e;
	}
	if (errException == null) {
	    res = myInterpreter.value.trim();
	    return res;	
	}
	else {
	    if (errException.loc != undefined) {
		let line = errException.loc.line - 6;
		throw "Error line " + line + ": " + errException.message;
	    }
	    else {
		throw "Error! " + errException.message;
	    }	    
	}
    }

    return { 'execit': execit };
}
