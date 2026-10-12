let gears = [];
let cams = [];
let pressureLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create clockwork mechanism
  for (let i = 0; i < 8; i++) {
    let radius = map(i, 0, 7, width * 0.15, width * 0.4);
    let centerX = width * 0.5;
    let centerY = height * 0.5;
    
    // Create gears
    gears.push({
      centerX: centerX,
      centerY: centerY,
      radius: radius,
      teeth: floor(random(12, 20)),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: color(180, 60, 30)
    });
    
    // Create cams
    cams.push({
      centerX: centerX,
      centerY: centerY,
      radius: radius * 0.7,
      rotation: random(TWO_PI),
      speed: random(0.002, 0.015),
      color: color(160, 50, 20)
    });
  }
  
  // Create pressure lines
  for (let i = 0; i < 300; i++) {
    pressureLines.push({
      points: [],
      length: random(40, 80),
      speed: random(0.002, 0.008),
      angle: random(TWO_PI)
    });
  }
  
  // Initialize pressure lines
  for (let line of pressureLines) {
    let startX = random(width * 0.1, width * 0.9);
    let startY = random(height * 0.3, height * 0.7);
    line.points.push(createVector(startX, startY));
    
    // Add initial segments
    for (let j = 1; j < line.length; j++) {
      let prev = line.points[j-1];
      let newPoint = createVector(
        prev.x + random(-2, 2),
        prev.y + random(-1, 1)
      );
      line.points.push(newPoint);
    }
  }
}

function draw() {
  background(30, 15, 10);
  
  // Draw mechanical components
  strokeWeight(2);
  noFill();
  
  let time = millis() * 0.001;
  
  // Draw gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    
    stroke(gear.color);
    // Gear outline
    ellipse(gear.centerX, gear.centerY, gear.radius * 2);
    
    // Gear teeth
    let toothAngle = TWO_PI / gear.teeth;
    for (let i = 0; i < gear.teeth; i++) {
      let angle = gear.rotation + i * toothAngle;
      let x1 = gear.centerX + cos(angle) * (gear.radius - 5);
      let y1 = gear.centerY + sin(angle) * (gear.radius - 5);
      let x2 = gear.centerX + cos(angle) * (gear.radius + 5);
      let y2 = gear.centerY + sin(angle) * (gear.radius + 5);
      
      line(x1, y1, x2, y2);
    }
    
    // Gear center
    fill(120, 40, 20);
    noStroke();
    ellipse(gear.centerX, gear.centerY, 10);
  }
  
  // Draw cams
  for (let cam of cams) {
    cam.rotation += cam.speed;
    
    stroke(cam.color);
    // Cam outline
    ellipse(cam.centerX, cam.centerY, cam.radius * 2);
    
    // Cam profile - create a wavy shape
    beginShape();
    let segments = 30;
    for (let i = 0; i <= segments; i++) {
      let angle = map(i, 0, segments, 0, TWO_PI);
      let r = cam.radius + sin(cam.rotation + angle * 2) * 15;
      let x = cam.centerX + cos(angle) * r;
      let y = cam.centerY + sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  // Draw pressure lines
  stroke(200, 120, 60);
  strokeWeight(1.5);
  noFill();
  
  for (let line of pressureLines) {
    line.angle += line.speed;
    
    // Update points with mechanical flow effect
    for (let i = 0; i < line.points.length; i++) {
      let p = line.points[i];
      if (i > 0 && i < line.points.length - 1) {
        // Add mechanical pressure movement
        let offset = sin(time + i * 0.1 + line.angle) * 2;
        p.x += cos(line.angle) * offset * 0.5;
        p.y += sin(line.angle) * offset * 0.5;
      }
    }
    
    beginShape();
    for (let p of line.points) {
      vertex(p.x, p.y);
    }
    endShape();
  }
  
  // Add subtle metallic texture
  stroke(100, 40, 20, 30);
  strokeWeight(0.5);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    line(x, y, x + random(-1, 1), y + random(-1, 1));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
