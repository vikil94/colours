// Global selections and variables
const colourDivs = document.querySelectorAll(".colour");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".colour h2");
let initialColours;
//Functions

// Colour Generator
function generateHex() {
	const hexColour = chroma.random();
	return hexColour;
}

function randomColours() {
	colourDivs.forEach((div, index) => {
		const hexText = div.children[0];
		const randomColour = generateHex();

		// Add the colour to the background
		div.style.backgroundColor = randomColour;
		hexText.innerText = randomColour;
		// Check for cocntrast
		checkTextContrast(randomColour, hexText);
		// Initial Colourize Sliders
		const colour = chroma(randomColour);
		const sliders = div.querySelectorAll(".sliders input");
		const hue = sliders[0];
		const brightness = sliders[1];
		const saturation = sliders[2];

		colourizeSliders(colour, hue, brightness, saturation);
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

randomColours();
