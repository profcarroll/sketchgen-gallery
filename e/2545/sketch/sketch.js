let rootNetwork;
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create the mangrove root network structure
  rootNetwork = [];
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-50, 50);
    let size = random(10, 40);
    rootNetwork.push({x, y, z, size});
  }
  
  // Create flowing particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(0.5, 2),
      speed: random(0.01, 0.05),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 15, 25);
  
  // Create ambient lighting
  ambientLight(30);
  pointLight(100, 150, 200, 0, 0, 100);
  
  time += 0.01;
  
  // Draw root network structure
  push();
  translate(0, 0, -50);
  noFill();
  stroke(180, 150, 120);
  strokeWeight(1.5);
  
  beginShape();
  for (let i = 0; i < rootNetwork.length; i++) {
    let root = rootNetwork[i];
    let angle = time * 0.3 + i * 0.1;
    let pulse = sin(time + i * 0.2) * 0.5 + 1;
    
    let x = root.x + cos(angle) * root.size * pulse;
    let y = root.y + sin(angle) * root.size * pulse;
    let z = root.z;
    
    vertex(x, y, z);
  }
  endShape(CLOSE);
  
  // Draw connections between roots
  stroke(150, 120, 90, 80);
  strokeWeight(0.5);
  for (let i = 0; i < rootNetwork.length; i++) {
    let a = rootNetwork[i];
    let b = rootNetwork[(i + 1) % rootNetwork.length];
    
    line(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  
  pop();
  
  // Draw glowing particles
  blendMode(ADD);
  
  for (let p of particles) {
    p.phase += p.speed;
    
    let x = p.x + sin(p.phase) * 3;
    let y = p.y + cos(p.phase) * 3;
    let z = p.z + sin(time * 0.5 + p.phase) * 2;
    
    push();
    translate(x, y, z);
    
    noStroke();
    fill(255, 200, 100, 180);
    sphere(p.size, 4, 3);
    
    pop();
  }
  
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
