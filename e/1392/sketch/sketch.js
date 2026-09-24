let racks = [];
let ribbons = [];
let grid;

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
  for (let i = 0; i < 15; i++) {
    ribbons.push({
      path: [],
      speed: random(0.005, 0.02),
      hue: random(180, 240),
      width: random(2, 6),
      length: random(200, 500)
    });
  }
  
  // Initialize grid for spatial hashing
  grid = new Array(20).fill().map(() => new Array(20).fill([]));
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
}

function drawRibbon(ribbon) {
  if (ribbon.path.length < 2) return;
  
  // Draw glowy ribbon
  let alpha = 0.6 + sin(millis() * ribbon.speed * 10) * 0.3;
  stroke(ribbon.hue, 100, 100, alpha);
  strokeWeight(ribbon.width);
  noFill();
  
  beginShape();
  for (let i = 0; i < ribbon.path.length; i++) {
    let pos = ribbon.path[i];
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();
  
  // Draw particles at path points
  stroke(ribbon.hue, 100, 100, alpha * 0.8);
  strokeWeight(2);
  beginShape(POINTS);
  for (let i = 0; i < ribbon.path.length; i += 5) {
    let pos = ribbon.path[i];
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
