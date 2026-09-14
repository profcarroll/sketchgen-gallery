let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize the lattice with lines
  for (let i = 0; i < 200; i++) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      opacity: random(50, 200),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 20);
  
  time += 0.01;
  
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Pulsate opacity
    let pulse = sin(time * l.speed + l.phase) * 0.5 + 0.5;
    let currentOpacity = l.opacity * pulse;
    
    // Occasionally break connectivity (gaps)
    let gapChance = 0.001;
    if (random() < gapChance) {
      continue; // Skip drawing this line segment
    }
    
    stroke(100, 200, 255, currentOpacity);
    strokeWeight(1);
    line(l.x1, l.y1, l.x2, l.y2);
    
    // Slight movement to create shimmering effect
    l.x1 += sin(time * 0.5 + i) * 0.1;
    l.y1 += cos(time * 0.3 + i) * 0.1;
    l.x2 += sin(time * 0.7 + i) * 0.1;
    l.y2 += cos(time * 0.4 + i) * 0.1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
