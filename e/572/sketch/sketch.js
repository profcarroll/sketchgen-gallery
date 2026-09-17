let shells = [];
const numShells = 150;
const sandColor = [245, 230, 180]; // pale yellow sand
const shellColors = [
  [255, 250, 240], // white
  [255, 245, 230], // cream
  [255, 230, 200], // light peach
  [240, 220, 180], // sand
  [255, 240, 220]  // pale beige
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Generate sand mound using a sine wave for gentle slope
  const moundHeight = height * 0.6;
  const moundWidth = width * 0.8;

  // Create shells with randomized positions and properties
  for (let i = 0; i < numShells; i++) {
    const x = random(width * 0.1, width * 0.9);
    const y = map(noise(x * 0.02, i), 0, 1, height * 0.7, height * 0.95);
    const size = random(8, 25);
    const hue = random(30, 60); // yellow-orange range
    const saturation = random(20, 60);
    const brightness = random(70, 90);
    const alpha = random(150, 220);
    const rotation = random(TWO_PI);

    shells.push({
      x,
      y,
      size,
      hue,
      saturation,
      brightness,
      alpha,
      rotation
    });
  }
}

function draw() {
  background(240, 230, 200); // sky blue background

  // Draw sand mound gradient
  const gradient = drawingContext.createLinearGradient(0, height * 0.7, 0, height);
  gradient.addColorStop(0, color(sandColor[0], sandColor[1], sandColor[2]));
  gradient.addColorStop(1, color(sandColor[0] - 30, sandColor[1] - 30, sandColor[2] - 30));
  drawingContext.fillStyle = gradient;

  // Draw mound shape
  beginShape();
  for (let x = 0; x < width; x += 5) {
    const y = height * 0.8 + sin(x * 0.01) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Draw shells
  for (let i = 0; i < shells.length; i++) {
    const shell = shells[i];
    push();
    translate(shell.x, shell.y);
    rotate(shell.rotation);
    
    // Shell body with translucent fill
    noStroke();
    fill(shell.hue, shell.saturation, shell.brightness, shell.alpha);
    
    // Draw a simple shell shape using ellipse and arc
    ellipse(0, 0, shell.size, shell.size * 0.7);
    
    // Add some details to make it look like a seashell
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    noFill();
    arc(0, 0, shell.size * 0.8, shell.size * 0.6, 0, PI);
    
    pop();
  }
}
