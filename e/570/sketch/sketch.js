let hexagons = [];
let palette = [];
let clickTriggered = false;
let clickTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hexagon grid
  let hexRadius = 60;
  let spacing = hexRadius * sqrt(3);
  let cols = ceil(width / spacing) + 2;
  let rows = ceil(height / spacing) + 2;
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * spacing + (j % 2) * spacing/2;
      let y = j * spacing * 0.75;
      hexagons.push({
        x: x,
        y: y,
        radius: hexRadius,
        rotation: 0,
        speed: random(0.005, 0.02),
        colorIndex: (i + j) % 6
      });
    }
  }
  
  // Initial palette
  generatePalette();
}

function draw() {
  if (clickTriggered && frameCount - clickTime > 30) {
    clickTriggered = false;
    generatePalette();
  }
  
  background(0);
  
  let time = millis() * 0.0005;
  
  for (let hex of hexagons) {
    // Update rotation
    hex.rotation += hex.speed;
    
    // Apply color shift if clicked
    let hueOffset = clickTriggered ? 180 : 0;
    let c = palette[(hex.colorIndex + int(time * 10) % 6) % 6];
    c = color((c + hueOffset) % 360, 90, 90);
    
    push();
    translate(hex.x, hex.y);
    rotate(hex.rotation);
    
    noStroke();
    fill(c);
    drawHexagon(hex.radius);
    
    pop();
  }
}

function drawHexagon(radius) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function generatePalette() {
  palette = [];
  for (let i = 0; i < 6; i++) {
    palette.push((i * 60 + frameCount * 0.5) % 360);
  }
}

function mousePressed() {
  clickTriggered = true;
  clickTime = frameCount;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
