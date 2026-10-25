let blobs = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial fluid blobs
  for (let i = 0; i < 8; i++) {
    blobs.push({
      pos: createVector(random(-width/4, width/4), random(-height/4, height/4), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.02, 0.08)),
      size: random(60, 120),
      color: color(random(20, 60), random(70, 90), random(60, 90), 0.7),
      age: 0,
      maxAge: random(300, 600)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.1);
  
  // Animate time
  time += 0.002;
  
  // Draw the transparent vessel
  push();
  noStroke();
  fill(240, 10, 10, 0.03);
  sphere(width * 0.45);
  pop();
  
  // Update and draw blobs
  for (let i = blobs.length - 1; i >= 0; i--) {
    let blob = blobs[i];
    
    // Move blob
    blob.pos.add(blob.vel);
    
    // Apply noise-based movement
    blob.vel.x += noise(blob.pos.x * 0.003, blob.pos.y * 0.003, time) * 0.02 - 0.01;
    blob.vel.y += noise(blob.pos.y * 0.003, blob.pos.z * 0.003, time + 100) * 0.02 - 0.01;
    blob.vel.z += noise(blob.pos.x * 0.003, blob.pos.z * 0.003, time + 200) * 0.02 - 0.01;
    
    // Keep within bounds with gentle bounce
    if (blob.pos.x > width/4) {
      blob.pos.x = width/4;
      blob.vel.x *= -0.3;
    } else if (blob.pos.x < -width/4) {
      blob.pos.x = -width/4;
      blob.vel.x *= -0.3;
    }
    
    if (blob.pos.y > height/4) {
      blob.pos.y = height/4;
      blob.vel.y *= -0.3;
    } else if (blob.pos.y < -height/4) {
      blob.pos.y = -height/4;
      blob.vel.y *= -0.3;
    }
    
    // Age the blob
    blob.age++;
    
    // Replace old blobs
    if (blob.age > blob.maxAge) {
      blobs.splice(i, 1);
      blobs.push({
        pos: createVector(random(-width/4, width/4), random(-height/4, height/4), random(-100, 100)),
        vel: p5.Vector.random3D().mult(random(0.02, 0.08)),
        size: random(60, 120),
        color: color(random(20, 60), random(70, 90), random(60, 90), 0.7),
        age: 0,
        maxAge: random(300, 600)
      });
    }
    
    // Draw blob with gradient effect using multiple spheres
    push();
    translate(blob.pos.x, blob.pos.y, blob.pos.z);
    noStroke();
    
    let steps = 4;
    for (let j = 0; j < steps; j++) {
      let s = map(j, 0, steps-1, blob.size * 0.9, blob.size * 0.2);
      let c = lerpColor(blob.color, color(hue(blob.color), saturation(blob.color), brightness(blob.color), 0), j / (steps - 1));
      fill(c);
      sphere(s, 6, 4); // Low detail for performance
    }
    
    // Add subtle striations using lines
    stroke(255, 0.08);
    noFill();
    for (let j = 0; j < 5; j++) {
      let angle = map(j, 0, 5, 0, TWO_PI);
      beginShape();
      for (let k = 0; k <= 16; k++) {
        let a = map(k, 0, 16, 0, TWO_PI);
        let x = cos(a + time * 0.4) * blob.size * 0.35;
        let y = sin(a + time * 0.4) * blob.size * 0.35;
        let z = sin(angle + time * 0.2) * blob.size * 0.15;
        vertex(x, y, z);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Draw subtle flow lines
  stroke(220, 10, 80, 0.03);
  noFill();
  for (let i = 0; i < 20; i++) {
    let a = map(i, 0, 20, 0, TWO_PI);
    beginShape();
    for (let j = 0; j <= 16; j++) {
      let b = map(j, 0, 16, 0, TWO_PI * 2);
      let x = cos(a + time) * width * 0.25;
      let y = sin(b + time * 0.6) * height * 0.25;
      let z = sin(a + time * 0.3) * 40;
      vertex(x, y, z);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
