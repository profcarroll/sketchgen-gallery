let particles = [];
let flowField;
let zoff = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create particles
  for (let i = 0; i < 2000; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      hue: random(360),
      size: random(1, 3)
    });
  }
  
  // Create flow field
  flowField = new Array(width * height).fill(0);
}

function draw() {
  // Dark background with slight fade
  fill(0, 0, 0, 0.05);
  rect(0, 0, width, height);
  
  let yoff = 0;
  for (let y = 0; y < height; y += 10) {
    let xoff = 0;
    for (let x = 0; x < width; x += 10) {
      let index = x + y * width;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      flowField[index] = angle;
      xoff += 0.01;
    }
    yoff += 0.01;
  }
  
  zoff += 0.005;
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    let index = floor(p.pos.x) + floor(p.pos.y) * width;
    if (index >= 0 && index < flowField.length) {
      let angle = flowField[index];
      let force = p5.Vector.fromAngle(angle);
      force.mult(0.2);
      
      p.vel.add(force);
      p.vel.limit(2);
      p.pos.add(p.vel);
      
      // Wrap around edges
      if (p.pos.x > width) p.pos.x = 0;
      if (p.pos.x < 0) p.pos.x = width;
      if (p.pos.y > height) p.pos.y = 0;
      if (p.pos.y < 0) p.pos.y = height;
      
      // Update color
      p.hue += 0.2;
      if (p.hue > 360) p.hue = 0;
      
      fill(p.hue, 80, 90, 0.7);
      ellipse(p.pos.x, p.pos.y, p.size);
    }
  }
}
