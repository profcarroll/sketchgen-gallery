let shapes = [];
let bursts = [];
const shapeCount = 500;
const maxBursts = 10;
const burstRadius = 100;
const particleCount = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize shapes
  for (let i = 0; i < shapeCount; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(10, 50),
      hue: random(360),
      saturation: random(30, 70),
      brightness: random(20, 40),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    bursts.push({
      x: 0,
      y: 0,
      z: 0,
      radius: 0,
      maxRadius: random(50, 100),
      hue: random(360),
      alpha: 1
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Update and display shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Animate shape
    s.angle += s.speed;
    s.x = s.x + sin(s.angle) * 0.5;
    s.y = s.y + cos(s.angle) * 0.5;
    
    // Draw shape with glow effect
    push();
    translate(s.x, s.y, s.z);
    noStroke();
    fill(s.hue, s.saturation, s.brightness, 0.6);
    
    // Draw a geometric shape (sphere for variety)
    if (i % 3 === 0) {
      sphere(s.size);
    } else if (i % 3 === 1) {
      box(s.size);
    } else {
      torus(s.size, s.size/2);
    }
    pop();
  }
  
  // Update and display bursts
  for (let i = 0; i < bursts.length; i++) {
    let b = bursts[i];
    
    if (b.radius > 0) {
      push();
      translate(b.x, b.y, b.z);
      
      noStroke();
      fill(b.hue, 100, 100, b.alpha);
      
      // Draw ripple effect
      sphere(b.radius);
      b.radius += 2;
      b.alpha -= 0.02;
      
      pop();
    }
  }
  
  // Remove old bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    if (bursts[i].alpha <= 0) {
      bursts.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Trigger burst at cursor position
  triggerBurst(mouseX - width/2, mouseY - height/2, 0);
  return false;
}

function mouseDragged() {
  // Trigger burst at cursor position during drag
  triggerBurst(mouseX - width/2, mouseY - height/2, 0);
  return false;
}

function triggerBurst(x, y, z) {
  if (bursts.length < maxBursts) {
    bursts.push({
      x: x,
      y: y,
      z: z,
      radius: 0,
      maxRadius: random(50, 100),
      hue: random(360),
      alpha: 1
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
