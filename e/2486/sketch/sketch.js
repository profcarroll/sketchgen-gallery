let nodes = [];
let pulses = [];
let gridSize = 40;
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
        baseSize: random(5, 15),
        pulsePhase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.02;
  
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
        let timeOffset = (time - p.startTime) * 2;
        pulse += sin(d * 0.02 - timeOffset) * (1 - d/300) * 0.5;
      }
    }
    
    // Node glow effect
    let size = node.baseSize + sin(time + node.pulsePhase) * 3 + pulse * 10;
    let hue = (node.hue + time * 2 + pulse * 30) % 360;
    let saturation = 80 + sin(time * 0.5 + pulse) * 20;
    let lightness = 50 + sin(time * 0.7 + pulse) * 30;
    
    fill(hue, saturation, lightness, 0.8);
    ellipse(node.x, node.y, size, size);
  }
  
  // Draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    let age = time - p.startTime;
    
    if (age > 5) {
      pulses.splice(i, 1);
    } else {
      let alpha = map(age, 0, 5, 0.8, 0);
      let radius = age * 50;
      
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
  if (random() < 0.3) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].pulsePhase += random(TWO_PI);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
