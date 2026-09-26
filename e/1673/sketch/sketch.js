let panels = [];
let lightBeam;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create complex stained glass structure with interconnected panels
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(30, 120);
    let h = random(30, 120);
    let rot = random(TWO_PI);
    
    // Create polygon with random vertices
    let points = [];
    let numPoints = floor(random(3, 7));
    for (let j = 0; j < numPoints; j++) {
      let angle = map(j, 0, numPoints, 0, TWO_PI);
      let r = random(w * 0.3, w * 0.45);
      points.push({
        x: cos(angle) * r,
        y: sin(angle) * r
      });
    }
    
    // Vibrant, saturated colors for stained glass effect
    let c = color(
      random(180, 255),
      random(100, 220),
      random(100, 220),
      random(180, 240)
    );
    
    panels.push({x, y, w, h, rot, points, c});
  }
  
  lightBeam = {
    angle: 0,
    pulse: 0
  };
}

function draw() {
  time += 0.01;
  
  // Subtle background gradient
  let bg = lerpColor(color(15, 15, 35), color(30, 30, 60), sin(time * 0.2) * 0.5 + 0.5);
  background(bg);
  
  // Update light beam
  lightBeam.angle += 0.005;
  lightBeam.pulse = sin(time * 3) * 0.3 + 0.7;
  
  // Draw stained glass panels
  for (let panel of panels) {
    push();
    translate(panel.x, panel.y);
    rotate(panel.rot);
    
    fill(panel.c);
    beginShape();
    for (let p of panel.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    
    // Add subtle highlight to edges
    stroke(255, 200);
    strokeWeight(1);
    beginShape();
    for (let p of panel.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw sweeping light beam with pulsing contraction
  let beamSize = 800 * lightBeam.pulse;
  let beamX = width/2 + cos(lightBeam.angle) * width/3;
  let beamY = height/2 + sin(lightBeam.angle) * height/3;
  
  // Create a radial light effect that sweeps around
  drawingContext.globalCompositeOperation = 'lighten';
  drawingContext.fillStyle = `rgba(255, 255, 255, ${0.1 * lightBeam.pulse})`;
  
  push();
  translate(beamX, beamY);
  ellipse(0, 0, beamSize, beamSize);
  pop();
  
  // Add secondary beams that pulse around the structure
  for (let i = 0; i < 6; i++) {
    let angle = lightBeam.angle + i * TWO_PI/6;
    let x = width/2 + cos(angle) * width/4;
    let y = height/2 + sin(angle) * height/4;
    
    let pulse = sin(time * 3 + i) * 0.3 + 0.7;
    let size = 200 * pulse;
    
    drawingContext.fillStyle = `rgba(255, 255, 255, ${0.05 * pulse})`;
    push();
    translate(x, y);
    ellipse(0, 0, size, size);
    pop();
  }
  
  // Add subtle time-of-day overlay
  let overlay = lerpColor(
    color(255, 100, 100, 0),
    color(100, 100, 200, 30),
    sin(time * 0.1) * 0.5 + 0.5
  );
  fill(overlay);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
