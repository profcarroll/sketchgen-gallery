let sparks = [];
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(10, 10, 30);
  noStroke();
}

function draw() {
  background(bgColor);
  
  // Create new sparks from campfire
  if (frameCount % 2 === 0) {
    sparks.push({
      pos: createVector(width/2, height - 20),
      vel: p5.Vector.random2D().mult(random(0.5, 1.5)),
      size: random(2, 4),
      col: color(255, 100, 0),
      life: 200,
      trail: []
    });
  }
  
  // Update and draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    
    // Add position to trail
    s.trail.push(s.pos.copy());
    if (s.trail.length > 15) {
      s.trail.shift();
    }
    
    // Apply gravity and update velocity
    s.vel.y += 0.03;
    s.vel.x *= 0.99;
    s.pos.add(s.vel);
    s.life -= 1;
    
    // Gradually cool the spark
    let coolFactor = map(s.pos.y, height, 0, 0, 1);
    let r = red(s.col);
    let g = green(s.col);
    let b = blue(s.col);
    s.col = color(r * coolFactor, g * coolFactor, b * coolFactor, s.life);
    
    // Draw trail
    if (s.trail.length > 1) {
      beginShape();
      for (let j = 0; j < s.trail.length; j++) {
        let alpha = map(j, 0, s.trail.length - 1, 0, 200);
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
      // Slow down and reorganize
      s.vel.mult(0.95);
      
      // Convert to white/blue points at high altitude
      if (s.pos.y < height * 0.1) {
        s.col = color(255, 255, 255, s.life);
        s.size = map(s.pos.y, 0, height * 0.1, 1, 6);
        
        // Connect to nearby sparks forming patterns
        let nearbySparks = [];
        for (let j = 0; j < sparks.length; j++) {
          if (i !== j) {
            let d = p5.Vector.dist(s.pos, sparks[j].pos);
            if (d < 80) {
              nearbySparks.push(sparks[j]);
            }
          }
        }
        
        // Draw connections to nearby points
        for (let ns of nearbySparks) {
          stroke(255, 255, 255, 50);
          line(s.pos.x, s.pos.y, ns.pos.x, ns.pos.y);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
