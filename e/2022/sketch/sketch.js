let photo;
let particles = [];
const particleCount = 1000;
let time = 0;

function preload() {
  photo = loadImage('https://picsum.photos/seed/mountain/800/600');
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Initialize particles with positions based on photo
  for (let i = 0; i < particleCount; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-200, 200);
    particles.push({x, y, z});
  }
  
  noLoop();
}

function draw() {
  background(0);
  
  // Camera movement for dynamic view
  time += 0.005;
  const camX = sin(time * 0.3) * 100;
  const camY = cos(time * 0.2) * 50;
  camera(0, 0, 400 + sin(time * 0.4) * 100, 0, 0, 0, 0, 1, 0);
  
  // Draw particles as a semi-liquid mass
  noStroke();
  fill(255, 150);
  
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Animate each particle based on time and position
    const offset = sin(time * 0.5 + p.x * 0.01) * 30;
    const yOff = cos(time * 0.6 + p.y * 0.01) * 25;
    const zOff = sin(time * 0.4 + p.z * 0.01) * 20;
    
    vertex(p.x, p.y + offset + yOff, p.z + zOff);
  }
  endShape();
  
  // Overlay the photo for reference
  push();
  translate(-width/2 + 50, -height/2 + 50);
  tint(255, 120);
  image(photo, 0, 0, 150, 112);
  pop();
}

function mousePressed() {
  loop();
}
