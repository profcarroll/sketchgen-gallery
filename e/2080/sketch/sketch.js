let clusters = [];
const MAX_CLUSTERS = 80;
const PARTICLES_PER_CLUSTER = 4;
const COALESCE_RADIUS = 60;
const DRAG_RADIUS = 150;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize clusters
  for (let i = 0; i < MAX_CLUSTERS; i++) {
    clusters.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(40, 100),
      hue: random(30, 50),
      sat: random(60, 80),
      bri: random(70, 90),
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
    for (let k = 0; k < 5; k++) {
      cluster.structure.push({
        angle: random(TWO_PI),
        radius: random(cluster.size * 0.25, cluster.size * 0.7),
        thickness: random(1.5, 3),
        segments: 60
      });
    }
  }
}

function draw() {
  background(20, 10, 10);
  
  // Camera setup
  orbitControl();
  
  // Update and display clusters
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    
    push();
    translate(cluster.x, cluster.y, cluster.z);
    
    fill(cluster.hue, cluster.sat, cluster.bri, 0.7);
    noStroke();
    
    // Draw the main shape with sharp curves and clear edges
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      const r = cluster.size * (0.9 + sin(a * 3) * 0.15);
      const x = cos(a) * r;
      const y = sin(a) * r;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Draw structural elements with defined edges and separation
    for (let k = 0; k < cluster.structure.length; k++) {
      const s = cluster.structure[k];
      const angle = s.angle;
      const radius = s.radius;
      
      stroke(cluster.hue, cluster.sat + 15, cluster.bri + 15, 0.9);
      strokeWeight(s.thickness);
      noFill();
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / s.segments) {
        const r = radius * (0.92 + sin(a * 4 + angle) * 0.1);
        const x = cos(a) * r;
        const y = sin(a) * r;
        vertex(x, y, 0);
      }
      endShape(CLOSE);
    }
    
    // Add subtle highlight
    fill(cluster.hue + 5, cluster.sat + 20, cluster.bri + 20, 0.4);
    ellipse(cluster.size * 0.3, -cluster.size * 0.3, cluster.size * 0.2);
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
            
            cluster.hue = lerp(cluster.hue, c2.hue, blendFactor * 0.1);
            cluster.sat = lerp(cluster.sat, c2.sat, blendFactor * 0.1);
            cluster.bri = lerp(cluster.bri, c2.bri, blendFactor * 0.1);
          }
        }
      }
    }
  }
  
  // Prevent motion by not updating positions
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
