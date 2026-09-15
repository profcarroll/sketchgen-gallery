let buildings = [];
let particles = [];
let rippleEffect = null;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate buildings
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let w = random(20, 80);
    let h = random(100, 400);
    let s = random(0.5, 1);
    buildings.push({x, y: -h/2, z, w, h, s});
  }
  
  // Generate particles
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      speed: random(0.5, 3)
    });
  }
}

function draw() {
  background(20, 5, 10);
  
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.2) * 200;
  let cy = cos(time * 0.15) * 100;
  let cz = 500 + sin(time * 0.1) * 200;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, building.y, building.z);
    rotateY(time * 0.02);
    scale(building.s);
    
    // Building structure
    fill(190, 20, 30, 0.8);
    box(building.w, building.h, building.w);
    
    // Windows
    fill(200, 50, 80, 0.7);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (random() > 0.3) {
          let wx = -building.w/2 + i * building.w/10;
          let wz = -building.w/2 + j * building.w/10;
          box(5, 10, 5);
        }
      }
    }
    
    pop();
  }
  
  // Draw particles
  stroke(200, 80, 90, 0.7);
  noFill();
  beginShape();
  for (let p of particles) {
    let px = p.x + sin(time * p.speed) * 50;
    let py = p.y + cos(time * p.speed) * 50;
    vertex(px, py, p.z);
  }
  endShape();
  
  // Draw streaks
  stroke(180, 60, 90, 0.4);
  for (let i = 0; i < 20; i++) {
    let x = sin(time + i * 0.5) * 300;
    let y = cos(time * 0.7 + i * 0.3) * 200;
    line(x, y, -100, x, y, 100);
  }
  
  // Ripple effect
  if (rippleEffect) {
    stroke(240, 90, 100, 0.6);
    noFill();
    ellipse(rippleEffect.x, rippleEffect.y, rippleEffect.size);
    rippleEffect.size += 10;
    if (rippleEffect.size > 500) {
      rippleEffect = null;
    }
  }
}

function mousePressed() {
  rippleEffect = {x: mouseX - width/2, y: mouseY - height/2, size: 10};
}
