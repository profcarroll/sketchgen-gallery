let panels = [];
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
}

function draw() {
  time += 0.01;
  
  // Subtle background gradient
  let bg = lerpColor(color(15, 15, 35), color(30, 30, 60), sin(time * 0.2) * 0.5 + 0.5);
  background(bg);
  
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
    
    // Add glowing edge highlights that shift through spectrum
    let hueShift = (time * 20 + panel.x + panel.y) % 360;
    stroke(hueShift, 100, 100, 200);
    strokeWeight(2);
    beginShape();
    for (let p of panel.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw dynamic rainbow beams tracing edges
  drawingContext.globalCompositeOperation = 'lighten';
  
  for (let i = 0; i < 8; i++) {
    let angle = time * 0.5 + i * TWO_PI/8;
    let x = width/2 + cos(angle) * width/3;
    let y = height/2 + sin(angle) * height/3;
    
    // Create rainbow-colored beams
    let hue = (time * 30 + i * 45) % 360;
    drawingContext.fillStyle = `hsla(${hue}, 100%, 70%, ${0.1 + sin(time * 5 + i) * 0.05})`;
    
    push();
    translate(x, y);
    ellipse(0, 0, 800, 800);
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
