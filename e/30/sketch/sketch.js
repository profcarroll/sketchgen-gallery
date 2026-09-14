let hexagons = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a grid of hexagons
  let spacing = 80;
  for (let x = -width/2; x < width/2; x += spacing) {
    for (let y = -height/2; y < height/2; y += spacing) {
      hexagons.push({
        x: x,
        y: y,
        size: spacing * 0.4,
        rotation: random(TWO_PI),
        hue: random(360)
      });
    }
  }
}

function draw() {
  background(0);
  time += 0.002;

  // Rotate the entire scene
  rotateX(time * 0.1);
  rotateY(time * 0.15);

  for (let hex of hexagons) {
    push();
    
    // Position each hexagon
    translate(hex.x, hex.y, 0);
    
    // Apply rotation based on time and position
    let rot = hex.rotation + time * 0.2;
    rotateZ(rot);
    
    // Color modulation using sine wave for saturation
    let sat = map(sin(time * 0.5 + hex.x * 0.001 + hex.y * 0.001), -1, 1, 30, 100);
    let hue = (hex.hue + time * 20) % 360;
    
    // Draw hexagon with dynamic color
    fill(hue, sat, 80, 0.9);
    noStroke();
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = hex.size * cos(angle);
      let y = hex.size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
