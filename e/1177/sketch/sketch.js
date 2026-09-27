let hexagons = [];
let time = 0;
let audioContextStarted = false;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of hexagons
  let hexRadius = 40;
  let horizontalSpacing = hexRadius * 1.5;
  let verticalSpacing = hexRadius * Math.sqrt(3) / 2;
  
  for (let y = -verticalSpacing; y < height + verticalSpacing; y += verticalSpacing) {
    for (let x = -horizontalSpacing; x < width + horizontalSpacing; x += horizontalSpacing) {
      // Offset every other row
      let offsetX = (y / verticalSpacing) % 2 === 0 ? 0 : hexRadius * 0.75;
      hexagons.push({
        x: x + offsetX,
        y: y,
        radius: hexRadius,
        hue: random(20, 50), // Amber to gold
        saturation: random(80, 100),
        brightness: random(60, 90),
        pulseSpeed: random(0.02, 0.05),
        warpSpeed: random(0.005, 0.01),
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.02;
  
  // Draw hexagons
  for (let hex of hexagons) {
    let pulse = sin(time * hex.pulseSpeed + hex.phase) * 0.5 + 0.5;
    let warp = sin(time * hex.warpSpeed + hex.phase) * 0.1;
    
    // Apply subtle warping to the position
    let warpedX = hex.x + sin(time * 0.02 + hex.phase) * 5 * warp;
    let warpedY = hex.y + cos(time * 0.03 + hex.phase) * 5 * warp;
    
    push();
    translate(warpedX, warpedY);
    
    // Draw hexagon with pulsing glow
    noStroke();
    fill(hex.hue, hex.saturation, hex.brightness * (0.7 + pulse * 0.3), 1);
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let px = cos(angle) * (hex.radius + sin(time * 0.05 + i) * 2);
      let py = sin(angle) * (hex.radius + sin(time * 0.05 + i) * 2);
      vertex(px, py);
    }
    endShape(CLOSE);
    
    // Add highlight
    fill(hex.hue, hex.saturation, 100, 0.8);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let px = cos(angle) * (hex.radius * 0.4 + sin(time * 0.05 + i) * 2);
      let py = sin(angle) * (hex.radius * 0.4 + sin(time * 0.05 + i) * 2);
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function mousePressed() {
  if (!audioContextStarted) {
    userStartAudio();
    audioContextStarted = true;
  }
}
