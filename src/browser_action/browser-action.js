var random = 1;
var displaylink;

$( document ).ready(function() {
	$("#copied").show();
	setTimeout(function() { $("#copied").fadeOut(); }, 1000);
    document.getElementById("pixel").innerHTML = '<img src="https://design.ldschurch.org/csp/placeholder/200/200/christ">';
    document.getElementById("pixel").innerHTML += '<br /><input style="width:400px; border: none;" id="imgLink" value="https://design.ldschurch.org/csp/placeholder/200/200/christ">';
    copyLink();
});

function generatePixel() {
	//Initialize values and set up initial style to make errors clean
	random++;
	var height = 0;
	var width = 0;
	document.getElementById("height").style.border = 'none';
	document.getElementById("width").style.border = 'none';
	document.getElementById("options").style.border = 'none';
	document.getElementById("pixel").innerHTML = '';

	//Assign values from user input..................................
	height = document.getElementById("height").value;
	width = document.getElementById("width").value;
	var option = document.getElementById("options").value;

	//Everything is good.............................................
	if (height > 0 && width > 0 && option.length > 1) {
		$("#copied").show();
		setTimeout(function() { $("#copied").fadeOut(); }, 1000);
		displaylink = "https://design.ldschurch.org/csp/placeholder/" + width + "/" + height + "/" + option;
		var link = displaylink + '?' + random;
		document.getElementById("pixel").innerHTML = '<img src="' + link + '"> <br /> <input style="width:400px; border: none;" id="imgLink" value="' + displaylink + '">';
		copyLink();
	}

	//Check for invalid data.........................................
	if (isNaN(height)) {
		document.getElementById("pixel").innerHTML += '<p style="color: red"><i>Please enter a valid number for height</i></p>'
		document.getElementById("height").style.border = "3px solid red";
	}
	if (isNaN(width)) {
		document.getElementById("pixel").innerHTML += '<p style="color: red"><i>Please enter a valid number for width</i></p>'
		document.getElementById("width").style.border = "3px solid red";
	}
	if (option.length < 1) {
		document.getElementById("pixel").innerHTML += '<p style="color: red"><i>Please select a category</i></p>'
		document.getElementById("options").style.border = "3px solid red";
	}
	
}

function copyLink() {

	var highlight = document.getElementById('imgLink');
	var result = highlight.select();

	console.log(result);

	try {  
	// Now that we've selected the anchor text, execute the copy command  
	var successful = document.execCommand('copy');  
	var msg = successful ? 'successful' : 'unsuccessful';  
	console.log('Copy email command was ' + msg);  
	} 
	catch(err) {  
		console.log('Oops, unable to copy');  
	}  

	// Remove the selections - NOTE: Should use
	// removeRange(range) when it is supported  
	window.getSelection().removeAllRanges();  
}


