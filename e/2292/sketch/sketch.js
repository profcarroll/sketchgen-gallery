let stalactites = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create stalactite structures in beeswax-like form
  for (let i = 0; i < 150; i++) {
    stalactites.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-800, -200),
      height: random(30, 100),
      radius: random(5, 20),
      segments: floor(random(5, 12)),
      color: color(random(220, 250), 40, 60 + random(20), 0.8)
    });
  }
}

function draw() {
  background(220, 10, 10); // Deep dark gray-blue

  // Ambient lighting
  ambientLight(20);
  
  // Dynamic point light source that pulses and moves
  let lightX = sin(time * 0.003) * width/4;
  let lightY = cos(time * 0.002) * height/4;
  pointLight(180, 120, 150, lightX, lightY, -600);
  
  // Rotate scene slowly
  rotateY(time * 0.0003);
  rotateX(time * 0.0001);

  // Draw stalactite formations with pulsing geometric patterns
  for (let stalactite of stalactites) {
    push();
    translate(stalactite.x, stalactite.y, stalactite.z);
    
    stroke(stalactite.color);
    noFill();
    strokeWeight(0.5);
    
    let patternTime = time * 0.02 + stalactite.x * 0.01;
    
    // Draw stalactite shape
    beginShape(LINES);
    for (let i = 0; i < stalactite.segments; i++) {
      let angle1 = map(i, 0, stalactite.segments - 1, 0, TWO_PI);
      let angle2 = map((i + 1) % stalactite.segments, 0, stalactite.segments - 1, 0, TWO_PI);
      
      let x1 = sin(angle1) * stalactite.radius;
      let y1 = cos(angle1) * stalactite.radius;
      let x2 = sin(angle2) * stalactite.radius;
      let y2 = cos(angle2) * stalactite.radius;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    // Add inner pulsing structure
    beginShape(LINES);
    for (let i = 0; i < stalactite.segments; i++) {
      let angle1 = map(i, 0, stalactite.segments - 1, 0, TWO_PI) + patternTime;
      let angle2 = map((i + 1) % stalactite.segments, 0, stalactite.segments - 1, 0, TWO_PI) + patternTime;
      
      let x1 = sin(angle1) * stalactite.radius * 0.7;
      let y1 = cos(angle1) * stalactite.radius * 0.7;
      let x2 = sin(angle2) * stalactite.radius * 0.7;
      let y2 = cos(angle2) * stalactite.radius * 0.7;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    // Draw connecting lines to form complex lattice
    beginShape(LINES);
    for (let i = 0; i < stalactite.segments; i++) {
      let angle1 = map(i, 0, stalactite.segments - 1, 0, TWO_PI) + patternTime;
      let angle2 = map((i + 1) % stalactite.segments, 0, stalactite.segments - 1, 0, TWO_PI) + patternTime;
      
      let x1 = sin(angle1) * stalactite.radius * 0.5;
      let y1 = cos(angle1) * stalactite.radius * 0.5;
      let x2 = sin(angle2) * stalactite.radius * 0.5;
      let y2 = cos(angle2) * stalactite.radius * 0.5;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    // Add cross pattern to simulate mineral pathways
    beginShape(LINES);
    for (let i = 0; i < 4; i++) {
      let angle = map(i, 0, 3, 0, TWO_PI) + patternTime * 0.5;
      let x1 = sin(angle) * stalactite.radius * 0.9;
      let y1 = cos(angle) * stalactite.radius * 0.9;
      let x2 = -sin(angle) * stalactite.radius * 0.9;
      let y2 = -cos(angle) * stalactite.radius * 0.9;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    pop();
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
