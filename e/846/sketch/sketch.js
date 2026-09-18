let time = 0;
let piston1, piston2, piston3, piston4;
let crankshaft;
let connectingRods = [];

function setup() {
  createCanvas(600, 600);
  noStroke();
  
  // Initialize pistons
  piston1 = { y: 200 };
  piston2 = { y: 200 };
  piston3 = { y: 200 };
  piston4 = { y: 200 };
  
  crankshaft = { angle: 0 };
  
  // Initialize connecting rods
  for (let i = 0; i < 4; i++) {
    connectingRods.push({
      angle: i * PI / 2,
      length: 150
    });
  }
}

function draw() {
  background(30);
  
  time += 0.02;
  
  // Update pistons
  piston1.y = 200 + sin(time) * 80;
  piston2.y = 200 + sin(time + PI/2) * 80;
  piston3.y = 200 + sin(time + PI) * 80;
  piston4.y = 200 + sin(time + 3*PI/2) * 80;
  
  // Update crankshaft
  crankshaft.angle += 0.05;
  
  // Draw engine block
  fill(100);
  rect(100, 100, 400, 300);
  
  // Draw cylinders
  fill(120);
  for (let i = 0; i < 4; i++) {
    let x = 150 + i * 100;
    rect(x - 20, 100, 40, 300);
    
    // Draw piston
    fill(200);
    ellipse(x, piston1.y, 40, 60);
    
    // Draw valve
    if (i % 2 === 0) {
      fill(255, 0, 0);
      rect(x - 5, 90, 10, 10); // Intake valve
      fill(0, 0, 255);
      rect(x - 5, 390, 10, 10); // Exhaust valve
    }
  }
  
  // Draw connecting rods and crankshaft
  stroke(200);
  strokeWeight(4);
  for (let i = 0; i < 4; i++) {
    let x = 150 + i * 100;
    let rod = connectingRods[i];
    
    // Calculate rod end position
    let rodEndX = x + cos(rod.angle) * rod.length;
    let rodEndY = piston1.y - (piston1.y - 200);
    
    // Draw rod
    line(x, piston1.y, rodEndX, rodEndY);
    
    // Draw crankshaft bearing
    fill(150);
    ellipse(rodEndX, rodEndY, 15, 15);
  }
  
  // Draw crankshaft
  strokeWeight(8);
  let shaftX = 300;
  let shaftY = 250;
  line(shaftX - 100, shaftY, shaftX + 100, shaftY);
  
  // Draw rotating bearings on crankshaft
  for (let i = 0; i < 4; i++) {
    let bearingX = shaftX + cos(crankshaft.angle + i * PI/2) * 80;
    let bearingY = shaftY + sin(crankshaft.angle + i * PI/2) * 80;
    fill(150);
    ellipse(bearingX, bearingY, 12, 12);
  }
  
  // Draw fluid flow
  strokeWeight(3);
  for (let i = 0; i < 4; i++) {
    let x = 150 + i * 100;
    if (i % 2 === 0) {
      stroke(255, 0, 0); // Red for intake
      line(x, 100, x, piston1.y);
    } else {
      stroke(0, 0, 255); // Blue for exhaust
      line(x, 300, x, piston1.y);
    }
  }
}
