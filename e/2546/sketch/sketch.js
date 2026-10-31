let nodes = [];
let pulses = [];
let gridSize = 30;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create grid of nodes
  for (let x = gridSize; x < width; x += gridSize) {
    for (let y = gridSize; y < height; y += gridSize) {
      nodes.push({
        x: x,
        y: y,
        hue: random(360),
        baseSize: random(8, 20),
        pulsePhase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.015;
  
  // Draw pulsing field
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    
    // Base pulse from central point
    let dx = node.x - width/2;
    let dy = node.y - height/2;
    let distance = sqrt(dx*dx + dy*dy);
    
    // Calculate pulse effect
    let pulse = 0;
    for (let j = 0; j < pulses.length; j++) {
      let p = pulses[j];
      let d = dist(p.x, p.y, node.x, node.y);
      if (d < 300) {
        let timeOffset = (time - p.startTime) * 2.5;
        pulse += sin(d * 0.02 - timeOffset) * (1 - d/300) * 0.7;
      }
    }
    
    // Node glow effect
    let size = node.baseSize + sin(time + node.pulsePhase) * 4 + pulse * 15;
    let hue = (node.hue + time * 2.5 + pulse * 40) % 360;
    let saturation = 85 + sin(time * 0.6 + pulse) * 15;
    let lightness = 45 + sin(time * 0.8 + pulse) * 35;
    
    fill(hue, saturation, lightness, 0.7);
    ellipse(node.x, node.y, size, size);
  }
  
  // Draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    let age = time - p.startTime;
    
    if (age > 4.5) {
      pulses.splice(i, 1);
    } else {
      let alpha = map(age, 0, 4.5, 0.9, 0);
      let radius = age * 60;
      
      stroke(p.hue, 100, 100, alpha);
      noFill();
      ellipse(p.x, p.y, radius * 2, radius * 2);
    }
  }
}

function mousePressed() {
  // Add new pulse at click location
  pulses.push({
    x: mouseX,
    y: mouseY,
    startTime: time,
    hue: random(360)
  });
  
  // Occasionally amplify existing patterns
  if (random() < 0.4) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].pulsePhase += random(TWO_PI);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
