let hexagons = [];
let gridWidth, gridHeight;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gridWidth = ceil(width / 100) + 2;
  gridHeight = ceil(height / 100) + 2;
  
  for (let y = 0; y < gridHeight; y++) {
    hexagons[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      hexagons[y][x] = {
        x: (x - gridWidth/2) * 100,
        y: (y - gridHeight/2) * 100,
        z: 0,
        baseZ: random(-50, 50),
        pulse: random(TWO_PI),
        tiltX: 0,
        tiltY: 0
      };
    }
  }
}

function draw() {
  background(20);
  
  time += 0.01;
  
  // Slow drift
  let driftX = sin(time * 0.1) * 2;
  let driftY = cos(time * 0.1) * 2;
  
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let hex = hexagons[y][x];
      
      // Pulsing effect
      let pulse = sin(hex.pulse + time) * 0.5 + 0.5;
      let hue = map(pulse, 0, 1, 30, 45); // Amber to honey
      
      push();
      translate(hex.x + driftX, hex.y + driftY, hex.baseZ);
      
      // Apply tilt from mouse
      let dx = (mouseX - width/2) / width;
      let dy = (mouseY - height/2) / height;
      
      hex.tiltX = lerp(hex.tiltX, dx * 0.5, 0.05);
      hex.tiltY = lerp(hex.tiltY, dy * 0.5, 0.05);
      
      rotateX(hex.tiltX);
      rotateY(hex.tiltY);
      
      fill(hue, 80, 90 + pulse * 10);
      noStroke();
      
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI * i / 6;
        let px = cos(angle) * 40;
        let py = sin(angle) * 40;
        vertex(px, py, 0);
      }
      endShape(CLOSE);
      
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
