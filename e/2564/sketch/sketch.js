let pipes = [];
let minerals = [];
let energyLines = [];
let clickTime = 0;
let lastClick = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  noStroke();
  
  // Create pipe network structure
  for (let i = 0; i < 150; i++) {
    pipes.push({
      x: random(width),
      y: random(height),
      width: random(2, 8),
      height: random(2, 8),
      angle: random(TWO_PI),
      segments: floor(random(3, 8)),
      segmentLength: random(20, 60),
      hue: 0.5,
      saturation: 0.3,
      brightness: 0.7
    });
  }
  
  // Create mineral deposits
  for (let i = 0; i < 300; i++) {
    minerals.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      hue: 0.1,
      saturation: 0.8,
      brightness: random(0.2, 0.5)
    });
  }
  
  // Create energy lines
  for (let i = 0; i < 50; i++) {
    energyLines.push({
      points: [],
      speed: random(0.01, 0.03),
      offset: random(TWO_PI),
      hue: 0.6,
      saturation: 1,
      brightness: 0.8
    });
    
    // Generate path for each line
    let x = random(width);
    let y = random(height);
    for (let j = 0; j < 20; j++) {
      energyLines[i].points.push({
        x: x,
        y: y,
        age: j * 0.1
      });
      x += random(-20, 20);
      y += random(-20, 20);
    }
  }
}

function draw() {
  background(0.05);
  
  // Draw mineral deposits
  for (let i = 0; i < minerals.length; i++) {
    let m = minerals[i];
    fill(m.hue, m.saturation, m.brightness);
    ellipse(m.x, m.y, m.size, m.size);
  }
  
  // Draw pipe network
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    
    // Draw main pipe segment
    fill(p.hue, p.saturation, p.brightness);
    rect(0, -p.width/2, p.segmentLength * p.segments, p.width);
    
    // Draw pipe joints
    for (let j = 1; j < p.segments; j++) {
      let jointX = j * p.segmentLength;
      fill(p.hue, p.saturation, p.brightness * 0.8);
      rect(jointX - 2, -p.width/2 - 2, 4, p.width + 4);
    }
    
    pop();
  }
  
  // Draw energy lines
  let time = millis() * 0.001;
  for (let i = 0; i < energyLines.length; i++) {
    let line = energyLines[i];
    let pulse = sin(time * 2 + line.offset) * 0.5 + 0.5;
    
    // Only draw if not clicked recently
    if (millis() - lastClick > 1000 || clickTime > millis()) {
      stroke(line.hue, line.saturation, line.brightness * pulse);
      strokeWeight(1);
      beginShape();
      for (let j = 0; j < line.points.length; j++) {
        let point = line.points[j];
        let t = j / (line.points.length - 1);
        let x = point.x + sin(t * TWO_PI * 3 + time * line.speed + line.offset) * 5;
        let y = point.y + cos(t * TWO_PI * 2 + time * line.speed + line.offset) * 5;
        vertex(x, y);
      }
      endShape();
    }
  }
  
  // Draw glowing pulse effect
  if (millis() - lastClick < 1000 && clickTime > millis()) {
    let pulse = map(millis() - lastClick, 0, 1000, 1, 0);
    stroke(0.6, 1, 1);
    strokeWeight(pulse * 3);
    noFill();
    ellipse(width/2, height/2, width * pulse, height * pulse);
  }
}

function mousePressed() {
  // Start click effect
  lastClick = millis();
  clickTime = millis() + 500;
  
  // Reset all energy lines to visible state
  for (let i = 0; i < energyLines.length; i++) {
    energyLines[i].offset = random(TWO_PI);
  }
}
