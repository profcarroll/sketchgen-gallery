// A misty forest floor where geometric origami elements rise continuously,
// navigating complex patterns as they ascend toward the top of the screen.
// Elements drift and swirl, transitioning from earthy to celestial colors.
const PARTICLE_COUNT = 500;
const GRAVITY = 0.01;
const WIND_STRENGTH = 0.005;
const MAX_LIFETIME = 400;
const MIN_SIZE = 1;
const MAX_SIZE = 3;

let particles = [];
let noiseScale = 0.005;
let noiseStrength = 0.02;
let bgColor;
let shapeGeometry;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  bgColor = color(200, 10, 15, 1);
  
  // Precompute shape geometry to avoid repeated mesh creation
  shapeGeometry = {
    cube: [],
    sphere: [],
    tetrahedron: []
  };
  
  // Build cube geometry (points for wireframe)
  for (let i = 0; i < 8; i++) {
    shapeGeometry.cube.push(createVector(
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1
    ));
  }
  
  // Build sphere geometry (points for wireframe)
  const sphereDetail = 8;
  for (let i = 0; i < sphereDetail; i++) {
    const lat = map(i, 0, sphereDetail-1, -HALF_PI, HALF_PI);
    for (let j = 0; j < sphereDetail; j++) {
      const lon = map(j, 0, sphereDetail-1, 0, TWO_PI);
      const x = cos(lat) * cos(lon);
      const y = sin(lat);
      const z = cos(lat) * sin(lon);
      shapeGeometry.sphere.push(createVector(x, y, z));
    }
  }
  
  // Build tetrahedron geometry (points for wireframe)
  const tetraPoints = [
    createVector(1, 1, 1),
    createVector(-1, -1, 1),
    createVector(-1, 1, -1),
    createVector(1, -1, -1)
  ];
  shapeGeometry.tetrahedron = tetraPoints;
  
  // Initialize particles with random properties
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(random(width), random(height), random(-200, 100)),
      vel: createVector(0, 0, 0),
      acc: createVector(0, 0, 0),
      size: random(MIN_SIZE, MAX_SIZE),
      lifetime: random(MAX_LIFETIME * 0.5, MAX_LIFETIME),
      maxLifetime: MAX_LIFETIME,
      hue: random(30, 120), // earthy to cool tones
      saturation: random(40, 80),
      brightness: random(60, 90),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      shapeType: floor(random(3)) // 0 = cube, 1 = sphere, 2 = tetrahedron
    });
  }
}

function draw() {
  background(bgColor);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply noise-based movement
    let nx = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, frameCount * noiseStrength);
    let ny = noise(p.pos.y * noiseScale, p.pos.z * noiseScale, frameCount * noiseStrength);
    let nz = noise(p.pos.z * noiseScale, p.pos.x * noiseScale, frameCount * noiseStrength);
    
    p.acc.x += (nx - 0.5) * WIND_STRENGTH;
    p.acc.y += (ny - 0.5) * WIND_STRENGTH;
    p.acc.z += (nz - 0.5) * WIND_STRENGTH;
    
    // Apply gravity
    p.acc.y -= GRAVITY;
    
    // Update velocity and position
    p.vel.add(p.acc);
    p.pos.add(p.vel);
    
    // Reset acceleration
    p.acc.mult(0);
    
    // Age the particle
    p.lifetime--;
    
    // Reset particle if it dies or goes off screen
    if (p.lifetime <= 0 || p.pos.y > height + 100) {
      p.pos.set(random(width), height + random(50, 200), random(-200, 100));
      p.vel.mult(0);
      p.lifetime = p.maxLifetime;
      p.hue = random(30, 120); // Reset color
    }
    
    // Color transition from earthy to celestial as particle rises
    let t = map(p.pos.y, height, -200, 0, 1);
    t = constrain(t, 0, 1);
    let newHue = lerp(30, 240, t); // Earthy to cool blue
    let newSat = lerp(40, 90, t);
    let newBright = lerp(60, 95, t);
    
    push();
    translate(p.pos.x - width/2, p.pos.y - height/2, p.pos.z);
    rotateX(p.rotation);
    rotateY(p.rotation * 0.5);
    rotateZ(p.rotation * 0.3);
    
    // Particle color
    fill(newHue, newSat, newBright, 0.8);
    noStroke();
    
    // Draw different shapes based on type using precomputed geometry
    switch (p.shapeType) {
      case 0: // Cube - draw as wireframe points
        push();
        scale(p.size * 2);
        beginShape(POINTS);
        for (let v of shapeGeometry.cube) {
          vertex(v.x, v.y, v.z);
        }
        endShape();
        pop();
        break;
      case 1: // Sphere - draw as wireframe points
        push();
        scale(p.size);
        beginShape(POINTS);
        for (let v of shapeGeometry.sphere) {
          vertex(v.x, v.y, v.z);
        }
        endShape();
        pop();
        break;
      case 2: // Tetrahedron - draw as wireframe points
        push();
        scale(p.size);
        beginShape(POINTS);
        for (let v of shapeGeometry.tetrahedron) {
          vertex(v.x, v.y, v.z);
        }
        endShape();
        pop();
        break;
    }
    
    pop();
    
    // Update rotation
    p.rotation += p.rotationSpeed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
