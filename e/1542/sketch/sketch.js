let clusters = [];
const MAX_CLUSTERS = 150;
const PARTICLES_PER_CLUSTER = 8;
const DRIFT_SPEED = 0.2;
const COALESCE_RADIUS = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize clusters
  for (let i = 0; i < MAX_CLUSTERS; i++) {
    clusters.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      hue: random(30, 50),
      sat: random(60, 80),
      bri: random(70, 95),
      driftX: random(-DRIFT_SPEED, DRIFT_SPEED),
      driftY: random(-DRIFT_SPEED, DRIFT_SPEED),
      wobble: random(TWO_PI),
      particles: []
    });
  }
  
  // Initialize particles for each cluster
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    for (let j = 0; j < PARTICLES_PER_CLUSTER; j++) {
      cluster.particles.push({
        angle: random(TWO_PI),
        distance: random(0, cluster.size * 0.4),
        speed: random(0.01, 0.05)
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
    const wobbleOffset = sin(cluster.wobble) * 0.5;
    
    // Wrap around screen
    if (cluster.x < -cluster.size) cluster.x = width + cluster.size;
    if (cluster.x > width + cluster.size) cluster.x = -cluster.size;
    if (cluster.y < -cluster.size) cluster.y = height + cluster.size;
    if (cluster.y > height + cluster.size) cluster.y = -cluster.size;
    
    // Draw the cluster
    push();
    translate(cluster.x, cluster.y);
    
    // Apply wobble to rotation
    rotate(wobbleOffset * 0.3);
    
    fill(cluster.hue, cluster.sat, cluster.bri, 0.7);
    noStroke();
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.2) {
      const r = cluster.size * (0.8 + sin(a * 3 + cluster.wobble) * 0.15);
      const x = cos(a) * r;
      const y = sin(a) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add subtle highlight
    fill(cluster.hue + 5, cluster.sat + 10, cluster.bri + 10, 0.4);
    ellipse(cluster.size * 0.3, -cluster.size * 0.2, cluster.size * 0.3);
    pop();
    
    // Update particles in cluster
    for (let j = 0; j < cluster.particles.length; j++) {
      const p = cluster.particles[j];
      p.angle += p.speed;
      p.distance = sin(p.angle) * cluster.size * 0.4;
    }
  }
  
  // Coalesce nearby clusters
  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const c1 = clusters[i];
      const c2 = clusters[j];
      
      const dx = c1.x - c2.x;
      const dy = c1.y - c2.y;
      const distance = sqrt(dx * dx + dy * dy);
      
      if (distance < COALESCE_RADIUS) {
        // Blend properties of nearby clusters
        const blendFactor = map(distance, 0, COALESCE_RADIUS, 1, 0.1);
        
        c1.hue = lerp(c1.hue, c2.hue, blendFactor * 0.1);
        c1.sat = lerp(c1.sat, c2.sat, blendFactor * 0.1);
        c1.bri = lerp(c1.bri, c2.bri, blendFactor * 0.1);
        
        // Move towards each other
        const dx2 = (c2.x - c1.x) * 0.005;
        const dy2 = (c2.y - c1.y) * 0.005;
        c1.driftX += dx2;
        c1.driftY += dy2;
        c2.driftX -= dx2;
        c2.driftY -= dy2;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
