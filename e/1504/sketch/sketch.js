let sparks = [];
let particles = [];
let emitter;
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(10, 10, 30);
  emitter = createVector(width/2, height - 50);
  
  // Create initial campfire streaks and spheres
  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let dist = random(30, 100);
    let x = emitter.x + cos(angle) * dist;
    let y = emitter.y + sin(angle) * dist;
    particles.push({
      pos: createVector(x, y),
      vel: createVector(0, 0),
      size: random(5, 15),
      col: color(random(255), random(100, 200), 0),
      life: 255
    });
  }
  
  noStroke();
}

function draw() {
  background(bgColor);
  
  // Draw campfire particles
  for (let p of particles) {
    fill(p.col);
    ellipse(p.pos.x, p.pos.y, p.size);
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(particles.indexOf(p), 1);
    }
  }
  
  // Create new sparks
  if (frameCount % 3 === 0) {
    sparks.push({
      pos: emitter.copy(),
      vel: p5.Vector.random2D().mult(random(0.5, 1.5)),
      size: random(2, 5),
      col: color(255, 150, 0),
      life: 200,
      trail: []
    });
  }
  
  // Update and draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    
    // Add position to trail
    s.trail.push(s.pos.copy());
    if (s.trail.length > 10) {
      s.trail.shift();
    }
    
    // Apply gravity and update velocity
    s.vel.y += 0.02;
    s.pos.add(s.vel);
    s.life -= 1;
    
    // Draw trail
    if (s.trail.length > 1) {
      beginShape();
      for (let j = 0; j < s.trail.length; j++) {
        let alpha = map(j, 0, s.trail.length - 1, 0, 255);
        fill(red(s.col), green(s.col), blue(s.col), alpha);
        vertex(s.trail[j].x, s.trail[j].y);
      }
      endShape();
    }
    
    // Draw spark
    fill(s.col);
    ellipse(s.pos.x, s.pos.y, s.size);
    
    if (s.life <= 0) {
      sparks.splice(i, 1);
    }
  }
  
  // Reorganize sparks into constellations at higher altitudes
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    if (s.pos.y < height * 0.3) {
      // Slow down and organize
      s.vel.mult(0.95);
      s.size = map(s.pos.y, 0, height, 2, 8);
      
      // Create a small group of aligned particles
      if (frameCount % 30 === 0 && sparks.length < 100) {
        let nearbySparks = sparks.filter(sp => 
          p5.Vector.dist(s.pos, sp.pos) < 50 && sp !== s
        );
        
        if (nearbySparks.length > 2) {
          // Create a constellation-like structure
          for (let j = 0; j < 3; j++) {
            let offset = p5.Vector.random2D().mult(random(10, 30));
            sparks.push({
              pos: s.pos.copy().add(offset),
              vel: createVector(0, 0),
              size: random(3, 6),
              col: color(255, 200, 100),
              life: 100,
              trail: []
            });
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
