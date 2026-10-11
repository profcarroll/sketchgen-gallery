let cables = [];
const NUM_CABLES = 150;
const CABLE_LENGTH = 200;
const BASE_RADIUS = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create cables with synchronized pendulum motion
  for (let i = 0; i < NUM_CABLES; i++) {
    cables.push({
      baseAngle: random(TWO_PI),
      speed: random(0.002, 0.01),
      length: random(CABLE_LENGTH * 0.5, CABLE_LENGTH * 1.5),
      baseRadius: random(BASE_RADIUS * 0.5, BASE_RADIUS * 1.5),
      color: color(random(180, 255), random(180, 255), random(220, 255), 180)
    });
  }
}

function draw() {
  background(0);
  
  // Center the scene
  translate(0, 0, -300);
  
  // Add subtle ambient lighting
  ambientLight(40);
  pointLight(255, 255, 255, 0, 0, 1000);
  
  // Begin batched drawing for cables
  beginShape(LINES);
  for (let i = 0; i < cables.length; i++) {
    let c = cables[i];
    
    // Synchronized motion across all cables
    let time = millis() * 0.001;
    let angle = c.baseAngle + time * c.speed;
    
    // Calculate base position in a circular pattern
    let baseX = sin(angle) * c.baseRadius;
    let baseY = cos(angle) * c.baseRadius;
    let baseZ = sin(angle * 0.7) * 100;
    
    // Calculate end point using pendulum motion
    let x = baseX + sin(angle) * c.length;
    let y = baseY + cos(angle) * c.length;
    let z = baseZ + sin(angle * 0.5) * 50;
    
    // Set cable color
    stroke(c.color);
    strokeWeight(1);
    
    // Add vertices for the line
    vertex(baseX, baseY, baseZ);
    vertex(x, y, z);
  }
  endShape();
  
  // Add subtle energy points at intersections
  if (frameCount % 30 === 0) {
    let x = random(-width/4, width/4);
    let y = random(-height/4, height/4);
    let z = random(-150, 150);
    
    fill(255, 255, 255, 150);
    noStroke();
    push();
    translate(x, y, z);
    sphere(3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
