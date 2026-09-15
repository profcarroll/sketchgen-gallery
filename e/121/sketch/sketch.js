let hexagons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize hexagons in a grid pattern
  let hexSize = 60;
  for (let y = -hexSize; y < height + hexSize; y += hexSize * 1.8) {
    for (let x = -hexSize; x < width + hexSize; x += hexSize * 1.8) {
      // Offset every other row
      if ((y / (hexSize * 1.8)) % 2 === 0) {
        x += hexSize * 0.9;
      }
      
      hexagons.push({
        x: x,
        y: y,
        size: hexSize,
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.02, 0.02),
        color: color(random(100, 255), random(100, 255), random(100, 255), 200)
      });
    }
  }
}

function draw() {
  background(10, 10, 30);
  
  // Update and display each hexagon
  for (let hex of hexagons) {
    hex.rotation += hex.rotationSpeed;
    
    push();
    translate(hex.x, hex.y);
    rotate(hex.rotation);
    
    fill(hex.color);
    drawHexagon(hex.size);
    
    pop();
  }
}

function drawHexagon(size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = cos(angle) * size;
    let y = sin(angle) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
