let spirals = [];
let maxSpirals = 15;
let triggered = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
  
  // Initialize spirals
  for (let i = 0; i < maxSpirals; i++) {
    spirals.push({
      center: createVector(0, 0, 0),
      radius: random(50, 200),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      hue: random(200, 240), // Deep blue to cool green
      alpha: random(0.3, 0.8),
      segments: [],
      age: 0,
      maxAge: random(200, 400),
      active: false
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  if (!triggered) {
    // Initial dark state - no motion
    return;
  }
  
  let time = frameCount * 0.02;
  
  // Center the view
  translate(0, 0, -500);
  
  // Draw all spirals
  for (let i = 0; i < spirals.length; i++) {
    let s = spirals[i];
    
    if (!s.active) {
      // Activate some spirals randomly
      if (random() < 0.001) {
        s.active = true;
        s.age = 0;
      }
      continue;
    }
    
    // Update spiral parameters
    s.angle += s.speed;
    s.age++;
    
    // Reset if too old
    if (s.age > s.maxAge) {
      s.active = false;
      s.age = 0;
      s.radius = random(50, 200);
      s.hue = random(200, 240);
      s.center.set(random(-100, 100), random(-100, 100), random(-100, 100));
    }
    
    // Build segments
    let segments = [];
    let numSegments = min(200, s.age * 2);
    for (let j = 0; j < numSegments; j++) {
      let t = map(j, 0, numSegments - 1, 0, TWO_PI * 4); // 4 full rotations
      let r = map(j, 0, numSegments - 1, s.radius, 0);
      let x = cos(s.angle + t) * r;
      let y = sin(s.angle + t) * r;
      let z = sin(t * 0.5) * 50; // Add some depth variation
      segments.push(createVector(x, y, z));
    }
    
    // Draw the spiral as a line
    beginShape();
    for (let j = 0; j < segments.length; j++) {
      let v = segments[j];
      fill(s.hue, 100, 100, s.alpha);
      vertex(v.x, v.y, v.z);
    }
    endShape();
    
    // Draw glowing points along the spiral
    if (s.age > 50) {
      beginShape(POINTS);
      for (let j = 0; j < segments.length; j += 10) {
        let v = segments[j];
        fill(s.hue, 100, 100, s.alpha);
        vertex(v.x, v.y, v.z);
      }
      endShape();
    }
  }
}

function mousePressed() {
  triggered = true;
  noLoop(); // Stop animation after initial trigger
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
