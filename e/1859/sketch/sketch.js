let helixes = [];
let maxHelixes = 50;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize helixes
  for (let i = 0; i < maxHelixes; i++) {
    helixes.push({
      radius: 0,
      speed: random(0.5, 1.5),
      hue: map(i, 0, maxHelixes, 220, 300), // Deep blue to violet
      alpha: random(0.3, 0.7),
      angle: random(TWO_PI),
      phase: random(TWO_PI),
      turns: random(1, 4),
      spiralSpeed: random(0.02, 0.05),
      growthRate: random(0.8, 1.5)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.01;
  
  push();
  translate(centerX, centerY);
  
  // Draw expanding helixes
  for (let i = 0; i < helixes.length; i++) {
    let helix = helixes[i];
    
    // Update radius
    helix.radius += helix.speed;
    
    // Reset if too large
    if (helix.radius > max(width, height) * 1.5) {
      helix.radius = 0;
      helix.angle = random(TWO_PI);
    }
    
    // Create a pulsing effect
    let pulseRadius = helix.radius + sin(time * 2 + helix.phase) * 3;
    
    // Draw the helix pattern
    if (pulseRadius > 10) {
      let points = [];
      let segments = 100;
      
      for (let j = 0; j < segments; j++) {
        let angle = helix.angle + j * helix.spiralSpeed + time * 0.5;
        let turnAngle = (j / segments) * TWO_PI * helix.turns;
        let radius = pulseRadius * (1 - j / segments);
        
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        
        points.push({x: x, y: y});
      }
      
      // Draw the helix as a glowing line
      stroke(helix.hue, 100, 100, helix.alpha * 0.5);
      noFill();
      beginShape();
      for (let j = 0; j < points.length; j++) {
        let point = points[j];
        vertex(point.x, point.y);
      }
      endShape();
      
      // Draw connecting lines between points to form structure
      stroke(helix.hue, 100, 100, helix.alpha * 0.2);
      for (let j = 0; j < points.length - 5; j += 5) {
        let point1 = points[j];
        let point2 = points[j + 5];
        line(point1.x, point1.y, point2.x, point2.y);
      }
    }
    
    // Draw crystal-like nodes along the helix
    if (helix.radius > 10 && frameCount % 5 === 0) {
      let nodeRadius = map(helix.radius, 10, max(width, height), 3, 8);
      
      for (let j = 0; j < 8; j++) {
        let angle = helix.angle + j * TWO_PI / 8 + time * 0.5;
        let radius = helix.radius + sin(time * 2 + j) * 10;
        let nodeX = cos(angle) * radius;
        let nodeY = sin(angle) * radius;
        
        // Draw a geometric crystal node
        fill(helix.hue, 100, 100, helix.alpha);
        push();
        translate(nodeX, nodeY);
        
        rotate(time + j);
        
        // Draw a crystalline shape (hexagon)
        beginShape();
        for (let k = 0; k < 6; k++) {
          let angle = k * TWO_PI / 6;
          let x = cos(angle) * nodeRadius;
          let y = sin(angle) * nodeRadius;
          vertex(x, y);
        }
        endShape(CLOSE);
        
        pop();
      }
    }
  }
  
  // Draw central point
  fill(240, 100, 100, 0.9);
  ellipse(0, 0, 15, 15);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
