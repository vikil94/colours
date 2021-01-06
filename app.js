// Global selections and variables
const colourDivs = document.querySelectorAll(".colour");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".colour h2");
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelectorAll(".lock");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColours;

// Event Listeners
generateBtn.addEventListener("click", randomColours);

sliders.forEach((slider) => {
	slider.addEventListener("input", hslControls);
});

colourDivs.forEach((div, index) => {
	div.addEventListener("change", () => {
		updateTextUI(index);
	});
});

currentHexes.forEach((hex) => {
	hex.addEventListener("click", () => {
		copyToClipboard(hex);
	});
});

popup.addEventListener("transitionend", () => {
	const popupBox = popup.children[0];
	popup.classList.remove("active");
	popupBox.classList.remove("active");
});

adjustBtn.forEach((button, index) => {
	button.addEventListener("click", () => {
		openAdjustmentPanel(index);
	});
});

closeAdjustments.forEach((button, index) => {
	button.addEventListener("click", () => {
		closeAdjustmentPanel(index);
	});
});

lockBtn.forEach((button, index) => {
	button.addEventListener("click", (e) => {
		lockLayer(e, index);
	});
});

//Functions

// Colour Generator
function generateHex() {
	const hexColour = chroma.random();
	return hexColour;
}

function randomColours() {
	initialColours = [];
	colourDivs.forEach((div, index) => {
		const hexText = div.children[0];
		const randomColour = generateHex();
		// Add to initialColours

		if (div.classList.contains("locked")) {
			initialColours.push(hexText.innerText);
			return;
		} else {
			initialColours.push(chroma(randomColour).hex());
		}

		// Add the colour to the background
		div.style.backgroundColor = randomColour;
		hexText.innerText = randomColour;

		// Check for contrast
		checkTextContrast(randomColour, hexText);
		// Initial Colourize Sliders
		const colour = chroma(randomColour);
		const sliders = div.querySelectorAll(".sliders input");
		const hue = sliders[0];
		const brightness = sliders[1];
		const saturation = sliders[2];

		colourizeSliders(colour, hue, brightness, saturation);
	});
	// Reset Inputs
	resetInputs();
	//Check For Button Contrasts
	adjustBtn.forEach((button, index) => {
		checkTextContrast(initialColours[index], button);
		checkTextContrast(initialColours[index], lockBtn[index]);
	});
}

function checkTextContrast(colour, text) {
	const luminance = chroma(colour).luminance();
	if (luminance > 0.5) {
		text.style.color = "black";
	} else {
		text.style.color = "white";
	}
}

function colourizeSliders(colour, hue, brightness, saturation) {
	// Scale Saturation
	const noSat = colour.set("hsl.s", 0);
	const fullSat = colour.set("hsl.s", 1);
	const scaleSat = chroma.scale([noSat, colour, fullSat]);

	// Scale Brightness
	const midBright = colour.set("hsl.l", 0.5);
	const scaleBright = chroma.scale(["black", midBright, "white"]);

	// Scale Hue

	// update Input Colours
	saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
		0
	)}, ${scaleSat(1)})`;
	brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
		0
	)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
	hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
}

function hslControls(e) {
	const index =
		e.target.getAttribute("data-bright") ||
		e.target.getAttribute("data-sat") ||
		e.target.getAttribute("data-hue");

	let sliders = e.target.parentElement.querySelectorAll(
		'input[type="range"]'
	);
	const hue = sliders[0];
	const brightness = sliders[1];
	const saturation = sliders[2];

	const bgColour = initialColours[index];

	let colour = chroma(bgColour)
		.set("hsl.s", saturation.value)
		.set("hsl.l", brightness.value)
		.set("hsl.h", hue.value);

	colourDivs[index].style.backgroundColor = colour;

	//Colourize inputs/sliders

	colourizeSliders(colour, hue, brightness, saturation);
}

function updateTextUI(index) {
	const activeDiv = colourDivs[index];
	const colour = chroma(activeDiv.style.backgroundColor);
	const textHex = activeDiv.querySelector("h2");
	const icons = activeDiv.querySelectorAll(".controls button");
	textHex.innerText = colour.hex();

	//Check Contrast
	checkTextContrast(colour, textHex);
	for (icon of icons) {
		checkTextContrast(colour, icon);
	}
}

function resetInputs() {
	const sliders = document.querySelectorAll(".sliders input");
	sliders.forEach((slider) => {
		if (slider.name === "hue") {
			const hueColour = initialColours[slider.getAttribute("data-hue")];
			const hueValue = chroma(hueColour).hsl()[0];
			slider.value = Math.floor(hueValue);
		}
		if (slider.name === "brightness") {
			const brightColour =
				initialColours[slider.getAttribute("data-bright")];
			const brightValue = chroma(brightColour).hsl()[2];
			slider.value = Math.floor(brightValue * 100) / 100;
		}
		if (slider.name === "saturation") {
			const satColour = initialColours[slider.getAttribute("data-sat")];
			const satValue = chroma(satColour).hsl()[1];
			slider.value = Math.floor(satValue * 100) / 100;
		}
	});
}

function copyToClipboard(hex) {
	const el = document.createElement("textarea");
	el.value = hex.innerText;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
	// Pop up animation
	const popupBox = popup.children[0];
	popup.classList.add("active");
	popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
	sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
	sliderContainers[index].classList.remove("active");
}

function lockLayer(e, index) {
	const lockSVG = e.target.children[0];
	const activeBg = colourDivs[index];
	activeBg.classList.toggle("locked");

	if (lockSVG.classList.contains("fa-lock-open")) {
		e.target.innerHTML = '<i class="fas fa-lock"></i>';
	} else {
		e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
	}
}

randomColours();
