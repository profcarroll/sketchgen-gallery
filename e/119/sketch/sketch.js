let drones = [];
let patterns = [];
let time = 0;
let clickCount = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial drones
  for (let i = 0; i < 20; i++) {
    drones.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      hue: random(360),
      size: random(2, 6),
      trail: []
    });
  }
  
  // Create initial patterns
  for (let i = 0; i < 5; i++) {
    patterns.push({
      x: random(width),
      y: random(height),
      radius: random(50, 200),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(20, 10, 5);
  
  // Draw harbor
  fill(10, 20, 15);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);
  
  // Draw city skyline
  for (let i = 0; i < 20; i++) {
    let x = map(i, 0, 19, 0, width);
    let h = random(50, 200);
    fill(240, 30, 20);
    rect(x, height - h, 20, h);
  }
  
  // Update and draw patterns
  for (let pattern of patterns) {
    pattern.angle += pattern.speed;
    
    // Draw pattern
    push();
    translate(pattern.x, pattern.y);
    rotate(pattern.angle);
    strokeWeight(1);
    noFill();
    stroke(pattern.hue, 80, 90, 0.7);
    ellipse(0, 0, pattern.radius * 2, pattern.radius);
    
    // Add light bursts
    if (frameCount % 30 === 0) {
      stroke(pattern.hue, 100, 100, 0.9);
      line(0, -pattern.radius/2, 0, pattern.radius/2);
    }
    pop();
    
    // Add new drones occasionally
    if (frameCount % 100 === 0) {
      drones.push({
        x: pattern.x,
        y: pattern.y,
        speed: random(0.5, 2),
        angle: pattern.angle + random(-0.5, 0.5),
        hue: pattern.hue,
        size: random(2, 6),
        trail: []
      });
    }
  }
  
  // Update and draw drones
  for (let i = drones.length - 1; i >= 0; i--) {
    let d = drones[i];
    
    // Add current position to trail
    d.trail.push({x: d.x, y: d.y});
    if (d.trail.length > 15) {
      d.trail.shift();
    }
    
    // Update position
    d.x += cos(d.angle) * d.speed;
    d.y += sin(d.angle) * d.speed;
    
    // Bounce off edges
    if (d.x < 0 || d.x > width || d.y < 0 || d.y > height) {
      d.angle += PI + random(-0.5, 0.5);
    }
    
    // Mouse interaction
    let mouseDist = dist(d.x, d.y, mouseX, mouseY);
    if (mouseDist < 100) {
      let force = map(mouseDist, 0, 100, 2, 0);
      d.angle += (mouseX - d.x) * 0.0005 * force;
    }
    
    // Click interaction
    if (clickCount > 0 && frameCount % 10 === 0) {
      let clickDist = dist(d.x, d.y, width/2, height/2);
      if (clickDist < 300) {
        d.angle += random(-0.5, 0.5);
      }
    }
    
    // Draw trail
    noFill();
    strokeWeight(1);
    stroke(d.hue, 80, 90, 0.4);
    beginShape();
    for (let pos of d.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw drone
    fill(d.hue, 100, 100);
    noStroke();
    ellipse(d.x, d.y, d.size, d.size);
    
    // Add light burst occasionally
    if (frameCount % 50 === 0) {
      stroke(d.hue, 100, 100, 0.8);
      line(d.x - d.size/2, d.y, d.x + d.size/2, d.y);
    }
    
    // Remove drones that are too far off-screen
    if (d.x < -50 || d.x > width + 50 || d.y < -50 || d.y > height + 50) {
      drones.splice(i, 1);
    }
  }
  
  time++;
}

function mouseDragged() {
  // Change pattern formation on drag
  for (let pattern of patterns) {
    pattern.x += (mouseX - pmouseX) * 0.1;
    pattern.y += (mouseY - pmouseY) * 0.1;
  }
}

function mouseClicked() {
  clickCount++;
  
  // Create a burst of new drones on click
  for (let i = 0; i < 10; i++) {
    drones.push({
      x: width/2,
      y: height/2,
      speed: random(1, 3),
      angle: random(TWO_PI),
      hue: random(360),
      size: random(2, 6),
      trail: []
    });
  }
}
