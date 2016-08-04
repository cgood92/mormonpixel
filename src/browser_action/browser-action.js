(function(){
	var random = 1;
	var pixelElem;

	function fadeOut(s, speed) {
	    (function fade(){(s.opacity-=.1)<.1?s.display="none":setTimeout(fade,speed)})();
	}

	document.addEventListener("DOMContentLoaded", function() {
		// Load global element
		pixelElem = document.getElementById("pixel");

		// Load a default image
		loadImage(200, 200, "christ", random);

		// Add event listener to the "generate" button
		document.getElementById('generate').addEventListener('click', function(){
			generatePixel();
			this.blur();
		});

	});

	// Displays a "Link copied to clipboard" message
	function copyMessageDisplay(){
		var copiedElem = document.getElementById("copied");
		copiedElem.style.display = "inline-block";

		copiedElem.style.opacity = 1;
		var timeout = setTimeout(function() { 
			fadeOut(copiedElem.style, 100);
		}, 500);
	}

	function loadImage(width, height, option, random){
		var displaylink = "https://design.ldschurch.org/csp/placeholder/" + width + "/" + height + "/" + option;
		var link = displaylink + '?' + random;
		copyMessageDisplay();
		pixelElem.innerHTML = '<center><img src="' + link + '" width="' + width + '" height="' + height + '"></center> <br /> <input style="border: none; width: 400px; background: transparent;" id="imgLink" value="' + displaylink + '" readonly>';
		copyLink();
	}

	function generatePixel() {
		//Initialize values and set up initial style to make errors clean
		var heightElem = document.getElementById("height");
		var widthElem = document.getElementById("width");
		var optionsElem = document.getElementById("options");
		heightElem.style.border = 'none';
		widthElem.style.border = 'none';
		optionsElem.style.border = 'none';
		pixelElem.innerHTML = '';

		//Assign values from user input..................................
		var height = heightElem.value;
		var width = widthElem.value;
		var option = optionsElem.value;

		//Everything is good.............................................
		if (option.length > 1) {
			loadImage(width || 200, height || 200, option, random++);
		}

		//Check for invalid data.........................................
		if (isNaN(height)) {
			showValidationError(heightElem, "Please enter a valid number for height");
		}
		if (isNaN(width)) {
			showValidationError(widthElem, "Please enter a valid number for width");
		}
		if (option.length < 1) {
			showValidationError(optionsElem, "Please select a category");
		}
	}

	function showValidationError(elem, msg) {
		pixelElem.innerHTML += '<p style="color: red"><i>' + msg + '</i></p>'
		elem.style.border = "3px solid red";
	}

	function copyLink() {
		var highlight = document.getElementById('imgLink'),
			range = document.createRange();

		// Get a selection range
		range.selectNode(highlight);
		window.getSelection().addRange(range);

		try {  
			// Now that we've selected the anchor text, execute the copy command  
			document.execCommand('copy');  
		} 
		catch(err) {  
		}  

		// Remove the selections - NOTE: Should use removeRange(range) when it is supported  
		window.getSelection().removeAllRanges();  
	}
})();
