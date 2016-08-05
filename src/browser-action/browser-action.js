(function(){
	var pixelElem, heightElem, widthElem, optionsElem, 
		winSelection = window.getSelection(),
		random = 1;

	//Initialize global elements
	function loadGlobalElements(){
		pixelElem = document.getElementById('pixel');
		heightElem = document.getElementById('height');
		widthElem = document.getElementById('width');
		optionsElem = document.getElementById('options');
	}

	// Randomly select a random category 
	function selectRandomCategory() {
		var random = Math.floor(optionsElem.options.length * (Math.random() % 1));
		optionsElem.options[random].selected = 'selected';
	}

	// Vanilla JS version of jQuery's 'fadeout'
	function fadeOut(s, speed) {
	    (function fade(){
	    	if((s.opacity -= 0.1) < 0.1) {
	    		s.display = 'none';
	    	} else {
	    		setTimeout(fade,speed);
	    	}
	    })();
	}

	// Displays a 'Link copied to clipboard' message
	function copyMessageDisplay(){
		var copiedElem = document.getElementById('copied');
		copiedElem.style.display = 'inline-block';

		copiedElem.style.opacity = 1;
		var timeout = setTimeout(function() { 
			fadeOut(copiedElem.style, 100);
		}, 800);
	}

	// Copy link to the clipboard
	function copyLink() {
		try {  
			// Now that we've selected the anchor text, execute the copy command  
			document.execCommand('copy');  
		} 
		catch(err) {  
		}  
	}

	// Unselect link
	function unselectLink() {
		// Remove the selections
		winSelection.removeAllRanges();  
	}

	// Select link
	function selectLink() {
		unselectLink();
		var highlight = document.getElementById('imgLink'),
			range = document.createRange();

		// Get a selection range
		range.selectNode(highlight);
		winSelection.addRange(range);
	}

	// Add selecting link event listener
	function listenForLinkClick() {
		document.getElementById('imgLink').addEventListener('click', function(e){
			selectLink();
		});
	}

	// Replace the image div container with a new img
	function loadImage(width, height, option, random){
        var displaylink = 'https://design.ldschurch.org/csp/placeholder/' + width + '/' + height + '/' + option;
        var link = displaylink + '?' + random;
        copyMessageDisplay();
        pixelElem.innerHTML = '<img src="' + link + '" width="' + width + '" height="' + height + '" class="generatedImage"><input id="imgLink" value="' + displaylink + '" readonly>';
        selectLink();
        copyLink();
        unselectLink();
        listenForLinkClick();
    }

    // If the user inserts bad information, inform them
	function showValidationError(elem, msg) {
		document.getElementById('validationErrors').innerHTML += '<p>' + msg + '</p>';
		elem.classList.add('validationError');
	}

	// Gather the information for the desired picture, and fetch it
	function generatePixel() {
		var submit = true;

		// Remove the border
		heightElem.classList.remove('validationError');
		widthElem.classList.remove('validationError');
		optionsElem.classList.remove('validationError');

		//Assign values from user input..................................
		var height = heightElem.value,
			width = widthElem.value,
			option = optionsElem.value;

		//Check for invalid data.........................................
		document.getElementById('validationErrors').innerHTML = '';
		if (isNaN(height)) {
			showValidationError(heightElem, 'Please enter a valid number for height');
			submit = false;
		}
		if (isNaN(width)) {
			showValidationError(widthElem, 'Please enter a valid number for width');
			submit = false;
		}
		if (option.length < 1) {
			showValidationError(optionsElem, 'Please select a category');
			submit = false;
		}

		//Everything is good.............................................
		if (submit) {
			loadImage(width || 300, height || 300, option, ++random);
		}
	}

	// On document load - load a default image, and add event listeners
	document.addEventListener('DOMContentLoaded', function() {
		// Load global elements
		loadGlobalElements();

		// Select a random category
		selectRandomCategory();

		// Load a default image
		generatePixel();

		// Add event listener to the 'generate' button
		document.getElementById('generate').addEventListener('click', function(){
			generatePixel();
			this.blur();
		});
		document.getElementById('inputControls').addEventListener('submit', function(e){
			e.preventDefault(); 
			return false;
		});
	});
})();
