let gears = [];
let time = 0;
let thermalPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create gears and rings
  const numGears = 12;
  for (let i = 0; i < numGears; i++) {
    const angle = (TWO_PI / numGears) * i;
    const radius = 150 + sin(time * 0.3 + i) * 30;
    const gearRadius = 20 + sin(time * 0.5 + i) * 5;
    
    gears.push({
      angle: angle,
      radius: radius,
      gearRadius: gearRadius,
      speed: random(0.001, 0.005),
      hueShift: random(360)
    });
  }
  
  // Create thermal particles as point cloud
  thermalPoints = new Array(200);
  for (let i = 0; i < thermalPoints.length; i++) {
    thermalPoints[i] = {
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      speed: random(0.001, 0.003),
      phase: random(TWO_PI),
      size: random(2, 6)
    };
  }
}

function draw() {
  background(20, 15, 10);
  
  time += 0.01;
  
  // Rotate the entire scene slowly
  rotateY(time * 0.05);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw gears and rings
  for (let gear of gears) {
    const currentAngle = time * gear.speed + gear.angle;
    const x = cos(currentAngle) * gear.radius;
    const y = sin(currentAngle) * gear.radius;
    
    push();
    translate(x, y);
    
    // Create thermal glow effect
    const pulse = sin(time * 3 + gear.hueShift) * 0.5 + 0.5;
    const hue = (time * 12 + gear.hueShift) % 360;
    const sat = 80 + sin(time + gear.hueShift) * 20;
    const bright = 60 + pulse * 40;
    
    // Draw gear teeth as point cloud
    fill(hue, sat, bright);
    beginShape(POINTS);
    for (let i = 0; i < 12; i++) {
      const toothAngle = (TWO_PI / 12) * i + currentAngle;
      const toothX = cos(toothAngle) * gear.gearRadius;
      const toothY = sin(toothAngle) * gear.gearRadius;
      
      vertex(toothX, toothY, 0);
    }
    endShape();
    
    // Draw central gear as point cloud
    fill(hue + 30, sat, bright + 20);
    beginShape(POINTS);
    for (let i = 0; i < 30; i++) {
      const angle = (TWO_PI / 30) * i;
      const x = cos(angle) * gear.gearRadius * 0.8;
      const y = sin(angle) * gear.gearRadius * 0.8;
      vertex(x, y, 0);
    }
    endShape();
    
    pop();
  }
  
  // Draw thermal energy streams as point cloud
  beginShape(POINTS);
  for (let i = 0; i < thermalPoints.length; i++) {
    const p = thermalPoints[i];
    
    // Move particle along orbit
    const orbitRadius = 150 + sin(time * 0.3) * 30;
    const angle = time * p.speed + p.phase;
    const x = cos(angle) * orbitRadius;
    const y = sin(angle) * orbitRadius;
    
    // Create pulsating glow
    const pulse = sin(time * 5 + p.phase) * 0.5 + 0.5;
    const hue = (time * 10 + p.phase * 3) % 360;
    const sat = 90 + sin(time + p.phase) * 10;
    const bright = 70 + pulse * 30;
    
    fill(hue, sat, bright);
    vertex(x, y, p.z);
  }
  endShape();
  
  // Draw celestial orbits
  for (let i = 0; i < 8; i++) {
    const orbitRadius = 200 + i * 30;
    const orbitSpeed = 0.002 + i * 0.0005;
    
    stroke(180, 60, 40, 100);
    noFill();
    beginShape();
    for (let j = 0; j < 100; j++) {
      const angle = (TWO_PI / 100) * j;
      const x = cos(angle) * orbitRadius;
      const y = sin(angle) * orbitRadius;
      
      vertex(x, y, 0);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
