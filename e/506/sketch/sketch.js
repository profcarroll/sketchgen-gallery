let planes = [];
const numPlanes = 15;
const timeScale = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize planes with random properties
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2)),
      size: random(100, 300),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.005, 0.005),
      hue: random(360),
      opacity: random(0.3, 0.7),
      shape: random(['ellipse', 'rect', 'triangle']),
      distortion: random(0.1, 0.8)
    });
  }
}

function draw() {
  background(0);
  
  // Ambient lighting
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 1000);
  
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Update position
    p.pos.x += sin(frameCount * p.speed) * 0.5;
    p.pos.y += cos(frameCount * p.speed) * 0.5;
    p.angle += p.rotationSpeed;
    
    // Keep planes within bounds
    if (p.pos.x > width/2 + p.size) p.pos.x = -width/2 - p.size;
    if (p.pos.x < -width/2 - p.size) p.pos.x = width/2 + p.size;
    if (p.pos.y > height/2 + p.size) p.pos.y = -height/2 - p.size;
    if (p.pos.y < -height/2 - p.size) p.pos.y = height/2 + p.size;
    
    push();
    translate(p.pos.x, p.pos.y);
    rotateZ(p.angle);
    
    // Draw glowing plane
    noStroke();
    fill(p.hue, 80, 95, p.opacity);
    
    // Create a more defined shape by distorting the basic form
    const distortion = sin(frameCount * timeScale + i) * p.distortion;
    
    if (p.shape === 'ellipse') {
      ellipse(0, 0, p.size + distortion * 100, p.size + distortion * 100);
    } else if (p.shape === 'rect') {
      rectMode(CENTER);
      rect(0, 0, p.size + distortion * 100, p.size + distortion * 100);
    } else if (p.shape === 'triangle') {
      triangle(
        0, -p.size/2,
        -p.size/2, p.size/2,
        p.size/2, p.size/2
      );
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
