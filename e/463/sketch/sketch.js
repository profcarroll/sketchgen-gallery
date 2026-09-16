let particles = [];
let connections = [];
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Create particles with orbital paths
  for (let i = 0; i < 150; i++) {
    let angle = random(TWO_PI);
    let radius = random(100, 300);
    let orbitRadius = random(50, 150);
    let speed = random(0.005, 0.02);
    let size = random(2, 6);
    
    particles.push({
      angle: angle,
      radius: radius,
      orbitRadius: orbitRadius,
      speed: speed,
      size: size,
      hue: random(180, 240),
      orbitHue: random(240, 300)
    });
  }
}

function draw() {
  background(10, 10, 25);
  
  time += 0.005;
  
  // Draw gradients
  drawGradients();
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update orbital position
    p.angle += p.speed;
    
    // Calculate position
    let x = centerX + cos(p.angle) * p.orbitRadius;
    let y = centerY + sin(p.angle) * p.orbitRadius;
    
    // Add some slow rotation to the orbit
    let orbitX = centerX + cos(p.angle + time * 0.2) * p.radius;
    let orbitY = centerY + sin(p.angle + time * 0.2) * p.radius;
    
    // Draw particle with pulsing effect
    fill(p.hue, 80, 90, 150);
    noStroke();
    ellipse(orbitX, orbitY, p.size + sin(time * 3 + i) * 2);
    
    // Draw orbit trail
    stroke(p.orbitHue, 60, 70, 50);
    strokeWeight(0.5);
    line(centerX, centerY, orbitX, orbitY);
  }
  
  // Connect nearby particles with lines
  connections = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      
      // Calculate orbital positions
      let x1 = centerX + cos(p1.angle) * p1.orbitRadius;
      let y1 = centerY + sin(p1.angle) * p1.orbitRadius;
      let x2 = centerX + cos(p2.angle) * p2.orbitRadius;
      let y2 = centerY + sin(p2.angle) * p2.orbitRadius;
      
      let d = dist(x1, y1, x2, y2);
      
      if (d < 150) {
        connections.push({x1, y1, x2, y2, distance: d});
      }
    }
  }
  
  // Draw connections with pulsing effect
  for (let i = 0; i < min(connections.length, 300); i++) {
    let c = connections[i];
    
    // Calculate pulse intensity based on distance and time
    let pulse = sin(time * 2 + i) * 0.5 + 0.5;
    let alpha = map(c.distance, 0, 150, 100, 20) * pulse;
    
    stroke(200, 80, 90, alpha);
    strokeWeight(0.5);
    line(c.x1, c.y1, c.x2, c.y2);
  }
}

function drawGradients() {
  // Draw subtle background gradients
  for (let i = 0; i < 5; i++) {
    let h = map(i, 0, 4, 200, 260) + sin(time * 0.1 + i) * 10;
    let s = 30 + sin(time * 0.05 + i) * 10;
    let l = 10 + sin(time * 0.02 + i) * 5;
    
    noStroke();
    fill(h, s, l, 10);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let x = centerX + cos(a + time * 0.02) * (width * 0.6 + i * 30);
      let y = centerY + sin(a + time * 0.02) * (height * 0.6 + i * 30);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
