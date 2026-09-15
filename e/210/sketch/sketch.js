let shapes = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create floating shapes
  for (let i = 0; i < 8; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.005, 0.02),
      hue: random(360),
      rotation: random(TWO_PI)
    });
  }
  
  // Create particles for nebula effect
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      opacity: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Update and display floating shapes
  for (let shape of shapes) {
    // Smooth motion with sine wave
    shape.x += sin(time * shape.speed) * 0.5;
    shape.y += cos(time * shape.speed * 0.7) * 0.5;
    
    // Rotation
    shape.rotation += 0.01;
    
    // Hue shift for color cycling
    shape.hue = (shape.hue + 0.5) % 360;
    
    push();
    translate(shape.x, shape.y);
    rotate(shape.rotation);
    
    // Draw amorphous shape with blend mode
    noStroke();
    fill(shape.hue, 80, 90, 0.3);
    blendMode(LIGHTEST);
    
    // Create organic blob-like shape using ellipse and noise
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = shape.size * (0.8 + 0.2 * sin(a * 3 + time));
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and display particles for nebula effect
  blendMode(BLEND);
  for (let p of particles) {
    // Smooth movement with noise
    p.x += noise(p.x * 0.01, p.y * 0.01, time) * p.speed - 0.5;
    p.y += noise(p.x * 0.01, p.y * 0.01, time + 100) * p.speed - 0.5;
    
    // Keep particles within canvas
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw particle with low opacity
    noStroke();
    fill(200, 50, 100, p.opacity);
    ellipse(p.x, p.y, p.size);
  }
  
  // Create connections between nearby shapes
  blendMode(LIGHTEST);
  stroke(200, 70, 90, 0.2);
  noFill();
  beginShape();
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let d = dist(shapes[i].x, shapes[i].y, shapes[j].x, shapes[j].y);
      if (d < 300) {
        line(shapes[i].x, shapes[i].y, shapes[j].x, shapes[j].y);
      }
    }
  }
  endShape();
  
  // Add some chaotic energy effect
  if (frameCount % 30 === 0) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 50);
    fill(random(200, 300), 80, 90, 0.3);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
