//GLOBAL VARIABLES

//----Used for arcade buttons----
const GAMEPAD_BUTTONS = {
  BTN_TRIGGER: 0,
  BTN_THUMB: 1,
  BTN_THUMB2: 2,
  BTN_TOP: 3,
  BTN_TOP2: 4
};
//----Used for start page animation----
let frameInterval = 60; 
let imageIndex = 0; 
//----Used for connection to arcade buttons----
let toggle = true; 
let controllers = [];
let released = [];
let pressed = [];
let justPressed = []; //if the retro buttons were just pressed
//----Used for navigation in the mix-n-match page----
let currentCategory = 1; // 1 = donut, 2 = frosting, 3 = topping
let selectedIndices = [0, 0, 0]; // donut, frosting, topping

//----Image loading----
let assetPath = "UJCMDonut/gameAssets/";
let gameAssets = [
  ["Title1.png", "Title2.png", "background.png", "background2.png", "button.png"],
  ["Bismark.png", "CiderMill.png", "LongJohn.png", "TractorTire.png", "Yeast.png", "SourCream.png"],
  ["pinkFrosting.png", "chocFrosting.png", "whiteFrosting.png"],
  ["ranbowSprinkles.png", "chocSprinkles.png", "pinkDrizzle.png", "chocDrizzle.png", "whiteDrizzle.png"],
  [
    ["bismark/choc.png", "bismark/white.png", "bismark/pink.png", "bismark/rainbowS.png", "bismark/chocS.png", "bismark/pinkD.png", "bismark/chocD.png", "bismark/whiteD.png"], 
    ["ciderMill/choc.png", "ciderMill/white.png", "ciderMill/pink.png", "ciderMill/rainbowS.png", "ciderMill/chocS.png", "ciderMill/pinkD.png", "ciderMill/chocD.png", "ciderMill/whiteD.png"],
    ["longJohn/choc.png", "longJohn/white.png", "longJohn/pink.png", "longJohn/rainbowS.png", "longJohn/chocS.png", "longJohn/pinkD.png", "longJohn/chocD.png", "longJohn/whiteD.png"],
    ["tractorTire/choc.png", "tractorTire/white.png", "tractorTire/pink.png", "tractorTire/rainbowS.png", "tractorTire/chocS.png", "tractorTire/pinkD.png", "tractorTire/chocD.png", "tractorTire/whiteD.png"],
    ["yeast/choc.png", "yeast/white.png", "yeast/pink.png", "yeast/rainbowS.png", "yeast/chocS.png", "yeast/pinkD.png", "yeast/chocD.png", "yeast/whiteD.png"],
    ["sourCream/choc.png", "sourCream/white.png", "sourCream/pink.png", "sourCream/rainbowS.png", "sourCream/chocS.png", "sourCream/pinkD.png", "sourCream/chocD.png", "sourCream/whiteD.png"]
  ]
];
let images = [];
let imageSizes = [];

//----Game page----
let gameState = 0; // 0 = start page, 1 = mix-and-match page, 2 = final page

//----Final donut for the final page----
let mydonut, myfrosting, mytopping; 

//----Loads images and assigns to the images array----
function preload() {
  for (let i = 0; i < gameAssets.length; i++) {
    images[i] = [];
    for (let j = 0; j < gameAssets[i].length; j++) {
      if (gameAssets[i][j]) { // Ensure the element exists
        if (Array.isArray(gameAssets[i][j])) {
          // Handle nested arrays
          images[i][j] = [];
          for (let k = 0; k < gameAssets[i][j].length; k++) {
            let path = assetPath + gameAssets[i][j][k];
            images[i][j][k] = loadImage(
              path,
              () => console.log(`Loaded: ${path}`),
              () => console.error(`Failed to load: ${path}`)
            );
          }
        } else {
          let path = assetPath + gameAssets[i][j];
          images[i][j] = loadImage(
            path,
            () => console.log(`Loaded: ${path}`),
            () => console.error(`Failed to load: ${path}`)
          );
        }
      } else {
        console.error(`Undefined asset at gameAssets[${i}][${j}]`);
      }
    }
  }
}

//----Resizes images based on the canvas size----
function resizeImage(img, newHeight) {
  if (img) {
    let newWidth = (img.width / img.height) * newHeight; // Maintain aspect ratio
    img.resize(newWidth, newHeight);
    console.log(`Resized image to ${newWidth}x${newHeight}`);
  }
}

