let blobs = [];
const numBlobs = 6;
const blobRadius = 120;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize blobs with random positions and properties
  for (let i = 0; i < numBlobs; i++) {
    blobs.push({
      pos: createVector(random(-width/4, width/4), random(-height/4, height/4), random(-150, 150)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(blobRadius * 0.8, blobRadius * 1.2),
      color: color(random(360), random(70, 90), random(70, 90), 0.7),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.015, 0.03),
      trail: [],
      fractureProgress: 0,
      fractureSpeed: random(0.002, 0.005),
      crystalStructures: [],
      detachedCrystals: []
    });
  }
  
  // Generate initial crystal structures for each blob
  for (let i = 0; i < blobs.length; i++) {
    let b = blobs[i];
    b.crystalStructures = [];
    const numCrystals = floor(random(3, 6));
    for (let j = 0; j < numCrystals; j++) {
      const angle1 = random(TWO_PI);
      const angle2 = random(TWO_PI);
      const radius = random(0.3, 0.7) * b.size;
      const x = radius * sin(angle1) * cos(angle2);
      const y = radius * cos(angle1) * cos(angle2);
      const z = radius * sin(angle2);
      
      b.crystalStructures.push({
        pos: createVector(x, y, z),
        size: random(5, 20),
        rotation: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
        growth: 0,
        maxGrowth: random(0.8, 1.2)
      });
    }
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
    let dirToCenter = p5.Vector.sub(center, b.pos).normalize().mult(0.0008);
    b.vel.add(dirToCenter);
    
    // Add some noise for organic movement
    b.vel.rotate(random(-0.01, 0.01));
    
    // Keep within bounds with a soft bounce
    if (abs(b.pos.x) > width/2 + blobRadius || abs(b.pos.y) > height/2 + blobRadius || abs(b.pos.z) > 300 + blobRadius) {
      b.vel.mult(-0.9);
    }
    
    // Pulsation effect
    b.pulse += b.pulseSpeed;
    let pulseFactor = sin(b.pulse) * 0.15 + 1;
    let scaledSize = b.size * pulseFactor;
    
    // Add current position to trail
    b.trail.push(b.pos.copy());
    if (b.trail.length > 25) {
      b.trail.shift();
    }
    
    // Draw the trail
    noFill();
    stroke(b.color);
    strokeWeight(1.5);
    beginShape();
    for (let p of b.trail) {
      vertex(p.x, p.y, p.z);
    }
    endShape();
    
    // Draw the blob itself with gradient effect and fractures
    push();
    translate(b.pos.x, b.pos.y, b.pos.z);
    noStroke();
    
    // Create a gradient by drawing multiple spheres with slightly different colors and sizes
    for (let j = 0; j < 4; j++) {
      let gradientColor = color(
        (hue(b.color) + j * 8) % 360,
        saturation(b.color),
        brightness(b.color) - j * 7,
        0.45
      );
      fill(gradientColor);
      sphere(scaledSize * (1 - j * 0.15));
    }
    
    // Update fracture progress
    b.fractureProgress += b.fractureSpeed;
    
    // Draw growing crystal structures
    stroke(255, 80);
    strokeWeight(1);
    noFill();
    
    for (let crystal of b.crystalStructures) {
      crystal.growth = min(crystal.growth + 0.02, crystal.maxGrowth);
      
      push();
      translate(crystal.pos.x, crystal.pos.y, crystal.pos.z);
      rotateX(crystal.rotation.x);
      rotateY(crystal.rotation.y);
      rotateZ(crystal.rotation.z);
      
      // Draw a simple geometric crystal structure (dodecahedron-like)
      beginShape(QUADS);
      // Front face
      vertex(-crystal.size * 0.5, -crystal.size * 0.5, crystal.size * 0.5);
      vertex(crystal.size * 0.5, -crystal.size * 0.5, crystal.size * 0.5);
      vertex(crystal.size * 0.5, crystal.size * 0.5, crystal.size * 0.5);
      vertex(-crystal.size * 0.5, crystal.size * 0.5, crystal.size * 0.5);
      
      // Back face
      vertex(-crystal.size * 0.5, -crystal.size * 0.5, -crystal.size * 0.5);
      vertex(crystal.size * 0.5, -crystal.size * 0.5, -crystal.size * 0.5);
      vertex(crystal.size * 0.5, crystal.size * 0.5, -crystal.size * 0.5);
      vertex(-crystal.size * 0.5, crystal.size * 0.5, -crystal.size * 0.5);
      
      // Side faces
      vertex(-crystal.size * 0.5, -crystal.size * 0.5, -crystal.size * 0.5);
      vertex(-crystal.size * 0.5, -crystal.size * 0.5, crystal.size * 0.5);
      vertex(-crystal.size * 0.5, crystal.size * 0.5, crystal.size * 0.5);
      vertex(-crystal.size * 0.5, crystal.size * 0.5, -crystal.size * 0.5);
      
      endShape();
      
      pop();
    }
    
    // Detach crystals when fracture progress reaches a threshold
    if (b.fractureProgress > 0.7 && b.detachedCrystals.length < 8) {
      let newCrystal = {
        pos: b.pos.copy(),
        vel: p5.Vector.random3D().mult(random(0.2, 0.5)),
        size: random(10, 30),
        color: color(random(360), 100, 100, 0.8),
        life: 1,
        trail: []
      };
      
      b.detachedCrystals.push(newCrystal);
    }
    
    // Update and draw detached crystals
    for (let j = b.detachedCrystals.length - 1; j >= 0; j--) {
      let crystal = b.detachedCrystals[j];
      
      // Apply velocity
      crystal.pos.add(crystal.vel);
      
      // Slow down over time
      crystal.vel.mult(0.98);
      
      // Fade out
      crystal.life -= 0.005;
      
      if (crystal.life <= 0) {
        b.detachedCrystals.splice(j, 1);
        continue;
      }
      
      // Add to trail
      crystal.trail.push(crystal.pos.copy());
      if (crystal.trail.length > 20) {
        crystal.trail.shift();
      }
      
      push();
      translate(crystal.pos.x, crystal.pos.y, crystal.pos.z);
      
      // Draw trail
      noFill();
      stroke(crystal.color);
      strokeWeight(1);
      beginShape();
      for (let p of crystal.trail) {
        vertex(p.x, p.y, p.z);
      }
      endShape();
      
      // Draw crystal
      fill(crystal.color);
      noStroke();
      sphere(crystal.size * crystal.life);
      
      pop();
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
