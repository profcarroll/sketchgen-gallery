let lines = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines
  for (let i = 0; i < 200; i++) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      hue: random(360),
      alpha: random(0.3, 0.7)
    });
  }
  
  // Initialize nodes
  for (let i = 0; i < 150; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      hue: random(360),
      alpha: random(0.5, 1)
    });
  }
}

function draw() {
  background(220, 20, 10); // Dark blue background
  
  time += 0.005;
  
  // Update and draw lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Animate line positions
    l.x1 += sin(time + i * 0.02) * 0.5;
    l.y1 += cos(time + i * 0.02) * 0.5;
    l.x2 += sin(time * 1.3 + i * 0.02) * 0.5;
    l.y2 += cos(time * 1.3 + i * 0.02) * 0.5;
    
    // Fade in/out
    let alpha = 0.3 + 0.4 * sin(time * 2 + i);
    stroke(l.hue, 80, 90, alpha);
    strokeWeight(1);
    line(l.x1, l.y1, l.x2, l.y2);
  }
  
  // Update and draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Animate node positions
    n.x += sin(time * 0.5 + i * 0.03) * 0.3;
    n.y += cos(time * 0.5 + i * 0.03) * 0.3;
    
    // Pulse size and brightness
    let pulse = 1 + 0.5 * sin(time * 3 + i);
    let size = n.size * pulse;
    let brightness = 70 + 20 * sin(time * 2 + i);
    
    fill(n.hue, 90, brightness, n.alpha);
    noStroke();
    ellipse(n.x, n.y, size);
  }
  
  // Connect nearby nodes with lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      
      if (d < 100) {
        let alpha = map(d, 0, 100, 0.3, 0);
        stroke(200, 50, 80, alpha);
        strokeWeight(0.5);
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
}
