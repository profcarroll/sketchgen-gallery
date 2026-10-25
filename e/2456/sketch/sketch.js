let gears = [];
let levers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gears
  for (let i = 0; i < 20; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      radius: random(20, 60),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      teeth: floor(random(8, 16)),
      color: color(30, 80, 90, 0.9)
    });
  }
  
  // Create levers
  for (let i = 0; i < 30; i++) {
    levers.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      length: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.002, 0.01),
      color: color(40, 70, 85, 0.9)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.02) * 100;
  let camY = cos(time * 0.015) * 50;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    fill(gear.color);
    noStroke();
    
    // Draw gear body
    sphere(gear.radius, 8, 6);
    
    // Draw teeth
    for (let i = 0; i < gear.teeth; i++) {
      let angle = TWO_PI * i / gear.teeth;
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      let z = gear.radius * 0.2;
      
      push();
      translate(x, y, 0);
      rotateZ(angle);
      fill(color(30, 80, 75, 0.9));
      box(gear.radius * 0.1, gear.radius * 0.3, z);
      pop();
    }
    
    pop();
  }
  
  // Draw levers
  for (let lever of levers) {
    push();
    translate(lever.x, lever.y, lever.z);
    rotateZ(lever.rotation);
    
    fill(lever.color);
    noStroke();
    
    // Draw lever body
    box(lever.length, 5, 5);
    
    // Draw pivot point
    fill(color(20, 60, 70, 0.9));
    sphere(8, 4, 3);
    
    pop();
  }
  
  // Update components
  for (let gear of gears) {
    gear.rotation += gear.speed;
  }
  
  for (let lever of levers) {
    lever.rotation += lever.speed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
