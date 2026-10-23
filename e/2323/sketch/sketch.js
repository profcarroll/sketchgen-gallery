let gears = [];
let rubberBands = [];
let crystals = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create clockwork gears with brass-like appearance
  for (let i = 0; i < 50; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      radius: random(20, 60),
      teeth: floor(random(12, 24)),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(30, 50), // Brass hues
      saturation: random(20, 40),
      brightness: random(70, 90)
    });
  }
  
  // Create rubber band coils with glowing effect
  for (let i = 0; i < 100; i++) {
    rubberBands.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      length: random(50, 150),
      angle: random(TWO_PI),
      twist: random(-0.5, 0.5),
      hue: random(20, 30), // Warm orange for rubber bands
      saturation: random(80, 100),
      brightness: random(60, 90),
      glow: random(0.3, 0.7)
    });
  }
  
  // Create bioluminescent crystals with pulsing effect
  for (let i = 0; i < 200; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(2, 8),
      hue: random(160, 180), // Cyan-blue for bioluminescence
      saturation: random(80, 100),
      brightness: random(80, 100),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5); // Deep dark space
  ambientLight(20);
  pointLight(255, 255, 255, 0, 0, 300);
  
  let time = millis() * 0.001;
  
  // Center the view
  translate(0, 0, -400);
  
  // Slow rotation
  rotateY(time * 0.02);
  rotateX(sin(time * 0.1) * 0.05);
  
  // Draw gears with brass appearance
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation + time * gear.speed);
    
    // Gear outer ring
    stroke(gear.hue, gear.saturation, gear.brightness);
    noFill();
    strokeWeight(1);
    circle(0, 0, gear.radius * 2);
    
    // Gear teeth
    for (let j = 0; j < gear.teeth; j++) {
      let angle = TWO_PI * j / gear.teeth;
      let x1 = cos(angle) * gear.radius;
      let y1 = sin(angle) * gear.radius;
      let x2 = cos(angle) * (gear.radius - 15);
      let y2 = sin(angle) * (gear.radius - 15);
      
      stroke(gear.hue, gear.saturation, gear.brightness);
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Draw rubber bands with glowing effect
  for (let i = 0; i < rubberBands.length; i++) {
    let band = rubberBands[i];
    
    push();
    translate(band.x, band.y, band.z);
    rotateZ(band.angle + time * band.twist);
    
    // Band glow
    noStroke();
    fill(band.hue, band.saturation, band.brightness, band.glow);
    ellipse(0, 0, band.length, band.length * 0.3);
    
    // Band core
    stroke(band.hue, band.saturation, band.brightness - 20);
    noFill();
    strokeWeight(1);
    ellipse(0, 0, band.length, band.length * 0.3);
    
    pop();
  }
  
  // Draw bioluminescent crystals with pulsing
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    let pulse = sin(time * crystal.pulseSpeed + crystal.pulsePhase) * 0.5 + 0.5;
    fill(crystal.hue, crystal.saturation, crystal.brightness, pulse);
    vertex(crystal.x, crystal.y, crystal.z);
  }
  endShape();
  
  // Update gear rotations
  for (let i = 0; i < gears.length; i++) {
    gears[i].rotation += gears[i].speed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
