let particles = [];
let nodes = [];
let time = 0;
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create central nodes
  for (let i = 0; i < 5; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      radius: random(30, 80),
      color: color(random(100, 255), random(100, 255), random(200, 255), 100)
    });
  }
  
  // Create particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      ox: random(width),
      oy: random(height),
      speed: random(0.002, 0.005),
      size: random(2, 6),
      nodeIndex: floor(random(nodes.length)),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }
  
  // Precompute gradient colors
  for (let i = 0; i < 100; i++) {
    colors.push(color(
      sin(i * 0.1 + time) * 100 + 155,
      cos(i * 0.1 + time) * 100 + 155,
      sin(i * 0.05 + time) * 100 + 155
    ));
  }
}

function draw() {
  time += 0.01;
  
  // Update gradient background
  background(0);
  for (let y = 0; y < height; y += 20) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(colors[floor(inter * 99)], colors[floor((inter + 0.5) * 99) % 100], 0.5);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw connections between particles
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 100) {
        stroke(red(p1.color), green(p1.color), blue(p1.color), map(d, 0, 100, 100, 0));
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
      }
    }
  }
  endShape();
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let node = nodes[p.nodeIndex];
    
    // Move towards central node with orbital motion
    let angle = atan2(p.y - node.y, p.x - node.x);
    let orbitRadius = node.radius * (1 + sin(time * 0.5 + i) * 0.3);
    let targetX = node.x + cos(angle) * orbitRadius;
    let targetY = node.y + sin(angle) * orbitRadius;
    
    // Slowly move towards target
    p.x += (targetX - p.x) * p.speed;
    p.y += (targetY - p.y) * p.speed;
    
    // Draw particle
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
