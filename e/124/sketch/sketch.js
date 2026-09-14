let time = 0;
let buildings = [];
let plankton = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create cityscape
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(30, 80),
      h: random(100, 300),
      d: random(30, 80),
      color: color(random(50, 150), random(50, 150), random(100, 200))
    });
  }
  
  // Create plankton
  for (let i = 0; i < 200; i++) {
    plankton.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-height/2, height/2),
      size: random(2, 8),
      speed: random(0.01, 0.05)
    });
  }
}

function draw() {
  background(0);
  time += 0.002;
  
  // Create atmospheric glow
  let skyColor = lerpColor(
    color(255, 100, 0),
    color(10, 10, 40),
    (sin(time * 0.5) + 1) / 2
  );
  
  // Set lighting based on time
  ambientLight(skyColor);
  
  // Add directional light
  let sunAngle = time * 0.3;
  pointLight(
    color(255, 200, 100),
    cos(sunAngle) * 500,
    sin(sunAngle) * 500,
    0
  );
  
  // Draw cityscape
  for (let building of buildings) {
    push();
    translate(building.x, building.y - building.h/2, building.z);
    
    // Create reflective surface effect
    let reflectColor = lerpColor(
      color(255),
      building.color,
      0.3 + 0.2 * sin(time * 2)
    );
    
    fill(reflectColor);
    
    // Draw building with wet surface effect
    box(building.w, building.h, building.d);
    
    // Add bioluminescent details
    fill(50, 255, 100, 100);
    for (let i = 0; i < 3; i++) {
      let detailX = random(-building.w/2, building.w/2);
      let detailY = random(-building.h/2, building.h/2);
      let detailSize = random(5, 15);
      
      push();
      translate(detailX, detailY, building.d/2 + 1);
      sphere(detailSize);
      pop();
    }
    
    pop();
  }
  
  // Draw plankton
  for (let p of plankton) {
    let wave = sin(time * p.speed + p.x * 0.01) * 5;
    let offset = sin(time * 0.3 + p.z * 0.01) * 20;
    
    push();
    translate(p.x, p.y + wave, p.z);
    
    // Create pulsing effect
    let pulse = sin(time * 3 + p.x * 0.02) * 0.5 + 1;
    scale(pulse);
    
    fill(255, 255, 200, 150);
    sphere(p.size);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
