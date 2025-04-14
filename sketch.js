const GAMEPAD_BUTTONS = {
  BTN_TRIGGER: 0,
  BTN_THUMB: 1,
  BTN_THUMB2: 2,
  BTN_TOP: 3,
  BTN_TOP2: 4
};

let frameInterval = 60; 
let imageIndex = 0; 
let toggle = true; 
let controllers = []
let released = [];
let pressed = [];
let justPressed = []; // New array to track "just pressed" state
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

let buttons = []; // Define a global buttons array

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
    justPressed[i] = false; // Initialize "just pressed" state
  }
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

function gamepadHandler(event, connecting) {
  let gamepad = event.gamepad;
  if (connecting) {
    print("Connecting to controller " + gamepad.index);
    controllers[gamepad.index] = gamepad;
  } else {
    delete controllers[gamepad.index];
  }
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
    image(img, 0, -height / 4 + 80, img.width * scale, img.height * scale);
  }
}

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

function handleGamepadInput() {
  if (!gameStarted) {
    if (justPressed[GAMEPAD_BUTTONS.BTN_TOP2]) {
      gameStarted = true;
    }
    return;
  }

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

  // Reset the justPressed array after handling input
  for (let i = 0; i < justPressed.length; i++) {
    justPressed[i] = false;
  }
}

function draw() {
  background("white"); // Clear the canvas
  translate(width / 2, height / 2); // Center the canvas

  // Update gamepad state
  updateGamepadState();

  // Handle gamepad input
  handleGamepadInput();

  // Ensure all images are loaded before drawing
  let allImagesLoaded = images.every(row => row.every(img => img && img.width > 0 && img.height > 0));

  if (allImagesLoaded) {
    startPage();
  } else {
    console.log("Images are not fully loaded yet.");
  }
}