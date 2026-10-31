let chimneys = [];
let bioluminescentForms = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create chimney structures
  for (let i = 0; i < 8; i++) {
    chimneys.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-600, -300),
      baseRadius: random(40, 80),
      height: random(150, 300),
      segments: 12,
      hue: random(200, 220) // cyan to blue
    });
  }

  // Create bioluminescent forms on chimneys
  for (let i = 0; i < 40; i++) {
    bioluminescentForms.push({
      x: 0,
      y: 0,
      z: 0,
      size: random(5, 15),
      hue: random(60, 90), // emerald to cyan
      alpha: random(0.7, 1),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);

  // Add ambient light for deep ocean feel
  ambientLight(30);
  
  // Add directional light to highlight structures
  pointLight(100, 100, 100, 0, -height/2, 0);

  // Draw chimneys
  for (let chimney of chimneys) {
    push();
    translate(chimney.x, chimney.y, chimney.z);
    
    // Draw chimney structure with mineral deposits
    noStroke();
    fill(chimney.hue, 30, 40, 1);
    
    // Base
    push();
    rotateX(PI/2);
    cylinder(chimney.baseRadius, chimney.segments);
    pop();
    
    // Shaft
    push();
    translate(0, -chimney.height/2, 0);
    cylinder(chimney.baseRadius * 0.8, chimney.segments);
    pop();
    
    // Top structure with mineral deposits
    push();
    translate(0, -chimney.height/2, 0);
    rotateX(PI/2);
    cylinder(chimney.baseRadius * 1.2, chimney.segments);
    pop();
    
    pop();
  }

  // Draw bioluminescent forms
  for (let form of bioluminescentForms) {
    // Calculate pulsing effect
    let pulse = sin(frameCount * form.pulseSpeed + form.pulsePhase) * 0.5 + 0.5;
    let size = form.size * pulse;
    
    // Position form on chimney surface
    let chimney = chimneys[Math.floor(random(chimneys.length))];
    let angle = random(TWO_PI);
    let radius = random(0, chimney.baseRadius * 0.8);
    let x = cos(angle) * radius;
    let y = random(-chimney.height/2, chimney.height/2);
    let z = random(-chimney.baseRadius * 0.5, chimney.baseRadius * 0.5);

    push();
    translate(chimney.x + x, chimney.y + y, chimney.z + z);
    
    // Glow effect
    noStroke();
    fill(form.hue, 100, 100, form.alpha);
    sphere(size);
    
    // Add inner core for more glow
    fill(form.hue, 100, 100, form.alpha * 0.5);
    sphere(size * 0.6);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
