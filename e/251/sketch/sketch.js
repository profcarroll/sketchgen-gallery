let particles = [];
let shards = [];
let distortionTime = 0;
let tunnelSpeed = 0.5;
const PARTICLE_COUNT = 1000;
const SHARD_COUNT = 50;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles in a tunnel-like structure
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = random(TWO_PI);
    const radius = random(50, 300);
    const z = random(-2000, 0);
    particles.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius,
      z: z,
      originalZ: z,
      speed: random(0.5, 2),
      size: random(1, 3),
      color: color(random(200, 300), 80, 90, 0.7)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement
  const time = millis() * 0.001;
  const camX = sin(time * 0.2) * 50;
  const camY = cos(time * 0.3) * 50;
  camera(camX, camY, (height / 2.0) / tan(PI * 30.0 / 180.0), 
         camX, camY, 0, 0, 1, 0);
  
  // Tunnel acceleration
  tunnelSpeed += 0.001;
  distortionTime += 0.05;
  
  // Draw particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Move along tunnel
    p.z += tunnelSpeed * p.speed;
    
    // Reset particle if it passes the viewer
    if (p.z > 100) {
      p.z = -2000;
      p.originalZ = -2000;
    }
    
    // Apply distortion effect periodically
    const dist = noise(p.x * 0.01, p.y * 0.01, p.z * 0.01) * 50;
    const distortion = sin(distortionTime + p.z * 0.01) * 20;
    
    // Draw particle
    fill(p.color);
    noStroke();
    vertex(p.x + distortion, p.y + distortion, p.z);
  }
  endShape();
  
  // Occasionally create distortions and shards
  if (frameCount % 100 === 0) {
    createDistortion();
  }
  
  // Update and draw shards
  for (let i = shards.length - 1; i >= 0; i--) {
    const s = shards[i];
    s.x += s.vx;
    s.y += s.vy;
    s.z += s.vz;
    s.life -= 2;
    
    if (s.life <= 0) {
      shards.splice(i, 1);
    } else {
      fill(s.color);
      noStroke();
      sphere(s.size);
    }
  }
}

function createDistortion() {
  const numShards = random(5, 15);
  
  for (let i = 0; i < numShards; i++) {
    shards.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-500, -100),
      vx: random(-3, 3),
      vy: random(-3, 3),
      vz: random(-3, 3),
      size: random(2, 8),
      life: random(100, 200),
      color: color(random(200, 300), 100, 100, 0.8)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
