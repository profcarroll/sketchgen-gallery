let gears = [];
let cams = [];
let threads = [];
let isDisturbed = false;
let disturbanceCenter = { x: 0, y: 0 };
let disturbanceRadius = 0;
let colorFields = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  pixelDensity(1);

  // Create gears
  for (let i = 0; i < 12; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      radius: random(30, 60),
      rotation: random(TWO_PI),
      rotationSpeed: random(0.005, 0.02),
      teeth: floor(random(12, 20)),
      color: random(20, 40)
    });
  }

  // Create cams
  for (let i = 0; i < 8; i++) {
    cams.push({
      x: random(-width/3, width/3),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      size: random(20, 40),
      rotation: random(TWO_PI),
      rotationSpeed: random(0.01, 0.03),
      shape: floor(random(3, 6))
    });
  }

  // Create threads (for the loom)
  for (let i = 0; i < 200; i++) {
    threads.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      length: random(50, 150),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      hue: random(180, 240)
    });
  }

  // Create color fields that will dissolve and reform
  for (let i = 0; i < 150; i++) {
    colorFields.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(10, 30),
      hue: random(0, 255),
      saturation: random(100, 255),
      brightness: random(100, 255),
      speed: random(0.005, 0.02),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 10, 95); // Dark background like metal

  // Draw the loom structure
  drawLoom();

  // Apply disturbance if active
  if (isDisturbed) {
    disturbanceRadius += 3;
    if (disturbanceRadius > 300) {
      isDisturbed = false;
      disturbanceRadius = 0;
    }
  }

  // Draw color fields that dissolve and reform
  for (let field of colorFields) {
    push();
    
    translate(field.x, field.y, field.z);
    
    // Animate the field
    let timeOffset = frameCount * field.speed + field.phase;
    let scale = sin(timeOffset) * 0.5 + 1.0;
    let hue = (field.hue + frameCount * 0.2) % 255;
    
    // Only draw if not disturbed
    if (!isDisturbed || dist(field.x, field.y, disturbanceCenter.x, disturbanceCenter.y) > disturbanceRadius) {
      fill(hue, field.saturation, field.brightness);
      noStroke();
      
      // Create geometric shape that pulses and changes
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = map(i, 0, 6, 0, TWO_PI) + timeOffset * 0.5;
        let x = cos(angle) * field.size * scale;
        let y = sin(angle) * field.size * scale;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }

  // Update and draw threads
  for (let thread of threads) {
    push();
    
    translate(thread.x, thread.y, thread.z);
    
    let timeOffset = frameCount * thread.speed;
    let angle = thread.angle + timeOffset;
    
    // Animate the thread
    let x1 = cos(angle) * thread.length * 0.5;
    let y1 = sin(angle) * thread.length * 0.5;
    let x2 = cos(angle + PI) * thread.length * 0.5;
    let y2 = sin(angle + PI) * thread.length * 0.5;
    
    // Draw thread with color variation
    stroke(thread.hue, 100, 200);
    strokeWeight(1);
    line(x1, y1, x2, y2);
    
    pop();
  }
}

function drawLoom() {
  // Draw gears
  for (let gear of gears) {
    push();
    
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Draw gear
    fill(gear.color, 150, 200);
    noStroke();
    
    beginShape();
    for (let i = 0; i < gear.teeth * 2; i++) {
      let angle = map(i, 0, gear.teeth * 2, 0, TWO_PI);
      let radius = gear.radius;
      if (i % 2 === 1) radius *= 0.7;
      
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Update rotation
    gear.rotation += gear.rotationSpeed;
    
    pop();
  }

  // Draw cams
  for (let cam of cams) {
    push();
    
    translate(cam.x, cam.y, cam.z);
    rotateZ(cam.rotation);
    
    // Draw cam shape
    fill(30, 150, 200);
    noStroke();
    
    beginShape();
    for (let i = 0; i < cam.shape * 4; i++) {
      let angle = map(i, 0, cam.shape * 4, 0, TWO_PI);
      let radius = cam.size;
      if (i % 4 === 1 || i % 4 === 2) radius *= 0.8;
      
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Update rotation
    cam.rotation += cam.rotationSpeed;
    
    pop();
  }

  // Draw mechanical structure
  stroke(100, 50, 150);
  strokeWeight(2);
  noFill();
  
  // Draw a few connecting rods
  for (let i = 0; i < 5; i++) {
    let x1 = random(-width/3, width/3);
    let y1 = random(-height/4, height/4);
    let z1 = random(-50, 50);
    
    let x2 = random(-width/3, width/3);
    let y2 = random(-height/4, height/4);
    let z2 = random(-50, 50);
    
    line(x1, y1, z1, x2, y2, z2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  isDisturbed = true;
  disturbanceCenter.x = mouseX - width/2;
  disturbanceCenter.y = mouseY - height/2;
  disturbanceRadius = 0;
}
