(function(){
	var random = 1, pixelElem;

	// On document load - load a default image, and add event listeners
	document.addEventListener("DOMContentLoaded", function() {
		// Load global element
		pixelElem = document.getElementById("pixel");

		// Load a default image
		loadImage(200, 200, "apostles", random);

		// Add event listener to the "generate" button
		document.getElementById('generate').addEventListener('click', function(){
			generatePixel();
			this.blur();
		});
		document.getElementById('inputControls').addEventListener('submit', function(e){
			e.preventDefault(); 
			return false;
		});

	});

	// Vanilla JS version of jQuery's 'fadeout'
	function fadeOut(s, speed) {
	    (function fade(){(s.opacity-=.1)<.1?s.display="none":setTimeout(fade,speed)})();
	}

	// Displays a "Link copied to clipboard" message
	function copyMessageDisplay(){
		var copiedElem = document.getElementById("copied");
		copiedElem.style.display = "inline-block";

		copiedElem.style.opacity = 1;
		var timeout = setTimeout(function() { 
			fadeOut(copiedElem.style, 100);
		}, 800);
	}

	// Replace the image div container with a new img
	function loadImage(width, height, option, random){
        var displaylink = "https://design.ldschurch.org/csp/placeholder/" + width + "/" + height + "/" + option;
        var link = displaylink + '?' + random;
        copyMessageDisplay();
        pixelElem.innerHTML = '<img src="' + link + '" width="' + width + '" height="' + height + '" class="generatedImage"><input id="imgLink" value="' + displaylink + '" readonly>';
        copyLink();
    }

	// Gather the information for the desired picture, and fetch it
	function generatePixel() {
		var submit = true;

		//Initialize values and set up initial style to make errors clean
		var heightElem = document.getElementById("height"),
			widthElem = document.getElementById("width"),
			optionsElem = document.getElementById("options");

		// Remove the border
		heightElem.classList.add('borderless');
		widthElem.classList.add('borderless');
		optionsElem.classList.add('borderless');

		//Assign values from user input..................................
		var height = heightElem.value;
		var width = widthElem.value;
		var option = optionsElem.value;

		//Check for invalid data.........................................
		document.getElementById("validationErrors").innerHTML = '';
		if (isNaN(height)) {
			showValidationError(heightElem, "Please enter a valid number for height");
			submit = false;
		}
		if (isNaN(width)) {
			showValidationError(widthElem, "Please enter a valid number for width");
			submit = false;
		}
		if (option.length < 1) {
			showValidationError(optionsElem, "Please select a category");
			submit = false;
		}

		//Everything is good.............................................
		if (submit) {
			loadImage(width || 200, height || 200, option, random++);
		}
	}

	// If the user inserts bad information, inform them
	function showValidationError(elem, msg) {
		document.getElementById("validationErrors").innerHTML += '<p>' + msg + '</p>'
		elem.classList.add('validationError');
	}

	// Copy link to the clipboard
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
