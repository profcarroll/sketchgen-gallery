let pyramids = [];
let waterRipples = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pyramids
  for (let i = 0; i < 20; i++) {
    pyramids.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: random(30, 80),
      height: random(100, 200),
      hue: random(200, 260)
    });
  }

  // Create water ripples
  for (let i = 0; i < 50; i++) {
    waterRipples.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: random(180, 220)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.2) * 300;
  let camY = cos(time * 0.15) * 100;
  camera(0, 0, 400 + camY, 0, 0, 0, 0, 1, 0);

  // Draw pyramids
  for (let p of pyramids) {
    push();
    translate(p.x, 0, p.z);
    
    // Pyramid base (triangle)
    fill(p.hue, 80, 90);
    noStroke();
    beginShape(TRIANGLES);
    vertex(0, -p.height/2, 0);
    vertex(-p.size/2, p.height/2, -p.size/2);
    vertex(p.size/2, p.height/2, -p.size/2);
    
    vertex(0, -p.height/2, 0);
    vertex(p.size/2, p.height/2, -p.size/2);
    vertex(p.size/2, p.height/2, p.size/2);
    
    vertex(0, -p.height/2, 0);
    vertex(p.size/2, p.height/2, p.size/2);
    vertex(-p.size/2, p.height/2, p.size/2);
    
    vertex(0, -p.height/2, 0);
    vertex(-p.size/2, p.height/2, p.size/2);
    vertex(-p.size/2, p.height/2, -p.size/2);
    endShape();
    
    // Bioluminescent highlight
    fill(p.hue, 100, 100, 0.3);
    beginShape(TRIANGLES);
    vertex(0, -p.height/2, 0);
    vertex(-p.size/4, p.height/2, -p.size/4);
    vertex(p.size/4, p.height/2, -p.size/4);
    
    vertex(0, -p.height/2, 0);
    vertex(p.size/4, p.height/2, -p.size/4);
    vertex(p.size/4, p.height/2, p.size/4);
    
    vertex(0, -p.height/2, 0);
    vertex(p.size/4, p.height/2, p.size/4);
    vertex(-p.size/4, p.height/2, p.size/4);
    
    vertex(0, -p.height/2, 0);
    vertex(-p.size/4, p.height/2, p.size/4);
    vertex(-p.size/4, p.height/2, -p.size/4);
    endShape();
    
    pop();
  }

  // Draw water ripples
  for (let ripple of waterRipples) {
    ripple.radius += ripple.speed;
    
    if (ripple.radius > ripple.maxRadius) {
      ripple.radius = 0;
      ripple.x = random(-width/2, width/2);
      ripple.z = random(-height/2, height/2);
      ripple.maxRadius = random(100, 300);
    }
    
    push();
    translate(ripple.x, 0, ripple.z);
    noFill();
    stroke(ripple.hue, 80, 90, 0.5);
    strokeWeight(2);
    ellipse(0, 0, ripple.radius * 2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
