let panels = [];
let fragments = [];
let time = 0;
let pulseIntensity = 0;
let pulseDirection = 1;
let destabilized = false;

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
  time += 0.05;
  
  // Subtle background gradient
  let bg = lerpColor(color(15, 15, 35), color(30, 30, 60), sin(time * 0.2) * 0.5 + 0.5);
  background(bg);
  
  // Pulse light effect - building intensity
  pulseIntensity += pulseDirection * 0.01;
  if (pulseIntensity > 1 || pulseIntensity < 0) {
    pulseDirection *= -1;
  }
  
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
  
  // Create light wave effect that traces major internal edges
  if (pulseIntensity > 0.7 && !destabilized && frameCount % 5 === 0) {
    let wave = {
      x: random(width),
      y: random(height),
      size: 0,
      hue: random(360),
      life: 60,
      maxLife: 60,
      speed: random(1, 3)
    };
    fragments.push(wave);
  }
  
  // Destabilization phase
  if (pulseIntensity > 0.9 && !destabilized) {
    destabilized = true;
    // Rapidly generate many fragments
    for (let i = 0; i < 50; i++) {
      let fragment = {
        x: width/2,
        y: height/2,
        vx: random(-3, 3),
        vy: random(-3, 3),
        hue: random(360),
        life: random(60, 120),
        maxLife: random(60, 120),
        size: random(5, 20)
      };
      fragments.push(fragment);
    }
  }
  
  // Update and draw wave fragments
  for (let i = fragments.length - 1; i >= 0; i--) {
    let f = fragments[i];
    
    if (destabilized) {
      // Fragment movement: erratic, fast
      f.x += f.vx;
      f.y += f.vy;
      f.vx *= 0.98;
      f.vy *= 0.98;
      f.life--;
    } else {
      // Wave expansion and fading
      f.size += f.speed;
      f.life--;
    }
    
    // Draw fragment
    drawingContext.globalCompositeOperation = 'lighten';
    noFill();
    stroke(f.hue, 100, 100, map(f.life, 0, f.maxLife, 0, 255));
    strokeWeight(2);
    
    if (destabilized) {
      // Draw fragment as a small expanding circle
      ellipse(f.x, f.y, f.size);
    } else {
      // Draw wave as glowing expanding ring
      ellipse(f.x, f.y, f.size);
    }
    
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
