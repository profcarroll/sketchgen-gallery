let fungi = [];
const NUM_FUNGI = 150;
const CONCRETE_COLOR = [30, 35, 40];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create bioluminescent fungi with synchronized radial oscillation
  for (let i = 0; i < NUM_FUNGI; i++) {
    fungi.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.006),
      radius: random(150, 400),
      baseHeight: random(-200, 200),
      color: color(random(100, 255), random(150, 255), random(200, 255), 200),
      pulseSpeed: random(0.01, 0.03),
      pulseScale: random(0.8, 1.2)
    });
  }
}

function draw() {
  background(CONCRETE_COLOR[0], CONCRETE_COLOR[1], CONCRETE_COLOR[2]);
  
  // Center the scene
  translate(0, 0, -500);
  
  // Add ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 1000);
  
  // Draw fungi with synchronized oscillation
  for (let i = 0; i < fungi.length; i++) {
    let f = fungi[i];
    
    // Synchronized radial motion
    let time = millis() * 0.001;
    let angle = f.angle + time * f.speed;
    
    // Calculate position in circular pattern
    let x = sin(angle) * f.radius;
    let y = cos(angle) * f.radius;
    let z = f.baseHeight + sin(angle * 0.7) * 50;
    
    // Radial oscillation for fungal growth
    let pulse = sin(time * f.pulseSpeed) * f.pulseScale;
    let scale = 1 + pulse * 0.3;
    
    push();
    translate(x, y, z);
    
    // Rotate fungi to face the center
    rotateY(angle + PI/2);
    
    // Draw glowing fungal structure
    fill(f.color);
    noStroke();
    
    // Create bioluminescent effect with pulsing
    let brightness = map(pulse, -1, 1, 0.5, 1.5);
    tint(red(f.color), green(f.color), blue(f.color), 200 * brightness);
    
    // Draw a radial, organic shape (simplified for performance)
    beginShape();
    for (let j = 0; j < 8; j++) {
      let a = map(j, 0, 8, 0, TWO_PI);
      let r = 50 * scale;
      let px = cos(a) * r;
      let py = sin(a) * r;
      vertex(px, py, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add subtle energy points at intersections
  if (frameCount % 45 === 0) {
    let x = random(-width/3, width/3);
    let y = random(-height/3, height/3);
    let z = random(-200, 200);
    
    fill(255, 255, 255, 100);
    noStroke();
    push();
    translate(x, y, z);
    sphere(2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
