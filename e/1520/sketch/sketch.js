let particles = [];
let iceChunks = [];
let waves = [];
let waterLevel;
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  waterLevel = height * 0.7;
  gravity = createVector(0, 0.1, 0);
  
  // Create initial glacier face with fewer particles for performance
  for (let x = -width/2; x < width/2; x += 30) {
    for (let y = -height/3; y < waterLevel; y += 30) {
      if (random() > 0.8) {
        particles.push(createVector(x, y, random(-30, 30)));
      }
    }
  }
  
  // Create initial ice chunks
  for (let i = 0; i < 15; i++) {
    let chunk = {
      pos: createVector(random(-width/4, width/4), -height/3 + random(20, 50), random(-30, 30)),
      vel: createVector(random(-0.3, 0.3), random(0.3, 0.8), random(-0.3, 0.3)),
      size: random(15, 40),
      rotation: random(TWO_PI),
      color: [220, 240, 255]
    };
    iceChunks.push(chunk);
  }
}

function draw() {
  background(10, 30, 80);
  
  // Set up lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -height/2, 0);
  
  // Draw glacier face as a mesh of points for performance
  push();
  translate(0, -height/6, 0);
  rotateX(PI/4);
  noStroke();
  fill(200, 230, 255);
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    vertex(p.x, p.y, p.z);
  }
  endShape();
  pop();
  
  // Update and draw ice chunks
  for (let i = iceChunks.length - 1; i >= 0; i--) {
    let chunk = iceChunks[i];
    
    // Apply gravity
    chunk.vel.add(gravity);
    
    // Update position
    chunk.pos.add(chunk.vel);
    
    // Draw chunk as a sphere
    push();
    translate(chunk.pos.x, chunk.pos.y, chunk.pos.z);
    rotateY(chunk.rotation);
    fill(chunk.color[0], chunk.color[1], chunk.color[2]);
    noStroke();
    sphere(chunk.size/2);
    pop();
    
    // Remove chunks that fall below water level
    if (chunk.pos.y > waterLevel + 100) {
      iceChunks.splice(i, 1);
    }
  }
  
  // Occasionally spawn new chunks
  if (frameCount % 60 === 0 && iceChunks.length < 25) {
    let chunk = {
      pos: createVector(random(-width/4, width/4), -height/3 + random(20, 50), random(-30, 30)),
      vel: createVector(random(-0.3, 0.3), random(0.3, 0.8), random(-0.3, 0.3)),
      size: random(15, 40),
      rotation: random(TWO_PI),
      color: [220, 240, 255]
    };
    iceChunks.push(chunk);
  }
  
  // Draw water
  push();
  translate(0, waterLevel, 0);
  rotateX(PI/2);
  noStroke();
  fill(10, 30, 80);
  plane(width, height * 0.3);
  pop();
  
  // Draw waves as a batch of points
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    push();
    translate(wave.pos.x, wave.pos.y, wave.pos.z);
    rotateY(wave.rotation);
    fill(200, 230, 255, 100);
    noStroke();
    sphere(wave.size/2);
    pop();
    
    // Update wave
    wave.pos.add(wave.vel);
    wave.size *= 0.98;
    
    if (wave.size < 1) {
      waves.splice(i, 1);
    }
  }
  
  // Occasionally create spray
  if (frameCount % 20 === 0 && random() > 0.7) {
    let wave = {
      pos: createVector(random(-width/2, width/2), waterLevel, random(-30, 30)),
      vel: createVector(random(-0.5, 0.5), random(0, 0.3), random(-0.5, 0.5)),
      size: random(1, 4),
      rotation: random(TWO_PI)
    };
    waves.push(wave);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
