let racks = [];
let ribbons = [];
let hotspots = [];
let lightPatterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create server racks
  for (let i = 0; i < 8; i++) {
    racks.push({
      x: -200 + i * 60,
      y: 0,
      z: -300 + random(-50, 50),
      height: 150 + random(50),
      depth: 40 + random(20)
    });
  }
  
  // Create data ribbons
  for (let i = 0; i < 20; i++) {
    ribbons.push({
      path: [],
      speed: random(0.005, 0.02),
      hue: random(180, 240),
      width: random(2, 6),
      length: random(200, 500),
      target: null
    });
  }
  
  // Create hotspots at rack locations
  for (let i = 0; i < 8; i++) {
    let rack = racks[i];
    hotspots.push({
      x: rack.x,
      y: rack.y - rack.height/2 + random(10, rack.height - 20),
      z: rack.z,
      pulse: random(TWO_PI),
      size: random(5, 15)
    });
  }
  
  // Initialize light patterns
  for (let i = 0; i < 12; i++) {
    lightPatterns.push({
      x: random(-250, 250),
      y: random(-100, 100),
      z: random(-350, -50),
      size: random(50, 150),
      pulse: random(TWO_PI),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Camera movement
  let time = millis() * 0.0005;
  camera(0, -100, 300 + sin(time) * 50, 0, 0, 0, 0, 1, 0);
  
  // Draw racks
  for (let rack of racks) {
    drawRack(rack);
  }
  
  // Update and draw ribbons
  for (let ribbon of ribbons) {
    updateRibbon(ribbon);
    drawRibbon(ribbon);
  }
  
  // Draw hotspots with light patterns
  for (let hotspot of hotspots) {
    drawHotspot(hotspot);
  }
  
  // Draw dynamic light patterns
  for (let pattern of lightPatterns) {
    drawLightPattern(pattern);
  }
}

function drawRack(rack) {
  push();
  translate(rack.x, rack.y, rack.z);
  
  // Main rack body
  fill(200, 30, 20);
  box(50, rack.height, rack.depth);
  
  // Rack panels
  for (let i = 0; i < 8; i++) {
    let panelHeight = rack.height / 8;
    fill(180, 40, 30);
    push();
    translate(0, -rack.height/2 + i * panelHeight + panelHeight/2, rack.depth/2 - 1);
    box(48, panelHeight - 2, 2);
    pop();
    
    // Chips on panels
    for (let j = 0; j < 6; j++) {
      let chipX = -20 + j * 7;
      let chipY = -rack.height/2 + i * panelHeight + panelHeight/2;
      if (random() > 0.3) {
        fill(190, 80, 80);
        push();
        translate(chipX, chipY, rack.depth/2 + 2);
        box(4, 4, 1);
        pop();
      }
    }
  }
  
  // Cool blue light effect
  for (let i = 0; i < 4; i++) {
    let x = -25 + i * 15;
    fill(180, 100, 80, 0.3);
    push();
    translate(x, -rack.height/2 + 20, rack.depth/2 + 3);
    box(3, 10, 1);
    pop();
  }
  
  pop();
}

function updateRibbon(ribbon) {
  if (ribbon.path.length === 0) {
    // Initialize path
    ribbon.path.push(createVector(
      random(-200, 200),
      random(-50, 50),
      random(-300, -100)
    ));
  } else {
    // Move along path
    let last = ribbon.path[ribbon.path.length - 1];
    let next = createVector(
      last.x + random(-10, 10),
      last.y + random(-5, 5),
      last.z + random(5, 15)
    );
    
    // Keep within bounds
    next.x = constrain(next.x, -250, 250);
    next.y = constrain(next.y, -100, 100);
    next.z = constrain(next.z, -350, -50);
    
    ribbon.path.push(next);
    
    // Limit path length
    if (ribbon.path.length > ribbon.length) {
      ribbon.path.shift();
    }
  }
  
  // Occasionally change target hotspot
  if (frameCount % 120 === 0 && random() > 0.7) {
    ribbon.target = hotspots[int(random(hotspots.length))];
  }
  
  // Move towards target if exists
  if (ribbon.target) {
    let last = ribbon.path[ribbon.path.length - 1];
    let dir = createVector(
      ribbon.target.x - last.x,
      ribbon.target.y - last.y,
      ribbon.target.z - last.z
    );
    
    dir.normalize();
    dir.mult(0.5);
    
    // Add some randomness to the movement
    dir.add(createVector(random(-0.2, 0.2), random(-0.2, 0.2), random(-0.2, 0.2)));
    
    if (last.dist(createVector(ribbon.target.x, ribbon.target.y, ribbon.target.z)) < 10) {
      // Reached target, pick a new one
      ribbon.target = null;
    }
  }
}

function drawRibbon(ribbon) {
  if (ribbon.path.length < 2) return;
  
  // Draw glowy ribbon
  let alpha = 0.6 + sin(millis() * ribbon.speed * 10) * 0.3;
  
  // If near a hotspot, change color to warm tones
  let nearHotspot = false;
  for (let hotspot of hotspots) {
    if (ribbon.path.length > 0) {
      let lastPoint = ribbon.path[ribbon.path.length - 1];
      let dist = lastPoint.dist(createVector(hotspot.x, hotspot.y, hotspot.z));
      if (dist < 30) {
        // Draw warm orange/yellow glow
        stroke(25, 100, 100, alpha * 0.8);
        nearHotspot = true;
        break;
      }
    }
  }
  
  if (!nearHotspot) {
    stroke(ribbon.hue, 100, 100, alpha);
  }
  
  strokeWeight(ribbon.width);
  noFill();
  
  beginShape();
  for (let i = 0; i < ribbon.path.length; i++) {
    let pos = ribbon.path[i];
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();
  
  // Draw particles at path points
  strokeWeight(2);
  beginShape(POINTS);
  for (let i = 0; i < ribbon.path.length; i += 5) {
    let pos = ribbon.path[i];
    
    if (nearHotspot) {
      stroke(25, 100, 100, alpha * 0.8); // warm orange
    } else {
      stroke(ribbon.hue, 100, 100, alpha * 0.8);
    }
    
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();
}

function drawHotspot(hotspot) {
  hotspot.pulse += 0.05;
  
  let pulse = sin(hotspot.pulse) * 0.5 + 0.5;
  let size = hotspot.size * (1 + pulse * 0.5);
  
  // Draw pulsating hotspot
  noStroke();
  fill(25, 100, 100, 0.8);
  push();
  translate(hotspot.x, hotspot.y, hotspot.z);
  sphere(size);
  pop();
  
  // Draw light pattern from hotspot
  let patternSize = size * 3;
  let patternPulse = sin(hotspot.pulse * 2) * 0.5 + 0.5;
  let patternAlpha = patternPulse * 0.3;
  
  push();
  translate(hotspot.x, hotspot.y, hotspot.z);
  fill(25, 100, 100, patternAlpha);
  rotateX(hotspot.pulse);
  rotateY(hotspot.pulse * 0.7);
  sphere(patternSize, 4, 4); // Low detail for performance
  pop();
}

function drawLightPattern(pattern) {
  pattern.pulse += 0.02;
  pattern.angle += 0.01;
  
  let pulse = sin(pattern.pulse) * 0.5 + 0.5;
  let size = pattern.size * (0.5 + pulse * 0.5);
  
  // Draw geometric light pattern
  noStroke();
  fill(25, 100, 100, 0.2 * pulse);
  push();
  translate(pattern.x, pattern.y, pattern.z);
  rotateX(pattern.angle);
  rotateY(pattern.angle * 0.5);
  sphere(size, 6, 6); // Low detail for performance
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
