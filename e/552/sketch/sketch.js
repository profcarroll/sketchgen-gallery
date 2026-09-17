let pyramids = [];
let particles = [];
let currentStream;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pyramidal structures
  for (let i = 0; i < 20; i++) {
    pyramids.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-height/2, height/2),
      size: random(30, 80),
      rotation: random(TWO_PI),
      color: color(random(180, 240), 70, 90, 0.8)
    });
  }
  
  // Create initial particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-height/2, height/2),
      size: random(1, 3),
      speed: random(0.5, 2),
      hue: random(180, 240),
      alpha: random(0.3, 0.8)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Create dynamic currents
  let currentX = sin(time * 0.5) * 0.5;
  let currentY = cos(time * 0.3) * 0.5;
  
  // Draw pyramids
  for (let pyramid of pyramids) {
    push();
    translate(pyramid.x, pyramid.y, pyramid.z);
    rotateY(pyramid.rotation);
    rotateX(PI/4);
    
    fill(pyramid.color);
    noStroke();
    
    beginShape(TRIANGLES);
    // Base
    vertex(-pyramid.size/2, 0, -pyramid.size/2);
    vertex(pyramid.size/2, 0, -pyramid.size/2);
    vertex(0, -pyramid.size, 0);
    
    vertex(pyramid.size/2, 0, -pyramid.size/2);
    vertex(pyramid.size/2, 0, pyramid.size/2);
    vertex(0, -pyramid.size, 0);
    
    vertex(pyramid.size/2, 0, pyramid.size/2);
    vertex(-pyramid.size/2, 0, pyramid.size/2);
    vertex(0, -pyramid.size, 0);
    
    vertex(-pyramid.size/2, 0, pyramid.size/2);
    vertex(-pyramid.size/2, 0, -pyramid.size/2);
    vertex(0, -pyramid.size, 0);
    
    endShape();
    pop();
  }
  
  // Update and draw particles
  beginShape(POINTS);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply current
    p.x += currentX * p.speed;
    p.y -= currentY * p.speed;
    p.z += sin(time + p.x * 0.01) * 0.5;
    
    // Update color with time
    fill(p.hue, 80, 90, p.alpha);
    
    // Add some randomness to particle movement
    p.x += sin(time + i) * 0.2;
    p.y += cos(time + i) * 0.2;
    
    // Reset particles that go too far
    if (p.y < -height/2 || abs(p.x) > width/2 || abs(p.z) > height/2) {
      p.x = random(-width/2, width/2);
      p.y = height/2;
      p.z = random(-height/2, height/2);
    }
    
    // Draw particle
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Create nodal light patterns at intersections
  if (frameCount % 10 === 0) {
    let patternPoints = [];
    for (let i = 0; i < 50; i++) {
      let x = random(-width/2, width/2);
      let y = height/2;
      let z = random(-height/2, height/2);
      
      // Create intersections between streams
      if (abs(x - currentX * 100) < 50 && abs(z - currentY * 100) < 50) {
        patternPoints.push({x, y, z});
      }
    }
    
    // Draw intersection points as bright nodes
    for (let point of patternPoints) {
      push();
      translate(point.x, point.y, point.z);
      fill(200, 100, 100, 0.8);
      noStroke();
      sphere(5);
      pop();
    }
  }
  
  // Add some subtle pulsing
  let pulse = sin(time * 2) * 0.1 + 0.9;
  ambientLight(200 * pulse, 100 * pulse, 100 * pulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
