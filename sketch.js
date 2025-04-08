let frameInterval = 60; 
let imageIndex = 0; 
let toggle = true; 
let currentCategory = 1; // 1 = donut, 2 = frosting, 3 = topping
let selectedIndices = [0, 0, 0]; // donut, frosting, topping
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
    [height / 6, height / 6, height / 6, height / 6], // Sizes for frostings
    [height / 6, height / 6, height / 6, height / 6], // Sizes for toppings
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
  if (keyCode === 32) {
    gameStarted = true;
    return;
  }

  if (!gameStarted) return;

  // Move UP through categories
  if (keyCode === DOWN_ARROW) {
    currentCategory = currentCategory - 1;
    if (currentCategory < 1) {
      currentCategory = 3; // Loop back to the last category if we go above the first
    }
  }

  // Move DOWN through categories
  else if (keyCode === UP_ARROW) {
    currentCategory = currentCategory + 1;
    if (currentCategory > 3) {
      currentCategory = 1; // Loop back to the first category if we go past the last
    }
  }

  // Move LEFT through options in the current category
  else if (keyCode === LEFT_ARROW) {
    let currentSelection = selectedIndices[currentCategory - 1];
    currentSelection = currentSelection - 1;

    if (currentSelection < 0) {
      currentSelection = images[currentCategory].length - 1; // Go to the last option if we go past the first
    }

    selectedIndices[currentCategory - 1] = currentSelection;
  }

  // Move RIGHT through options in the current category
  else if (keyCode === RIGHT_ARROW) {
    let currentSelection = selectedIndices[currentCategory - 1];
    currentSelection = currentSelection + 1;

    if (currentSelection >= images[currentCategory].length) {
      currentSelection = 0; // Go to the first option if we go past the last
    }

    selectedIndices[currentCategory - 1] = currentSelection;
  }

  console.log("Category:", currentCategory, "Selections:", selectedIndices);
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

function donut() {
  let index = selectedIndices[0];
  let scale = currentCategory === 1 ? 1.2 : 1; // Scale up if this category is selected
  let img = images[1][index];
  if (img) {
    image(img, 0, height / 4 + 40, img.width * scale, img.height * scale);
  }
}

function frosting() {
  let index = selectedIndices[1];
  let scale = currentCategory === 2 ? 1.2 : 1; // Scale up if this category is selected
  let img = images[2][index];
  if (img) {
    image(img, 0, 40, img.width * scale, img.height * scale);
  }
}

function topping() {
  let index = selectedIndices[2];
  let scale = currentCategory === 3 ? 1.2 : 1; // Scale up if this category is selected
  let img = images[3][index];
  if (img) {
    image(img, 0, -height / 4 + 40, img.width * scale, img.height * scale);
  }
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