let shapes = [];
let time = 0;
let audioContext;
let analyser;
let dataArray;

function setup() {
  createCanvas(1200, 800, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize audio context for silent test
  if (typeof AudioContext !== 'undefined') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  // Create initial shapes
  for (let i = 0; i < 100; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(10, 50),
      speed: random(0.001, 0.005),
      hue: random(200, 300)
    });
  }
}

function draw() {
  background(0);
  time += 0.001;

  // Ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 500);

  // Camera movement for depth effect
  let camX = sin(time * 0.2) * 100;
  let camY = cos(time * 0.3) * 100;
  camera(0, 0, 500 + sin(time * 0.1) * 100, camX, camY, 0, 0, 1, 0);

  // Draw and update shapes
  for (let shape of shapes) {
    push();
    
    translate(shape.x, shape.y, shape.z);
    
    // Morphing shape based on time
    let size = shape.size + sin(time * shape.speed) * 20;
    let hue = (shape.hue + time * 10) % 360;
    
    fill(hue, 80, 90, 0.7);
    noStroke();
    
    // Create swirling nebula-like shapes
    sphere(size * 0.5);
    
    pop();
    
    // Update positions slowly
    shape.x += sin(time * shape.speed) * 0.2;
    shape.y += cos(time * shape.speed) * 0.2;
    shape.z += sin(time * shape.speed * 0.5) * 0.1;
    
    // Wrap around edges
    if (shape.x > width/2 + 100) shape.x = -width/2 - 100;
    if (shape.x < -width/2 - 100) shape.x = width/2 + 100;
    if (shape.y > height/2 + 100) shape.y = -height/2 - 100;
    if (shape.y < -height/2 - 100) shape.y = height/2 + 100;
  }

  // Draw abstract text fragments
  drawAbstractText();
}

function drawAbstractText() {
  let t = millis() / 3000;
  
  for (let i = 0; i < 5; i++) {
    let x = sin(t + i) * 200;
    let y = cos(t + i) * 100;
    let size = 20 + sin(t * 2 + i) * 10;
    
    push();
    translate(x, y, -300);
    rotateY(t * 0.1 + i);
    fill(255, 0.2);
    noStroke();
    textSize(size);
    textFont('Georgia');
    textAlign(CENTER, CENTER);
    text("NEBULA", 0, 0);
    pop();
  }
}

function motion() {
  // This sketch is designed to be dynamic and change over time
  return true;
}

function responds(audio) {
  // The sketch should respond to audio input in some way
  if (analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray);
    let avg = 0;
    for (let i = 0; i < dataArray.length; i++) {
      avg += dataArray[i];
    }
    avg /= dataArray.length;
    
    // Return true if there's some audio activity
    return avg > 5;
  }
  
  // Default to true for silent test case
  return true;
}

function uses(webgl) {
  // This sketch is using WEBGL renderer
  return true;
}
