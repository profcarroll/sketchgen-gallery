let structures = [];
let pulses = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize skeletal structures
  for (let i = 0; i < 20; i++) {
    structures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(10, 40),
      hue: random(180, 240),
      segments: floor(random(3, 7)),
      angle: random(TWO_PI)
    });
  }
  
  // Initialize pulsing effects
  for (let i = 0; i < 50; i++) {
    pulses.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      radius: random(5, 20),
      speed: random(0.01, 0.03),
      intensity: random(0.5, 1)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05);
  
  // Slow camera rotation
  rotateY(time * 0.0005);
  rotateX(0.2);
  
  // Draw skeletal structures
  for (let structure of structures) {
    push();
    translate(structure.x, structure.y, structure.z);
    
    let pulse = sin(time * 0.01 + structure.angle) * 0.5 + 0.5;
    let scale = structure.size * (0.8 + pulse * 0.4);
    
    stroke(structure.hue, 70, 90, 0.6);
    noFill();
    strokeWeight(1);
    
    // Draw crystalline lattice
    for (let i = 0; i < structure.segments; i++) {
      let angle = TWO_PI * i / structure.segments;
      let x1 = cos(angle) * scale;
      let y1 = sin(angle) * scale;
      let x2 = cos(angle + PI/3) * scale;
      let y2 = sin(angle + PI/3) * scale;
      
      line(x1, y1, 0, x2, y2, 0);
    }
    
    // Draw connecting lines
    for (let j = 0; j < structure.segments; j++) {
      let angle1 = TWO_PI * j / structure.segments;
      let angle2 = TWO_PI * ((j + 1) % structure.segments) / structure.segments;
      
      let x1 = cos(angle1) * scale;
      let y1 = sin(angle1) * scale;
      let x2 = cos(angle2) * scale;
      let y2 = sin(angle2) * scale;
      
      line(x1, y1, 0, x2, y2, 0);
    }
    
    pop();
  }
  
  // Draw pulsing bioluminescent effects
  for (let pulse of pulses) {
    push();
    translate(pulse.x, pulse.y, pulse.z);
    
    let pulseValue = sin(time * pulse.speed + pulse.radius) * 0.5 + 0.5;
    let alpha = map(pulseValue, 0, 1, 0.1, 0.8);
    
    noStroke();
    fill(200, 80, 90, alpha);
    sphere(pulse.radius * pulseValue, 6, 4);
    
    pop();
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
