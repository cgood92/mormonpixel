(function(){
	var random = 1;
	var pixelElem;

	$( document ).ready(function() {
		pixelElem = document.getElementById("pixel");
		document.getElementById('generate').addEventListener('click', function(){
			generatePixel();
		});
		loadImage(200, 200, "christ", random);
	});

	function copyMessageDisplay(){
		$("#copied").show();
		setTimeout(function() { $("#copied").fadeOut(); }, 1000);
	}

	function loadImage(width, height, option, random){
		var displaylink = "https://design.ldschurch.org/csp/placeholder/" + width + "/" + height + "/" + option;
		var link = displaylink + '?' + random;
		pixelElem.innerHTML = '<img src="' + link + '"> <br /> <input style="width:400px; border: none;" id="imgLink" value="' + displaylink + '">';
		copyLink();
		copyMessageDisplay();
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
		if (height > 0 && width > 0 && option.length > 1) {
			loadImage(width, height, option, random++);
		}

		//Check for invalid data.........................................
		if (isNaN(height)) {
			pixelElem.innerHTML += '<p style="color: red"><i>Please enter a valid number for height</i></p>'
			heightElem.style.border = "3px solid red";
		}
		if (isNaN(width)) {
			pixelElem.innerHTML += '<p style="color: red"><i>Please enter a valid number for width</i></p>'
			widthElem.style.border = "3px solid red";
		}
		if (option.length < 1) {
			pixelElem.innerHTML += '<p style="color: red"><i>Please select a category</i></p>'
			optionsElem.style.border = "3px solid red";
		}
		
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
