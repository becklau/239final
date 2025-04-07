// let port, reader, writer;
// let pinsUsed = ["apin0", "apin1", "dpin2", "dpin4", "dpin6"]; // List of pins used in the Arduino
// let sensorData = {}; // Object to store sensor readings
// let connectButton;
// let isConnected = false; // Flag to indicate if Arduino is connected
let assetPath = "UJCMDonut/gameAssets/";
let gameAssets = [
  ["Title1.png", "Title2.png", "background.png"],
  ["Bismark.png", "CiderMill.png", "LongJohn.png", "TractorTire.png", "Yeast.png", "SourCream.png"],
  ["pinkFrosting.png", "chocFrosting.png", "whiteFrosting.png", "glaze.png"],
  ["ranbowSprinkles.png", "chocSprinkles.png", "chocDrizzle.png", "candies.png"],
  ["ciderGlass.png", "tractor.png"]
];

let images = [];

function preload() {
  for (let i = 0; i < gameAssets.length; i++) {
    images[i] = [];
    for (let j = 0; j < gameAssets[i].length; j++) {
      let path = assetPath + gameAssets[i][j];
      images[i][j] = loadImage(
        path,
        () => console.log(`Loaded: ${path}`), // Success callback
        () => console.error(`Failed to load: ${path}`) // Failure callback
      );
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  translate(width / 2, height / 2);
  imageMode(CENTER); // Set image mode to center for proper positioning

  // connectButton = createButton("Connect to Arduino");
  // connectButton.position(20, 20);
  // connectButton.mousePressed(connectToArduino);

  background("white");
}

// Connect to Arduino and set up serial communication
// async function connectToArduino() {
//   try {
//     port = await navigator.serial.requestPort();
//     await port.open({ baudRate: 9600 });

//     const textDecoder = new TextDecoderStream();
//     const textEncoder = new TextEncoderStream();
//     port.readable.pipeTo(textDecoder.writable);
//     textEncoder.readable.pipeTo(port.writable);

//     reader = textDecoder.readable
//       .pipeThrough(new TransformStream(new LineBreakTransformer()))
//       .getReader();
//     writer = textEncoder.writable.getWriter();

//     console.log("Connected to Arduino!");
//     connectButton.remove();
//     isConnected = true; // Set flag to true when connected
//     runSerial();
//   } catch (error) {
//     console.error("Failed to open serial port:", error);
//   }
// }

// Read serial data and process sensor values
// async function runSerial() {
//   try {
//     while (true) {
//       const { value, done } = await reader.read();
//       if (done) {
//         reader.releaseLock();
//         break;
//       }
//       processSerialData(value);
//     }
//   } catch (error) {
//     console.error("Error reading serial data:", error);
//   }
// }

// Parse and store sensor values
// function processSerialData(data) {
//   let values = data.split(",").map(parseFloat);

//   if (values.length >= 18) {
//     sensorData = {}; // Reset object

//     // set analog pins to either the value or empty string
//     for (let i = 0; i <= 5; i++) {
//       let pinName = `apin${i}`;
//       if (pinsUsed.includes(pinName)) {
//         sensorData[`analog${i}`] = values[i];
//       } else {
//         sensorData[`analog${i}`] = null;
//       }
//     }
//     // set digital pins to either the value or empty string
//     for (let i = 2; i <= 13; i++) {
//       let pinName = `dpin${i}`;
//       let index = i + 4; //start from index 6 in values array
//       if (pinsUsed.includes(pinName)) {
//         sensorData[`digital${i}`] = values[index];
//       } else {
//         sensorData[`digital${i}`] = null;
//       }
//     }
//   }
// }

// Retrieve sensor data
// function getSensorData(type) {
//   return sensorData[type] ?? 0; // Return 0 if not available
// }

function startPage(){
  translate(width / 2, height / 2);
    //images are displayed by calling images[i][j] where i is the index of the type of asset and j is the index of the image in that array, the final params are the location
  images[0][0].resize(0, height); 
  image(images[0][0], 0, 0);
}


function draw() {
  // if (!isConnected) {
  //   return; // Only draw if connected to Arduino
  // }

  // name the pin values, sample below
  //joystickX = getSensorData("analog1");

  //textSize(14);
  // let yOffset = 100;
  // for (let i = 0; i <= 5; i++) {
  //   text(`A${i}: ${getSensorData(`analog${i}`)}`, 20, yOffset);
  //   yOffset += 30;
  // }

  // for (let i = 2; i <= 13; i++) {
  //   text(`D${i}: ${getSensorData(`digital${i}`)}`, 20, yOffset);
  //   yOffset += 30;
  // }

}

// Class to handle line breaks in serial data
// class LineBreakTransformer {
//   constructor() {
//     this.chunks = "";
//   }

//   transform(chunk, controller) {
//     this.chunks += chunk;
//     const lines = this.chunks.split("\r\n");
//     this.chunks = lines.pop();
//     lines.forEach((line) => controller.enqueue(line));
//   }

//   flush(controller) {
//     controller.enqueue(this.chunks);
//   }
// }
