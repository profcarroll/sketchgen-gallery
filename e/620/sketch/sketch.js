let particles = [];
let connections = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 500;
const CONNECTION_COUNT = 1000;
const TRAIL_LENGTH = 50;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-100, 100)
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      trail: [],
      hue: random(60, 100)
    });
  }

  // Initialize connections
  for (let i = 0; i < CONNECTION_COUNT; i++) {
    let a = floor(random(PARTICLE_COUNT));
    let b = floor(random(PARTICLE_COUNT));
    while (b === a) b = floor(random(PARTICLE_COUNT));
    connections.push({
      a: a,
      b: b,
      progress: random(1),
      intensity: random(0.5, 1)
    });
  }

  // Initialize grid for spatial hashing
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    grid.push([]);
  }
}

function draw() {
  background(0, 0, 0, 20);
  time += 0.01;

  // Update and display particles
  let allPoints = [];
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Bounce off edges
    if (abs(p.pos.x) > width/2) p.vel.x *= -1;
    if (abs(p.pos.y) > height/2) p.vel.y *= -1;
    if (abs(p.pos.z) > 100) p.vel.z *= -1;
    
    // Add to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > TRAIL_LENGTH) {
      p.trail.shift();
    }
    
    allPoints.push(p.pos);
  }

  // Draw trails
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    for (let j = 0; j < p.trail.length; j++) {
      let pos = p.trail[j];
      let alpha = map(j, 0, p.trail.length, 0, 100);
      fill(p.hue, 80, 100, alpha);
      noStroke();
      vertex(pos.x, pos.y, pos.z);
    }
  }
  endShape();

  // Draw connections
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let pa = particles[c.a].pos;
    let pb = particles[c.b].pos;
    
    // Update progress
    c.progress += 0.01 * c.intensity;
    if (c.progress > 1) c.progress = 0;
    
    // Calculate position along the line
    let t = sin(c.progress * PI);
    let pos = p5.Vector.lerp(pa, pb, t);
    
    // Color based on progress and intensity
    let hue = (c.a + c.b + time * 10) % 100;
    fill(hue, 80, 100, 100 * c.intensity);
    noStroke();
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();

  // Dynamic lighting effect
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(255, 255, 255, 0, height/2, 0);
  
  // Rotate view slowly
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
}
