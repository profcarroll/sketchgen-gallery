let gears = [];
let springs = [];
let crystals = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create mechanical structure with gears and springs
  for (let i = 0; i < 200; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      radius: random(10, 30),
      rotation: random(TWO_PI),
      speed: random(0.01, 0.05),
      hue: random(20, 40), // Brass color
      saturation: random(20, 40),
      brightness: random(80, 95)
    });
  }
  
  for (let i = 0; i < 150; i++) {
    springs.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      length: random(30, 80),
      angle: random(TWO_PI),
      tension: random(0.5, 1),
      hue: random(25, 35), // Light brass
      saturation: random(10, 25),
      brightness: random(70, 90),
      timeOffset: random(TWO_PI)
    });
  }
  
  // Create glowing crystalline veins
  for (let i = 0; i < 300; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(2, 8),
      pulseSpeed: random(0.02, 0.05),
      hue: random(190, 230), // Blue-green
      saturation: random(70, 100),
      brightness: random(80, 100),
      timeOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5); // Dark mechanical base
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 300);
  
  let time = millis() * 0.001;
  
  // Center the view and slowly rotate
  translate(0, 0, -400);
  rotateY(time * 0.01);
  rotateX(sin(time * 0.05) * 0.03);
  
  // Draw gears
  noStroke();
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear teeth
    fill(gear.hue, gear.saturation, gear.brightness);
    sphere(gear.radius, 8, 4); // Low detail for performance
    
    // Inner hole
    fill(0, 0, 0);
    sphere(gear.radius * 0.3, 6, 3);
    
    pop();
    
    // Update rotation
    gear.rotation += gear.speed;
  }
  
  // Draw springs (tensioned rubber bands)
  noFill();
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < springs.length; i++) {
    let spring = springs[i];
    
    push();
    translate(spring.x, spring.y, spring.z);
    rotateZ(spring.angle);
    
    // Create spring effect with pulsing tension
    let pulse = sin(time * 2 + spring.timeOffset) * 0.3 + 0.7;
    let length = spring.length * pulse;
    
    stroke(spring.hue, spring.saturation, spring.brightness, 0.8);
    for (let j = 0; j < 15; j++) {
      let angle = map(j, 0, 14, 0, TWO_PI * 3);
      let x1 = cos(angle) * length/2;
      let y1 = sin(angle) * length/2;
      let x2 = cos(angle + PI/2) * length/2;
      let y2 = sin(angle + PI/2) * length/2;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    
    pop();
  }
  endShape();
  
  // Draw glowing crystalline veins
  noStroke();
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    // Pulsing glow effect
    let pulse = sin(time * crystal.pulseSpeed + crystal.timeOffset) * 0.5 + 0.5;
    let size = crystal.size * (1 + pulse * 0.5);
    
    fill(crystal.hue, crystal.saturation, crystal.brightness, 0.8);
    sphere(size, 6, 4); // Low detail for performance
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
