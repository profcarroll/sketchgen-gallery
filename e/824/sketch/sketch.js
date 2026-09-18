let grid;
let particles = [];
let numParticles = 1000;
let minRadius = 200;
let maxRadius = 400;
let angleStep = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a grid for spatial hashing
  grid = new Array(20).fill().map(() => new Array(20).fill([]));
  
  // Generate particles on a curved surface
  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let radius = random(minRadius, maxRadius);
    let height = random(-100, 100);
    
    let x = cos(angle) * radius;
    let y = height;
    let z = sin(angle) * radius;
    
    particles.push({x, y, z});
  }
  
  // Assign particles to grid cells
  for (let p of particles) {
    let cellX = floor((p.x + maxRadius) / (maxRadius * 2) * 20);
    let cellY = floor((p.y + maxRadius) / (maxRadius * 2) * 20);
    if (cellX >= 0 && cellX < 20 && cellY >= 0 && cellY < 20) {
      grid[cellX][cellY].push(p);
    }
  }
}

function draw() {
  background(0);
  
  // Camera setup
  let time = millis() * 0.0001;
  let camX = sin(time) * 500;
  let camZ = cos(time) * 500;
  camera(camX, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  // Ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, -300, 0);
  
  // Draw the steel structure
  strokeWeight(1);
  
  // Draw vertical mineral runoff channels
  for (let p of particles) {
    let h = map(p.y, -maxRadius, maxRadius, 0, 360);
    stroke(h, 70, 25, 1);
    
    let size = map(p.z, -maxRadius, maxRadius, 2, 8);
    point(p.x, p.y, p.z);
  }
  
  // Draw the curved path
  noFill();
  stroke(30, 30, 20, 0.5);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < TWO_PI; i += 0.1) {
    let x = cos(i) * maxRadius;
    let z = sin(i) * maxRadius;
    vertex(x, 0, z);
  }
  endShape(CLOSE);
  
  // Draw the curved structure
  stroke(30, 30, 20, 0.8);
  for (let i = 0; i < TWO_PI; i += 0.1) {
    let x = cos(i) * maxRadius;
    let z = sin(i) * maxRadius;
    let y = map(i, 0, TWO_PI, -50, 50);
    
    beginShape();
    for (let j = 0; j < TWO_PI; j += 0.1) {
      let x2 = cos(j) * 100;
      let z2 = sin(j) * 100;
      vertex(x + x2, y, z + z2);
    }
    endShape(CLOSE);
  }
}
