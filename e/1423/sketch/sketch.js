let streams = [];
let numStreams = 12;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create helical streams with fewer segments for performance
  for (let i = 0; i < numStreams; i++) {
    streams.push({
      phase: random(TWO_PI),
      speed: random(0.003, 0.012),
      radius: random(150, 300),
      height: random(400, 700),
      turns: random(4, 10),
      width: random(10, 25),
      hue: random(180, 300)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement for depth effect
  let camX = sin(time * 0.15) * 600;
  let camY = cos(time * 0.1) * 400;
  camera(camX, camY, 800, 0, 0, 0, 0, 1, 0);
  
  // Draw streams
  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];
    
    push();
    rotateY(time * s.speed);
    rotateX(time * s.speed * 0.7);
    
    // Create ribbon-like structure with crystalline edges
    beginShape(QUAD_STRIP);
    noStroke();
    fill(s.hue, 80, 100, 0.7);
    
    let segments = 60; // Reduced for performance
    for (let j = 0; j <= segments; j++) {
      let t = map(j, 0, segments, 0, s.turns * TWO_PI);
      let x = cos(t + s.phase) * s.radius;
      let y = sin(t + s.phase) * s.radius;
      let z = map(j, 0, segments, -s.height/2, s.height/2);
      
      // Create width variation for ribbon effect
      let widthOffset = sin(t * 3 + time) * s.width * 0.5;
      let x1 = cos(t + s.phase) * (s.radius + widthOffset);
      let y1 = sin(t + s.phase) * (s.radius + widthOffset);
      
      vertex(x, y, z);
      vertex(x1, y1, z);
    }
    endShape();
    
    // Add inner glow
    fill(s.hue, 100, 100, 0.15);
    beginShape(QUAD_STRIP);
    for (let j = 0; j <= segments; j++) {
      let t = map(j, 0, segments, 0, s.turns * TWO_PI);
      let x = cos(t + s.phase) * s.radius;
      let y = sin(t + s.phase) * s.radius;
      let z = map(j, 0, segments, -s.height/2, s.height/2);
      
      // Inner core
      let innerRadius = s.radius * 0.5;
      let x1 = cos(t + s.phase) * innerRadius;
      let y1 = sin(t + s.phase) * innerRadius;
      
      vertex(x, y, z);
      vertex(x1, y1, z);
    }
    endShape();
    
    pop();
  }
  
  // Add subtle particle effects with fewer particles
  beginShape(POINTS);
  noStroke();
  fill(200, 80, 100, 0.4);
  let particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    let angle = time * 0.5 + i * 0.3;
    let radius = 350 + sin(time * 0.6 + i) * 120;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.3 + i) * 250;
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
