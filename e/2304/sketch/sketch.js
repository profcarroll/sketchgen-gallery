let layers = [];
let particles = [];
let time = 0;
let earthquakeTime = 0;
let isSeismicEvent = false;
let shockwaves = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create geological layers
  for (let i = 0; i < 12; i++) {
    layers.push({
      y: height * (0.3 + i * 0.05),
      color: color(
        100 + i * 8,
        60 + i * 6,
        30 + i * 3,
        220
      ),
      speed: 0.001 + i * 0.0001,
      thickness: 15 + i * 2
    });
  }
  
  // Create sediment particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(height * 0.1, height * 0.9),
      z: random(-500, 500),
      size: random(1, 3),
      color: color(
        180 + random(75),
        160 + random(50),
        100 + random(70),
        200
      ),
      speed: random(0.5, 3),
      settling: false,
      targetY: 0,
      velocity: {
        x: random(-1, 1),
        y: random(-2, -0.5),
        z: random(-1, 1)
      }
    });
  }
}

function draw() {
  background(100, 150, 200);
  
  time += 0.01;
  
  // Simulate seismic event
  if (frameCount > 60 && !isSeismicEvent) {
    isSeismicEvent = true;
    earthquakeTime = time;
  }
  
  // Camera movement
  let camX = sin(time * 0.1) * 500;
  let camY = height * 0.3;
  let camZ = 1000 + sin(time * 0.05) * 200;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw mountain range base
  noStroke();
  fill(80, 120, 160);
  beginShape();
  vertex(-width/2, height * 0.7, 0);
  for (let i = -width/2; i < width/2; i += 20) {
    let y = height * 0.7 + sin(i * 0.01 + time) * 30;
    vertex(i, y, 0);
  }
  vertex(width/2, height * 0.7, 0);
  endShape(CLOSE);
  
  // Draw geological layers
  for (let layer of layers) {
    fill(layer.color);
    noStroke();
    beginShape();
    vertex(-width/2, layer.y, 0);
    for (let i = -width/2; i < width/2; i += 20) {
      let y = layer.y + sin(i * 0.01 + time * layer.speed) * 5;
      if (isSeismicEvent) {
        // Apply seismic effect
        let shake = sin((i + time * 10) * 0.1) * 20;
        y += shake * (1 - (layer.y / height));
      }
      vertex(i, y, 0);
    }
    vertex(width/2, layer.y, 0);
    endShape(CLOSE);
  }
  
  // Draw particles as points to avoid performance issues
  beginShape(POINTS);
  for (let p of particles) {
    if (!p.settling) {
      // Apply gravity and seismic forces
      if (isSeismicEvent) {
        p.velocity.y += 0.1;
        p.velocity.x += random(-0.2, 0.2);
        p.velocity.z += random(-0.2, 0.2);
      } else {
        p.velocity.y += 0.05;
      }
      
      // Update position
      p.x += p.velocity.x * p.speed;
      p.y += p.velocity.y * p.speed;
      p.z += p.velocity.z * p.speed;
      
      // Check if particle has settled on terrain
      let terrainY = height * 0.7 + sin(p.x * 0.01 + time) * 30;
      if (p.y > terrainY - 20 && p.y < terrainY + 5 && !isSeismicEvent) {
        p.settling = true;
        p.targetY = terrainY - 10;
      }
    } else {
      // Settle into position
      if (p.y > p.targetY) {
        p.y -= 0.5;
      }
    }
    
    // Set vertex color and position
    fill(p.color);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Add seismic shockwaves
  if (isSeismicEvent && frameCount % 10 === 0) {
    shockwaves.push({
      x: 0,
      y: height * 0.7,
      size: 50 + random(100),
      alpha: 100
    });
  }
  
  // Update and draw shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    let wave = shockwaves[i];
    wave.size += 5;
    wave.alpha -= 3;
    
    if (wave.alpha <= 0) {
      shockwaves.splice(i, 1);
    } else {
      noFill();
      stroke(255, 255, 255, wave.alpha);
      strokeWeight(2);
      ellipse(wave.x, wave.y, wave.size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
