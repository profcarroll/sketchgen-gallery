let particles = [];
let trails = [];
let time = 0;
let noiseScale = 0.01;
let noiseStrength = 3;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      pos: createVector(
        random(-width, width),
        random(-height, height),
        random(-300, 300)
      ),
      vel: p5.Vector.random3D().mult(random(0.1, 0.3)),
      size: random(0.5, 2),
      hue: random(180, 240),
      sat: random(20, 40),
      bri: random(30, 60)
    });
  }
}

function draw() {
  background(220, 15, 10);
  
  // Camera movement
  let camX = sin(time * 0.0003) * 150;
  let camY = cos(time * 0.0002) * 80;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Ambient light
  ambientLight(15);
  
  // Dynamic lighting
  let lightX = sin(time * 0.0008) * 400;
  let lightY = cos(time * 0.0006) * 400;
  pointLight(255, 255, 255, lightX, lightY, 300);
  
  // Draw particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Noise-based movement
    let nX = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, time * 0.001) * noiseStrength;
    let nY = noise(p.pos.x * noiseScale + 1000, p.pos.y * noiseScale + 1000, time * 0.001) * noiseStrength;
    let nZ = noise(p.pos.x * noiseScale + 2000, p.pos.y * noiseScale + 2000, time * 0.001) * noiseStrength;
    
    // Update position
    p.vel.add(createVector(nX, nY, nZ));
    p.vel.mult(0.98); // Damping
    p.pos.add(p.vel);
    
    // Wrap around edges
    if (p.pos.x > width / 2 + 500) p.pos.x = -width / 2 - 500;
    if (p.pos.x < -width / 2 - 500) p.pos.x = width / 2 + 500;
    if (p.pos.y > height / 2 + 500) p.pos.y = -height / 2 - 500;
    if (p.pos.y < -height / 2 - 500) p.pos.y = height / 2 + 500;
    
    // Color based on position and time
    let h = (p.hue + time * 0.005) % 360;
    let s = p.sat;
    let b = p.bri;
    
    fill(h, s, b, 0.7);
    noStroke();
    
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();
  
  // Draw trails
  if (trails.length > 0) {
    stroke(180, 50, 90, 0.6);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < trails.length; i++) {
      let t = trails[i];
      vertex(t.x, t.y, t.z);
    }
    endShape();
  }
  
  time++;
}

function mousePressed() {
  // Reset trails when clicked
  trails = [];
}

function mouseDragged() {
  // Add current mouse position to trail
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;
  let z = random(-100, 100);
  
  trails.push({x, y, z});
  
  // Limit trail length
  if (trails.length > 100) {
    trails.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
