let hexagons = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of hexagons
  let hexSize = 60;
  let cols = ceil(width / (hexSize * 1.5)) + 2;
  let rows = ceil(height / (hexSize * sqrt(3))) + 2;
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * hexSize * 1.5;
      let y = j * hexSize * sqrt(3);
      // Offset every other row
      if (j % 2 === 1) x += hexSize * 0.75;
      
      hexagons.push({
        x: x,
        y: y,
        size: hexSize,
        color: color(0, 0, 0, 0),
        hue: random(360),
        saturation: random(80, 100),
        brightness: random(70, 100)
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  for (let hex of hexagons) {
    // Animate color transitions
    let hue = (hex.hue + sin(time * 0.5 + hex.x * 0.01) * 30) % 360;
    let saturation = hex.saturation + sin(time * 0.3 + hex.y * 0.01) * 20;
    let brightness = hex.brightness + cos(time * 0.4 + (hex.x + hex.y) * 0.005) * 30;
    
    fill(hue, saturation, brightness, 200);
    
    // Draw hexagon
    push();
    translate(hex.x, hex.y);
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i - PI/2;
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
