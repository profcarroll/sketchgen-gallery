let rollers = [];
let gears = [];
let conveyorBelt;
let inkDrops = [];
let noiseScale = 0.02;
let noiseStrength = 2;
let paperSpeed = 1;
let rollerRotation = 0;
let gearRotation = 0;
let inkColor;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create rollers
  for (let i = 0; i < 5; i++) {
    rollers.push({
      x: -width/2 + i * 150,
      y: height/4,
      z: 0,
      radius: 60,
      rotation: 0
    });
  }
  
  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      x: -width/2 + i * 200,
      y: height/3,
      z: 0,
      radius: 40,
      rotation: 0,
      teeth: 12
    });
  }
  
  // Create conveyor belt
  conveyorBelt = {
    x: 0,
    y: height/2,
    z: 0,
    width: width * 1.5,
    length: height * 0.8,
    speed: paperSpeed
  };
  
  inkColor = color(20, 100, 100); // Bright orange-red
}

function draw() {
  background(0);
  
  // Update rotations
  rollerRotation += 0.02;
  gearRotation += 0.01;
  
  // Draw rollers
  for (let roller of rollers) {
    push();
    translate(roller.x, roller.y, roller.z);
    rotateY(roller.rotation);
    noStroke();
    fill(30, 50, 90); // Brass color
    cylinder(roller.radius, 10, true); // Polished brass
    
    // Add reflective highlights
    fill(40, 20, 100);
    sphere(roller.radius * 0.8, 8, 6);
    
    pop();
    
    roller.rotation += 0.05;
  }
  
  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateY(gear.rotation);
    
    noStroke();
    fill(20, 80, 70); // Gear color
    
    // Draw gear
    for (let i = 0; i < gear.teeth; i++) {
      let angle = TWO_PI * i / gear.teeth;
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      
      push();
      translate(x, y, 0);
      rotateZ(angle);
      rect(0, -5, 10, 20);
      pop();
    }
    
    // Draw center circle
    fill(30, 50, 90);
    sphere(gear.radius * 0.3, 6, 4);
    
    pop();
    
    gear.rotation += 0.03;
  }
  
  // Draw conveyor belt
  push();
  translate(conveyorBelt.x, conveyorBelt.y, conveyorBelt.z);
  rotateX(HALF_PI);
  noStroke();
  fill(80, 10, 20); // Dark gray
  rect(-conveyorBelt.width/2, -conveyorBelt.length/2, conveyorBelt.width, conveyorBelt.length);
  
  // Add paper texture
  stroke(0, 0, 50);
  strokeWeight(0.5);
  for (let i = 0; i < 10; i++) {
    line(-conveyorBelt.width/2 + i * (conveyorBelt.width / 10), -conveyorBelt.length/2, 
         -conveyorBelt.width/2 + i * (conveyorBelt.width / 10), conveyorBelt.length/2);
  }
  
  pop();
  
  // Animate paper flow
  conveyorBelt.x += conveyorBelt.speed;
  if (conveyorBelt.x > width/2) {
    conveyorBelt.x = -width/2;
  }
  
  // Add ink drops periodically
  if (frameCount % 30 === 0) {
    inkDrops.push({
      x: random(-width/2, width/2),
      y: conveyorBelt.y,
      z: 0,
      size: random(10, 30),
      alpha: 1,
      hue: random(10, 40), // Orange-red range
      growthRate: random(0.5, 1.5)
    });
  }
  
  // Update and display ink drops
  for (let i = inkDrops.length - 1; i >= 0; i--) {
    let drop = inkDrops[i];
    
    // Animate drop
    drop.size += drop.growthRate;
    drop.alpha -= 0.01;
    
    // Add organic noise to position
    let n = noise(drop.x * noiseScale, drop.y * noiseScale, frameCount * 0.01) * noiseStrength;
    drop.x += n;
    
    // Draw ink drop
    push();
    translate(drop.x, drop.y, drop.z);
    noStroke();
    fill(drop.hue, 100, 100, drop.alpha);
    sphere(drop.size, 8, 6); // Lower detail for performance
    
    pop();
    
    // Remove old drops
    if (drop.alpha <= 0 || drop.size > width) {
      inkDrops.splice(i, 1);
    }
  }
  
  // Add rhythmic pulse effect
  let pulse = sin(frameCount * 0.05) * 0.2 + 1;
  scale(pulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
