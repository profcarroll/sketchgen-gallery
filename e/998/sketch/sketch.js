let crankAngle = 0;
let pistonPositions = [];
let connectingRodLength = 80;
let crankRadius = 40;
let gearRadius = 20;
let gearTeeth = 12;
let valvePositions = [];
let valveOpen = false;

function setup() {
  createCanvas(600, 400);
  noStroke();
  frameRate(30);
  
  // Initialize piston positions
  for (let i = 0; i < 4; i++) {
    pistonPositions.push({ x: 150 + i * 100, y: 200 });
  }
  
  // Initialize valve positions
  for (let i = 0; i < 8; i++) {
    valvePositions.push({
      x: 150 + (i % 4) * 100,
      y: 100 + (i > 3 ? 200 : 0),
      open: false
    });
  }
}

function draw() {
  background(30);
  
  crankAngle += 0.1;
  
  // Draw engine block
  fill(80);
  rect(100, 150, 400, 150);
  
  // Draw cylinders
  for (let i = 0; i < 4; i++) {
    fill(60);
    rect(130 + i * 100, 150, 40, 150);
    fill(200);
    rect(135 + i * 100, 155, 30, 140);
  }
  
  // Draw crankshaft
  let crankX = width / 2;
  let crankY = height / 2;
  fill(100);
  ellipse(crankX, crankY, 30, 30);
  
  // Draw connecting rods and pistons
  for (let i = 0; i < 4; i++) {
    let pistonX = 150 + i * 100;
    let pistonY = 200 - crankRadius * cos(crankAngle + i * PI / 2);
    
    // Connecting rod
    stroke(150);
    strokeWeight(3);
    line(pistonX, pistonY, crankX, crankY);
    
    // Piston
    noStroke();
    fill(180);
    ellipse(pistonX, pistonY, 30, 20);
  }
  
  // Draw timing gears
  drawGear(crankX - 100, crankY, gearRadius, gearTeeth, crankAngle);
  drawGear(crankX + 100, crankY, gearRadius, gearTeeth, -crankAngle);
  
  // Update valve positions
  if (frameCount % 30 === 0) {
    valveOpen = !valveOpen;
  }
  
  for (let i = 0; i < 8; i++) {
    let valv = valvePositions[i];
    let offset = i > 3 ? PI : 0;
    let angle = crankAngle + offset;
    
    if (valveOpen) {
      valv.open = sin(angle) > 0.5;
    } else {
      valv.open = sin(angle) < -0.5;
    }
    
    // Draw valve
    fill(valv.open ? 255 : 150);
    rect(valv.x - 5, valv.y, 10, 30);
  }
  
  // Draw camshaft
  let camX = width / 2;
  let camY = height / 2 - 80;
  fill(120);
  ellipse(camX, camY, 60, 60);
  
  // Draw valve springs
  for (let i = 0; i < 8; i++) {
    let valv = valvePositions[i];
    stroke(100);
    line(valv.x, valv.y + 30, valv.x, valv.y + 60);
  }
}

function drawGear(x, y, radius, teeth, angle) {
  // Gear circle
  noFill();
  stroke(200);
  strokeWeight(2);
  ellipse(x, y, radius * 2, radius * 2);
  
  // Teeth
  strokeWeight(1);
  for (let i = 0; i < teeth; i++) {
    let a = angle + (i * TWO_PI / teeth);
    let px = x + cos(a) * radius;
    let py = y + sin(a) * radius;
    let tx = x + cos(a) * (radius - 5);
    let ty = y + sin(a) * (radius - 5);
    
    line(px, py, tx, ty);
  }
}
