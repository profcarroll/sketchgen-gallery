let cables = [];
let pulses = [];
let copperWires = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create glass fiber optic cables
  for (let i = 0; i < 80; i++) {
    let x = random(width);
    let y = random(height);
    let length = random(80, 200);
    let angle = random(TWO_PI);
    let segments = [];
    
    // Create cable segments
    for (let j = 0; j < 15; j++) {
      segments.push({
        x: x + cos(angle) * j * (length / 15),
        y: y + sin(angle) * j * (length / 15),
        radius: random(1.5, 3)
      });
    }
    
    cables.push({
      segments: segments,
      angle: angle,
      x: x,
      y: y
    });
  }
  
  // Create copper wires
  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let y = random(height);
    let length = random(100, 250);
    let angle = random(TWO_PI);
    
    copperWires.push({
      x: x,
      y: y,
      length: length,
      angle: angle
    });
  }
}

function draw() {
  background(240, 10, 10); // Dark gray background
  
  // Draw copper wires
  for (let wire of copperWires) {
    stroke(30, 30, 50);
    strokeWeight(1.5);
    line(wire.x, wire.y, 
         wire.x + cos(wire.angle) * wire.length,
         wire.y + sin(wire.angle) * wire.length);
  }
  
  // Draw fiber optic cables
  for (let cable of cables) {
    // Draw cable core (glass)
    for (let i = 0; i < cable.segments.length - 1; i++) {
      let seg1 = cable.segments[i];
      let seg2 = cable.segments[i + 1];
      
      stroke(180, 50, 90, 0.7);
      strokeWeight(seg1.radius * 0.8);
      line(seg1.x, seg1.y, seg2.x, seg2.y);
    }
    
    // Draw cable outer sheath (clear)
    for (let i = 0; i < cable.segments.length - 1; i++) {
      let seg1 = cable.segments[i];
      let seg2 = cable.segments[i + 1];
      
      stroke(200, 20, 95, 0.2);
      strokeWeight(seg1.radius * 1.8);
      line(seg1.x, seg1.y, seg2.x, seg2.y);
    }
  }
  
  // Add digital pulses
  for (let i = 0; i < 3; i++) {
    if (random() < 0.1) {
      pulses.push({
        x: random(width),
        y: random(height),
        size: random(2, 8),
        alpha: 1,
        speed: random(0.5, 2)
      });
    }
  }
  
  // Update and draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let pulse = pulses[i];
    
    pulse.alpha -= 0.02;
    pulse.size += pulse.speed;
    
    if (pulse.alpha <= 0) {
      pulses.splice(i, 1);
    } else {
      fill(180, 80, 95, pulse.alpha);
      noStroke();
      ellipse(pulse.x, pulse.y, pulse.size);
    }
  }
  
  // Draw subtle connections between cables
  for (let i = 0; i < cables.length - 1; i++) {
    let c1 = cables[i];
    let c2 = cables[i + 1];
    
    if (dist(c1.x, c1.y, c2.x, c2.y) < 150) {
      stroke(200, 30, 80, 0.1);
      strokeWeight(0.3);
      line(c1.x, c1.y, c2.x, c2.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
