let gears = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create mechanical gears and conduits
  for (let i = 0; i < 50; i++) {
    gears.push({
      x: random(width),
      y: random(height),
      radius: random(20, 60),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.02, 0.02),
      teeth: floor(random(8, 16)),
      hue: 0, // White chalk on black slate
      saturation: 0,
      brightness: 100,
      alpha: random(0.7, 1),
      layer: random(3), // Depth layers
      connectedGears: []
    });
  }
  
  // Establish connections between gears
  for (let i = 0; i < gears.length; i++) {
    let gearA = gears[i];
    for (let j = i + 1; j < gears.length; j++) {
      let gearB = gears[j];
      let dx = gearA.x - gearB.x;
      let dy = gearA.y - gearB.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < 200 && distance > 30) {
        gearA.connectedGears.push(j);
        gearB.connectedGears.push(i);
      }
    }
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Very faint black background for slate
  
  time += 0.01;
  
  // Draw connections between gears
  stroke(0, 0, 100, 0.3);
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < gears.length; i++) {
    let gearA = gears[i];
    for (let j = 0; j < gearA.connectedGears.length; j++) {
      let gearB = gears[gearA.connectedGears[j]];
      line(gearA.x, gearA.y, gearB.x, gearB.y);
    }
  }
  
  // Update and draw each gear
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    
    // Slow rotation
    gear.rotation += gear.rotationSpeed;
    
    // Slight positional drift to simulate assembly/disassembly
    gear.x += sin(time * 0.1 + i) * 0.2;
    gear.y += cos(time * 0.13 + i) * 0.2;
    
    // Draw gear
    push();
    translate(gear.x, gear.y);
    rotate(gear.rotation);
    
    // Gear outline
    stroke(gear.hue, gear.saturation, gear.brightness, gear.alpha);
    strokeWeight(1);
    noFill();
    
    // Main gear circle
    ellipse(0, 0, gear.radius * 2, gear.radius * 2);
    
    // Teeth
    let toothAngle = TWO_PI / gear.teeth;
    for (let j = 0; j < gear.teeth; j++) {
      let angle = j * toothAngle + gear.rotation;
      let toothLength = gear.radius * 0.7;
      let x1 = cos(angle) * gear.radius;
      let y1 = sin(angle) * gear.radius;
      let x2 = cos(angle) * toothLength;
      let y2 = sin(angle) * toothLength;
      
      line(x1, y1, x2, y2);
    }
    
    // Inner hole
    fill(0, 0, 0, 0.5);
    ellipse(0, 0, gear.radius * 0.3, gear.radius * 0.3);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
