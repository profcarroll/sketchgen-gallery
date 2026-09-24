let blobs = [];
const numBlobs = 15;
const blobRadius = 80;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize blobs with random positions and properties
  for (let i = 0; i < numBlobs; i++) {
    blobs.push({
      pos: createVector(random(-width/3, width/3), random(-height/3, height/3), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.2, 0.8)),
      size: random(blobRadius * 0.7, blobRadius * 1.3),
      color: color(random(360), random(60, 90), random(70, 90), 0.6),
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Center of the canvas for movement
  const center = createVector(0, 0, 0);
  
  // Update and display each blob
  for (let i = 0; i < blobs.length; i++) {
    let b = blobs[i];
    
    // Apply velocity
    b.pos.add(b.vel);
    
    // Slowly move towards center to keep them contained
    let dirToCenter = p5.Vector.sub(center, b.pos).normalize().mult(0.001);
    b.vel.add(dirToCenter);
    
    // Add some noise for organic movement
    b.vel.rotate(random(-0.02, 0.02));
    
    // Keep within bounds with a soft bounce
    if (abs(b.pos.x) > width/2 + blobRadius || abs(b.pos.y) > height/2 + blobRadius || abs(b.pos.z) > 200 + blobRadius) {
      b.vel.mult(-1);
    }
    
    // Add current position to trail
    b.trail.push(b.pos.copy());
    if (b.trail.length > 30) {
      b.trail.shift();
    }
    
    // Draw the trail
    noFill();
    stroke(b.color);
    strokeWeight(2);
    beginShape();
    for (let p of b.trail) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
    
    // Draw the blob itself
    push();
    translate(b.pos.x, b.pos.y, b.pos.z);
    noStroke();
    fill(b.color);
    sphere(b.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
