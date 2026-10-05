let panels = [];
let fragments = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
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
  time += 0.02;
  
  // Subtle background gradient
  let bg = lerpColor(color(15, 15, 35), color(30, 30, 60), sin(time * 0.2) * 0.5 + 0.5);
  background(bg);
  
  // Draw stained glass panels with glowing edges
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
  
  // Create glowing shards that spiral toward center
  if (frameCount % 3 === 0) {
    let fragment = {
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      hue: random(360),
      life: random(120, 240),
      maxLife: random(120, 240),
      size: random(2, 8),
      spiralPhase: random(TWO_PI)
    };
    fragments.push(fragment);
  }
  
  // Update and draw fragments
  for (let i = fragments.length - 1; i >= 0; i--) {
    let f = fragments[i];
    
    // Move fragment toward center with spiral effect
    let dx = width/2 - f.x;
    let dy = height/2 - f.y;
    let dist = sqrt(dx*dx + dy*dy);
    
    // Spiral motion: add rotational component to movement
    f.spiralPhase += 0.05;
    let spiralForce = sin(f.spiralPhase) * 0.3;
    
    f.vx += (dx / dist) * 0.02 + spiralForce;
    f.vy += (dy / dist) * 0.02;
    
    // Apply velocity
    f.x += f.vx;
    f.y += f.vy;
    
    // Dampen velocity
    f.vx *= 0.95;
    f.vy *= 0.95;
    
    f.life--;
    
    // Draw fragment as glowing point
    drawingContext.globalCompositeOperation = 'lighten';
    noStroke();
    fill(f.hue, 100, 100, map(f.life, 0, f.maxLife, 0, 255));
    
    push();
    translate(f.x, f.y);
    sphere(f.size);
    pop();
    
    // Remove dead fragments
    if (f.life <= 0) {
      fragments.splice(i, 1);
    }
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
