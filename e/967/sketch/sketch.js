let nodes = [];
let waves = [];
const nodeCount = 100;
const maxRadius = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize nodes in a grid
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      radius: random(2, 6),
      hue: random(360),
      active: false,
      pulse: 0,
      waveRadius: 0
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw and update waves
  for (let i = waves.length - 1; i >= 0; i--) {
    const w = waves[i];
    w.radius += w.speed;
    w.alpha -= 0.02;
    
    noFill();
    stroke(w.hue, 100, 100, w.alpha);
    ellipse(w.x, w.y, w.radius * 2);
    
    if (w.alpha <= 0) {
      waves.splice(i, 1);
    }
  }
  
  // Draw and update nodes
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    if (n.active) {
      n.pulse += 0.05;
      n.waveRadius += 0.5;
      
      // Draw expanding wave
      noFill();
      stroke(n.hue, 100, 100, 0.5);
      ellipse(n.x, n.y, n.waveRadius * 2);
      
      // Reset if too big
      if (n.waveRadius > maxRadius) {
        n.active = false;
        n.waveRadius = 0;
      }
    } else {
      n.pulse = 0;
    }
    
    // Draw node
    fill(n.hue, 100, 100, 0.7);
    noStroke();
    ellipse(n.x, n.y, n.radius + sin(n.pulse) * 2);
  }
}

function mousePressed() {
  // Start audio on first click
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }
  
  // Create a chord effect from center
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Activate nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const d = dist(n.x, n.y, centerX, centerY);
    
    if (d < maxRadius * 3) {
      n.active = true;
      n.waveRadius = 0;
      
      // Add wave
      waves.push({
        x: centerX,
        y: centerY,
        radius: 0,
        speed: random(1, 3),
        alpha: 1,
        hue: n.hue
      });
    }
  }
}
