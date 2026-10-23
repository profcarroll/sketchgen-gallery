let gears = [];
const numGears = 8;
const maxRadius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create interlocking gears with varying sizes and speeds
  for (let i = 0; i < numGears; i++) {
    const angle = map(i, 0, numGears, 0, TWO_PI);
    const radius = map(i, 0, numGears, maxRadius * 0.3, maxRadius * 0.8);
    
    gears.push({
      center: createVector(cos(angle) * radius, sin(angle) * radius, 0),
      radius: random(20, 60),
      teeth: floor(random(12, 24)),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.03) * (i % 2 === 0 ? 1 : -1),
      color: color(random(10, 40), random(60, 80), random(30, 50), 0.9),
      hubColor: color(random(20, 30), random(70, 90), random(40, 60), 0.9)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.05);
  
  // Center the entire assembly
  translate(0, 0, -200);
  
  // Draw the main brass base with oxidized bronze coloration
  noStroke();
  fill(30, 70, 30, 0.8);
  sphere(250, 16, 8);
  
  // Draw each gear with teeth and hub
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    
    // Update rotation
    gear.rotation += gear.speed;
    
    push();
    translate(gear.center.x, gear.center.y, gear.center.z);
    rotateZ(gear.rotation);
    
    // Draw gear hub
    fill(gear.hubColor);
    sphere(gear.radius * 0.3, 8, 4);
    
    // Draw gear teeth
    fill(gear.color);
    stroke(0, 0, 0, 0.2);
    strokeWeight(1);
    
    for (let j = 0; j < gear.teeth; j++) {
      const toothAngle = map(j, 0, gear.teeth, 0, TWO_PI);
      const toothHeight = gear.radius * 0.1;
      const toothWidth = gear.radius * 0.2;
      
      push();
      rotateZ(toothAngle);
      translate(gear.radius * 0.7, 0, 0);
      
      // Create a simple tooth shape (a triangle with base and apex)
      beginShape();
      vertex(0, -toothWidth * 0.5, 0);
      vertex(toothHeight, 0, 0);
      vertex(0, toothWidth * 0.5, 0);
      endShape(CLOSE);
      
      pop();
    }
    
    // Draw gear ring
    noFill();
    stroke(gear.color);
    strokeWeight(2);
    ellipse(0, 0, gear.radius * 2, gear.radius * 2);
    
    pop();
  }
  
  // Add connecting brass rods and chains to show interlocking mechanism
  stroke(30, 80, 40, 0.7);
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < gears.length; i++) {
    const gearA = gears[i];
    const gearB = gears[(i + 1) % gears.length];
    
    // Connect gears with brass rods
    beginShape(LINES);
    vertex(gearA.center.x, gearA.center.y, gearA.center.z);
    vertex(gearB.center.x, gearB.center.y, gearB.center.z);
    endShape();
  }
  
  // Add some decorative brass elements to the base
  fill(25, 60, 35, 0.6);
  for (let i = 0; i < 10; i++) {
    const angle = random(TWO_PI);
    const dist = random(100, 200);
    const x = cos(angle) * dist;
    const y = sin(angle) * dist;
    const size = random(5, 15);
    
    push();
    translate(x, y, -200);
    sphere(size, 4, 2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