//----Sets up the canvas, connects to arcade buttons, resizes images----
function setup() {
  createCanvas(windowWidth, windowHeight);
  translate(width / 2, height / 2);
  imageMode(CENTER);

  window.addEventListener("gamepadconnected", function(e) {
    gamepadHandler(e, true);
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);
  });
  window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected from index %d: %s",
      e.gamepad.index, e.gamepad.id);
    gamepadHandler(e, false);
  });

  for (var i = 0; i < 17; i++) {
    released[i] = true;
    pressed[i] = false;
    justPressed[i] = false;
  }

  // Define image sizes dynamically based on canvas dimensions
  imageSizes = [
    [height, height, height, height, height/12], // Sizes for Title1, Title2, background
    Array(6).fill(height / 4), // Sizes for donuts
    Array(4).fill(height / 4), // Sizes for frostings
    Array(5).fill(height / 4), // Sizes for toppings
    Array(6).fill(Array(8).fill(height / 4)) // Sizes for nested topping variations
  ];

  // Resize images after they are loaded
  for (let i = 0; i < images.length; i++) {
    for (let j = 0; j < images[i].length; j++) {
      if (Array.isArray(images[i][j])) {
        for (let k = 0; k < images[i][j].length; k++) {
          resizeImage(images[i][j][k], imageSizes[i][j][k]);
        }
      } else {
        resizeImage(images[i][j], imageSizes[i][j]);
      }
    }
  }

  background("white");
}

//----Uses keyboard for moving pages (used for testing)----
function keyPressed() {
  if (key === ' ') {
    gameState = (gameState + 1) % 3; // Cycle through states: 0 -> 1 -> 2 -> 0
    console.log("Game state changed to:", gameState);
  }
}

//----Connects and disconnects the gamepad----
function gamepadHandler(event, connecting) {
  let gamepad = event.gamepad;
  if (connecting) {
    print("Connecting to controller " + gamepad.index);
    controllers[gamepad.index] = gamepad;
  } else {
    delete controllers[gamepad.index];
  }
}

//----Buttons only work upon press&release, not continuously----
function updateGamepadState() {
  let gamepads = navigator.getGamepads();
  if (gamepads[0]) { // Check if a gamepad is connected
    let gamepad = gamepads[0];
    for (let i = 0; i < gamepad.buttons.length; i++) {
      let isPressed = gamepad.buttons[i].pressed;

      if (isPressed && released[i]) {
        // Button was just pressed
        pressed[i] = true;
        justPressed[i] = true; // Mark as "just pressed"
        released[i] = false;
      } else if (!isPressed) {
        // Button is released
        released[i] = true;
        pressed[i] = false;
        justPressed[i] = false; // Reset "just pressed" state
      }
    }
  }
}

//----Navigates through game pages and mix-n-match states----
function handleGamepadInput() {
  if (justPressed[GAMEPAD_BUTTONS.BTN_TOP2]) {
    gameState = (gameState + 1) % 3; // Cycle through states: 0 -> 1 -> 2 -> 0
    return;
  }

  if (gameState === 1) {
    // Mix-and-match page logic
    // Move UP through categories
    if (justPressed[GAMEPAD_BUTTONS.BTN_THUMB2]) {
      currentCategory = currentCategory - 1;
      if (currentCategory < 1) {
        currentCategory = 3; // Loop back to the last category if we go above the first
      }
    }

    // Move DOWN through categories
    if (justPressed[GAMEPAD_BUTTONS.BTN_TRIGGER]) {
      currentCategory = currentCategory + 1;
      if (currentCategory > 3) {
        currentCategory = 1; // Loop back to the first category if we go past the last
      }
    }

    // Move LEFT through options in the current category
    if (justPressed[GAMEPAD_BUTTONS.BTN_TOP]) {
      let currentSelection = selectedIndices[currentCategory - 1];
      currentSelection = currentSelection - 1;

      if (currentSelection < 0) {
        currentSelection = images[currentCategory].length - 1; // Go to the last option if we go past the first
      }

      selectedIndices[currentCategory - 1] = currentSelection;
    }

    // Move RIGHT through options in the current category
    if (justPressed[GAMEPAD_BUTTONS.BTN_THUMB]) {
      let currentSelection = selectedIndices[currentCategory - 1];
      currentSelection = currentSelection + 1;

      if (currentSelection >= images[currentCategory].length) {
        currentSelection = 0; // Go to the first option if we go past the last
      }

      selectedIndices[currentCategory - 1] = currentSelection;
    }
  }

  // Reset the justPressed array after handling input
  for (let i = 0; i < justPressed.length; i++) {
    justPressed[i] = false;
  }

  selectedIndices = [
    Math.max(0, Math.min(selectedIndices[0], images[1].length - 1)),
    Math.max(0, Math.min(selectedIndices[1], images[2].length - 1)),
    Math.max(0, Math.min(selectedIndices[2], images[3].length - 1))
  ];
}

//----Draws the donut base----
function donut() {
  let index = selectedIndices[0];
  let img = null;
  let scale = currentCategory === 1 ? 1.2 : 1;
  img = images[1][index];
  if (img) {
    image(img, 0, height / 4 + 40, img.width * scale, img.height * scale);
    return gameAssets[1][index];
  } else {
    return null;
  }
  
}

