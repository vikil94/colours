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
	});
}

randomColours();
