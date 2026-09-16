let hexagonPoints = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create hexagon points
  let radius = min(width, height) * 0.4;
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6 - PI/2;
    hexagonPoints.push(createVector(
      width/2 + cos(angle) * radius,
      height/2 + sin(angle) * radius
    ));
  }
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(1, 3),
      color: color(random(50, 200), random(100, 255), random(150, 255), 180)
    });
  }
}

function draw() {
  background(10, 15, 25);
  
  time += 0.01;
  
  // Draw hexagon boundary
  push();
  stroke(200, 230, 255, 80);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of hexagonPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  pop();
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Boundary check - wrap around hexagon
    if (!isInsideHexagon(p.pos)) {
      p.pos.x = random(width);
      p.pos.y = random(height);
    }
    
    // Particle interaction - pulsing effect
    let pulse = sin(time * 2 + i * 0.1) * 0.5 + 0.5;
    let size = p.size * (1 + pulse * 0.5);
    
    // Color transition from emerald to amethyst
    let r = map(pulse, 0, 1, 30, 120);
    let g = map(pulse, 0, 1, 180, 100);
    let b = map(pulse, 0, 1, 100, 200);
    p.color = color(r, g, b, 180);
    
    // Draw particle
    push();
    fill(p.color);
    noStroke();
    ellipse(p.pos.x, p.pos.y, size);
    pop();
  }
  
  // Draw connecting lines between nearby particles
  let maxDist = 60;
  beginShape(LINES);
  stroke(200, 230, 255, 40);
  strokeWeight(0.5);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].pos.x, particles[i].pos.y,
                  particles[j].pos.x, particles[j].pos.y);
      if (d < maxDist) {
        vertex(particles[i].pos.x, particles[i].pos.y);
        vertex(particles[j].pos.x, particles[j].pos.y);
      }
    }
  }
  endShape();
  
  // Add central pulsing effect
  let pulseRadius = 30 + sin(time * 3) * 10;
  push();
  noFill();
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  ellipse(width/2, height/2, pulseRadius * 2);
  pop();
}

function isInsideHexagon(point) {
  let x = point.x;
  let y = point.y;
  
  // Use ray casting algorithm
  let inside = false;
  for (let i = 0, j = hexagonPoints.length - 1; i < hexagonPoints.length; j = i++) {
    let xi = hexagonPoints[i].x;
    let yi = hexagonPoints[i].y;
    let xj = hexagonPoints[j].x;
    let yj = hexagonPoints[j].y;
    
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
