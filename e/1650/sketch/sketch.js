let clusters = [];
const MAX_CLUSTERS = 100;
const PARTICLES_PER_CLUSTER = 5;
const DRIFT_SPEED = 0.1;
const COALESCE_RADIUS = 80;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize clusters
  for (let i = 0; i < MAX_CLUSTERS; i++) {
    clusters.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      hue: 35,
      sat: 75,
      bri: 85,
      driftX: random(-DRIFT_SPEED, DRIFT_SPEED),
      driftY: random(-DRIFT_SPEED, DRIFT_SPEED),
      wobble: random(TWO_PI),
      particles: [],
      structure: []
    });
  }
  
  // Initialize particles and structural elements for each cluster
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    for (let j = 0; j < PARTICLES_PER_CLUSTER; j++) {
      cluster.particles.push({
        angle: random(TWO_PI),
        distance: random(0, cluster.size * 0.35),
        speed: random(0.01, 0.04)
      });
    }
    
    // Create structural forms
    for (let k = 0; k < 2; k++) {
      cluster.structure.push({
        angle: random(TWO_PI),
        radius: random(cluster.size * 0.3, cluster.size * 0.7),
        thickness: random(2, 5)
      });
    }
  }
}

function draw() {
  background(30, 5, 95);
  
  // Update and display clusters
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    
    // Update drift
    cluster.x += cluster.driftX;
    cluster.y += cluster.driftY;
    
    // Wobble for organic movement
    cluster.wobble += 0.01;
    const wobbleOffset = sin(cluster.wobble) * 0.4;
    
    // Wrap around screen
    if (cluster.x < -cluster.size) cluster.x = width + cluster.size;
    if (cluster.x > width + cluster.size) cluster.x = -cluster.size;
    if (cluster.y < -cluster.size) cluster.y = height + cluster.size;
    if (cluster.y > height + cluster.size) cluster.y = -cluster.size;
    
    // Draw the cluster
    push();
    translate(cluster.x, cluster.y);
    
    // Apply wobble to rotation
    rotate(wobbleOffset * 0.25);
    
    fill(cluster.hue, cluster.sat, cluster.bri, 0.7);
    noStroke();
    
    // Draw the main shape with sharp curves
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const r = cluster.size * (0.85 + sin(a * 4 + cluster.wobble) * 0.18);
      const x = cos(a) * r;
      const y = sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw structural elements
    for (let k = 0; k < cluster.structure.length; k++) {
      const s = cluster.structure[k];
      const angle = s.angle + cluster.wobble * 0.5;
      const radius = s.radius;
      
      stroke(cluster.hue, cluster.sat + 10, cluster.bri + 10, 0.8);
      strokeWeight(s.thickness);
      noFill();
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += 0.05) {
        const r = radius * (0.9 + sin(a * 3 + angle) * 0.12);
        const x = cos(a) * r;
        const y = sin(a) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    // Add subtle highlight
    fill(cluster.hue + 5, cluster.sat + 15, cluster.bri + 15, 0.35);
    ellipse(cluster.size * 0.25, -cluster.size * 0.2, cluster.size * 0.25);
    pop();
    
    // Update particles in cluster
    for (let j = 0; j < cluster.particles.length; j++) {
      const p = cluster.particles[j];
      p.angle += p.speed;
      p.distance = sin(p.angle) * cluster.size * 0.35;
    }
  }
  
  // Coalesce nearby clusters using a spatial hash
  let grid = {};
  const cellSize = COALESCE_RADIUS * 2;
  
  // Clear the grid
  for (let key in grid) delete grid[key];
  
  // Place clusters into grid cells
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    const cellX = Math.floor(cluster.x / cellSize);
    const cellY = Math.floor(cluster.y / cellSize);
    const gridKey = `${cellX},${cellY}`;
    
    if (!grid[gridKey]) grid[gridKey] = [];
    grid[gridKey].push(i);
  }
  
  // Check neighbors
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    const cellX = Math.floor(cluster.x / cellSize);
    const cellY = Math.floor(cluster.y / cellSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const gridKey = `${cellX + dx},${cellY + dy}`;
        if (!grid[gridKey]) continue;
        
        for (let j of grid[gridKey]) {
          if (i >= j) continue; // Avoid duplicate checks
          
          const c2 = clusters[j];
          const dx2 = cluster.x - c2.x;
          const dy2 = cluster.y - c2.y;
          const distance = sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (distance < COALESCE_RADIUS) {
            // Blend properties of nearby clusters
            const blendFactor = map(distance, 0, COALESCE_RADIUS, 1, 0.1);
            
            cluster.hue = lerp(cluster.hue, c2.hue, blendFactor * 0.12);
            cluster.sat = lerp(cluster.sat, c2.sat, blendFactor * 0.12);
            cluster.bri = lerp(cluster.bri, c2.bri, blendFactor * 0.12);
            
            // Move towards each other
            const dx3 = (c2.x - cluster.x) * 0.004;
            const dy3 = (c2.y - cluster.y) * 0.004;
            cluster.driftX += dx3;
            cluster.driftY += dy3;
            c2.driftX -= dx3;
            c2.driftY -= dy3;
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
