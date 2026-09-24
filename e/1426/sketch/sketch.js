let particles = [];
let nebulae = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 8),
      hue: random(360),
      age: 0
    });
  }
  
  // Initialize nebulae
  for (let i = 0; i < 10; i++) {
    nebulae.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      size: random(50, 200),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      hue: random(360),
      age: random(100)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.2) * width/4;
  let camY = cos(time * 0.3) * height/4;
  camera(0, 0, (height/2) / tan(PI/6), camX, camY, 0, 0, 1, 0);
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply forces from nebulae
    for (let n of nebulae) {
      let dir = p5.Vector.sub(n.pos, p.pos);
      let distance = dir.mag();
      if (distance < n.size * 2) {
        dir.normalize();
        let force = map(distance, 0, n.size * 2, 1, 0);
        p.vel.add(dir.mult(force * 0.1));
      }
    }
    
    // Update position
    p.pos.add(p.vel);
    p.age++;
    
    // Wrap around edges
    if (p.pos.x > width/2 + 50) p.pos.x = -width/2 - 50;
    if (p.pos.x < -width/2 - 50) p.pos.x = width/2 + 50;
    if (p.pos.y > height/2 + 50) p.pos.y = -height/2 - 50;
    if (p.pos.y < -height/2 - 50) p.pos.y = height/2 + 50;
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, 0.7);
    sphere(p.size);
    pop();
  }
  
  // Update and draw nebulae
  for (let i = 0; i < nebulae.length; i++) {
    let n = nebulae[i];
    
    // Update position
    n.pos.add(n.vel);
    n.age++;
    
    // Wrap around edges
    if (n.pos.x > width/2 + 200) n.pos.x = -width/2 - 200;
    if (n.pos.x < -width/2 - 200) n.pos.x = width/2 + 200;
    if (n.pos.y > height/2 + 200) n.pos.y = -height/2 - 200;
    if (n.pos.y < -height/2 - 200) n.pos.y = height/2 + 200;
    
    // Draw nebula
    push();
    translate(n.pos.x, n.pos.y, n.pos.z);
    noStroke();
    fill(n.hue, 70, 80, 0.15);
    sphere(n.size);
    pop();
  }
  
  // Connect nearby particles with lines
  beginShape(LINES);
  stroke(200, 50, 80, 0.2);
  noFill();
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      let distance = dist(p1.pos.x, p1.pos.y, p1.pos.z, p2.pos.x, p2.pos.y, p2.pos.z);
      
      if (distance < 150) {
        vertex(p1.pos.x, p1.pos.y, p1.pos.z);
        vertex(p2.pos.x, p2.pos.y, p2.pos.z);
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
