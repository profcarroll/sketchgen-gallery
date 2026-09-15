let particles = [];
let pathways = [];
let connections = [];
let gridSize = 40;
let grid = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid
  for (let x = 0; x < width; x += gridSize) {
    grid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      grid[x][y] = {x: x, y: y};
    }
  }

  // Create pathways
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      if (random() > 0.3) {
        pathways.push({x, y});
      }
    }
  }

  // Create connections
  for (let i = 0; i < pathways.length; i++) {
    let p1 = pathways[i];
    for (let j = i + 1; j < pathways.length; j++) {
      let p2 = pathways[j];
      if (dist(p1.x, p1.y, p2.x, p2.y) < gridSize * 2.5) {
        connections.push({p1, p2});
      }
    }
  }

  // Create particles
  for (let i = 0; i < 150; i++) {
    let start = random(pathways);
    particles.push({
      x: start.x,
      y: start.y,
      target: null,
      speed: random(0.5, 2),
      hue: random(360),
      size: random(2, 4),
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Draw connections
  stroke(200, 80, 90, 0.3);
  strokeWeight(1);
  for (let c of connections) {
    line(c.p1.x, c.p1.y, c.p2.x, c.p2.y);
  }
  
  // Draw pathways
  noStroke();
  for (let p of pathways) {
    fill(200, 80, 90, 0.1);
    ellipse(p.x, p.y, gridSize * 0.3, gridSize * 0.3);
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Add to trail
    p.trail.push({x: p.x, y: p.y});
    if (p.trail.length > 10) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, 80, 90, 0.5);
    strokeWeight(1);
    beginShape();
    for (let t of p.trail) {
      vertex(t.x, t.y);
    }
    endShape();
    
    // Move particle
    if (!p.target || dist(p.x, p.y, p.target.x, p.target.y) < 5) {
      let candidates = [];
      for (let c of connections) {
        if (c.p1 === p.target || c.p2 === p.target) {
          candidates.push(c.p1 === p.target ? c.p2 : c.p1);
        }
      }
      
      if (candidates.length > 0) {
        p.target = random(candidates);
      } else {
        // If no target, pick a new pathway
        let newPathway = random(pathways);
        p.target = newPathway;
      }
    }
    
    if (p.target) {
      let dx = p.target.x - p.x;
      let dy = p.target.y - p.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      // Slow down at junction points
      let slowDown = 1;
      for (let c of connections) {
        if ((dist(p.x, p.y, c.p1.x, c.p1.y) < 20 || dist(p.x, p.y, c.p2.x, c.p2.y) < 20) && 
            distance < 50) {
          slowDown = 0.1;
        }
      }
      
      if (slowDown < 1) {
        // Create energy burst effect
        fill(p.hue, 100, 100, 0.5);
        noStroke();
        ellipse(p.x, p.y, 10 * slowDown, 10 * slowDown);
        
        // Burst effect
        if (frameCount % 30 === 0) {
          stroke(p.hue, 100, 100, 0.5);
          noFill();
          ellipse(p.x, p.y, 20 + frameCount % 20, 20 + frameCount % 20);
        }
      }
      
      p.x += dx / distance * p.speed * slowDown;
      p.y += dy / distance * p.speed * slowDown;
    }
    
    // Draw particle
    fill(p.hue, 80, 90, 0.8);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
  }
}