//----Draws the frosting type----
function frosting() {
  let index = selectedIndices[1];
  let img = null; // Initialize img to null
  if (images[2] && images[2][index]) {
    let scale = currentCategory === 2 ? 1.2 : 1;
    img = images[2][index];
    image(img, 0, 40, img.width * scale, img.height * scale);
    return gameAssets[2][index];
  } else {
    console.error("Frosting image not found at index:", index);
    return null;
  }
}

//----Draws the topping type----
function topping() {
  let index = selectedIndices[2];
  let img = null;
  if (images[3] && images[3][index]) {
    let scale = currentCategory === 3 ? 1.2 : 1;
    img = images[3][index];
    image(img, 0, -height / 4 + 80, img.width * scale, img.height * scale);
    return gameAssets[3][index]; // Return the string name of the topping
  } else {
    console.error("Topping image not found at index:", index);
    return null; // Return null if the topping is not found
  }
}

//----Draws the different game pages based on the gameState----
function startPage() {
  if (gameState === 0) {
    // Start page
    if (toggle) {
      imageIndex = 0;
    } else {
      imageIndex = 1;
    }

    image(images[0][imageIndex], 0, 0); // Draw the title images

    if (frameCount % frameInterval === 0) {
      toggle = !toggle;
      console.log("Toggle state:", toggle);
    }
  } else if (gameState === 1) {
    // Mix-and-match page
    image(images[0][2], 0, 0); // Draw the background image
    mydonut = donut();
    myfrosting = frosting();
    mytopping = topping();
  } else if (gameState === 2) {
    // Final page
    image(images[0][3], 0, 0); // Draw the final background image
    finalDonutMaker(mydonut, myfrosting, mytopping)
  }
}

//----Draws the final donut based on the selected options----
function finalDonutMaker(donut, frosting, topping) {
  let donutIndex = -1; // Declare donutIndex
  let frostingIndex = -1; // Declare frostingIndex
  let toppingIndex = -1; // Declare toppingIndex

  // Determine donutIndex
  if (donut === "Bismark.png") {
    donutIndex = 0;
  } else if (donut == "CiderMill.png") {
    donutIndex = 1;
  } else if (donut == "LongJohn.png") {
    donutIndex = 2;
  } else if (donut == "TractorTire.png") {
    donutIndex = 3;
  } else if (donut == "Yeast.png") {
    donutIndex = 4;
  } else if (donut == "SourCream.png") {
    donutIndex = 5;
  }

  // Render donut image if valid
  if (donutIndex !== -1) {
    let donutImg = images[1][donutIndex];
    if (donutImg) {
      image(donutImg, 0, 40, donutImg.width*1.5, donutImg.height*1.5);
    } else {
      console.error("Donut image not found for index:", donutIndex);
    }
  } else {
    console.error("Invalid donut type:", donut);
  }

  // Determine frostingIndex
  if (frosting == "chocFrosting.png") {
    frostingIndex = 0;
  } else if (frosting == "whiteFrosting.png") {
    frostingIndex = 1;
  } else if (frosting == "pinkFrosting.png") {
    frostingIndex = 2;
  }

  // Render frosting image if valid
  if (donutIndex !== -1 && frostingIndex !== -1) {
    let frostingImg = images[4][donutIndex][frostingIndex];
    if (frostingImg) {
      image(frostingImg, 0, 0, frostingImg.width*1.5, frostingImg.height*1.5);
    } else {
      console.error("Frosting image not found for indices:", donutIndex, frostingIndex);
    }
  } else {
    console.error("Invalid frosting type or donut index:", frosting, donutIndex);
  }

  // Determine toppingIndex
  if (topping == "ranbowSprinkles.png") {
    toppingIndex = 3;
  } else if (topping == "chocSprinkles.png") {
    toppingIndex = 4;
  } else if (topping == "pinkDrizzle.png") {
    toppingIndex = 5;
  } else if (topping == "chocDrizzle.png") {
    toppingIndex = 6;
  } else if (topping == "whiteDrizzle.png") {
    toppingIndex = 7;
  }

  // Render topping image if valid
  if (donutIndex !== -1 && toppingIndex !== -1) {
    let toppingImg = images[4][donutIndex][toppingIndex];
    if (toppingImg) {
      image(toppingImg, 0, -20, toppingImg.width*1.5, toppingImg.height*1.5);
    } else {
      console.error("Topping image not found for indices:", donutIndex, toppingIndex);
    }
  } else {
    console.error("Invalid topping type or donut index:", topping, donutIndex);
  }
}

//----Draws the canvas, starts only when images are all loaded----
function draw() {
  background("white");
  translate(width / 2, height / 2);

  updateGamepadState();
  handleGamepadInput();

  let allImagesLoaded = images.every(row => 
    row.every(img => 
      Array.isArray(img) 
        ? img.every(subImg => subImg && subImg.width > 0 && subImg.height > 0) 
        : img && img.width > 0 && img.height > 0
    )
  );

  if (allImagesLoaded) {
    startPage();
  } else {
    console.log("Images are not fully loaded yet.");
  }

  console.log("Images array:", images);
  console.log("Selected indices:", selectedIndices);
}