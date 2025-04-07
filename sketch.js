let frameInterval = 80; 
let imageIndex = 0; 
let toggle = true; 
let assetPath = "UJCMDonut/gameAssets/";
let gameAssets = [
  ["Title1.png", "Title2.png", "background.png"],
  ["Bismark.png", "CiderMill.png", "LongJohn.png", "TractorTire.png", "Yeast.png", "SourCream.png"],
  ["pinkFrosting.png", "chocFrosting.png", "whiteFrosting.png", "glaze.png"],
  ["ranbowSprinkles.png", "chocSprinkles.png", "chocDrizzle.png", "candies.png"],
  ["ciderGlass.png", "tractor.png"]
];

let images = [];
let imageSizes = [
  [null, null, null], // Sizes for Title1, Title2, background
  [null, null, null, null, null, null], // Sizes for donuts
  [null, null, null, null], // Sizes for frostings
  [null, null, null, null], // Sizes for toppings
  [null, null] // Sizes for ciderGlass, tractor
];

function preload() {
  for (let i = 0; i < gameAssets.length; i++) {
    images[i] = [];
    for (let j = 0; j < gameAssets[i].length; j++) {
      let path = assetPath + gameAssets[i][j];
      images[i][j] = loadImage(
        path,
        () => console.log(`Loaded: ${path}`),
        () => console.error(`Failed to load: ${path}`)
      );
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  translate(width / 2, height / 2);
  imageMode(CENTER); // Set image mode to center for proper positioning

  // Define image sizes based on canvas dimensions
  imageSizes = [
    [height, height, height], // Sizes for Title1, Title2, background
    [height / 4, height / 4, height / 4, height / 4, height / 4, height / 4], // Sizes for donuts
    [height / 4, height / 4, height / 4, height / 4], // Sizes for frostings
    [height / 4, height / 4, height / 4, height / 4], // Sizes for toppings
    [height / 6, height / 6] // Sizes for ciderGlass, tractor
  ];

  // Resize images after they are loaded
  for (let i = 0; i < images.length; i++) {
    for (let j = 0; j < images[i].length; j++) {
      let img = images[i][j];
      if (img) {
        let newHeight = imageSizes[i][j];
        let newWidth = (img.width / img.height) * newHeight; // Maintain aspect ratio
        img.resize(newWidth, newHeight);
        console.log(`Resized: ${gameAssets[i][j]} to ${newWidth}x${newHeight}`);
      }
    }
  }

  background("white");
}

let gameStarted = false; //has the game started?

function keyPressed() {
  if (keyCode === 32) { // 32 is the keyCode for the space bar
    gameStarted = true; // Set the gameStarted flag to true
    console.log("Space bar pressed, game started");
  }
}

function startPage() {
  if (gameStarted) {
    console.log("Game started");
    image(images[0][2], 0, 0); // Draw the background image
    donut();
    frosting();
    topping();
  } else {
    // Toggle between title frames
    if (toggle) {
      imageIndex = 0;
    } else {
      imageIndex = 1;
    }

    image(images[0][imageIndex], 0, 0); // Draw the title images

    // Flip the image per the global frameInterval
    if (frameCount % frameInterval === 0) {
      toggle = !toggle;
      console.log("Toggle state:", toggle);
    }
  }
}

function donut(){
  image(images[1][0], 0, height/4);
}
function frosting(){
  image(images[2][0], 0, 0);
}
function topping(){
  image(images[3][0], 0, -height/4);
}

function draw() {
  background("white"); // Clear the canvas
  translate(width / 2, height / 2); // Center the canvas

  // Ensure all images are loaded before drawing
  let allImagesLoaded = images.every(row => row.every(img => img && img.width > 0 && img.height > 0));

  if (allImagesLoaded) {
    startPage();
  } else {
    console.log("Images are not fully loaded yet.");
  }
}
