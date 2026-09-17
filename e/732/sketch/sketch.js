let particles = [];
const numParticles = 300;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      angle: random(TWO_PI),
      radius: random(100, 300),
      speed: random(0.005, 0.015),
      color: color(random(100, 255), random(100, 255), random(200, 255), 180),
      trail: [],
      trailLength: 50,
      isElliptical: false,
      ellipticalTime: 0,
      ellipticalDuration: random(60, 120)
    });
  }
}

function draw() {
  background(10, 10, 30);
  
  time += 0.01;
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update angle
    if (!p.isElliptical) {
      p.angle += p.speed;
    } else {
      p.ellipticalTime++;
      if (p.ellipticalTime > p.ellipticalDuration) {
        p.isElliptical = false;
        p.ellipticalTime = 0;
      }
      
      // Create elliptical motion
      let ellipseAngle = map(p.ellipticalTime, 0, p.ellipticalDuration, 0, TWO_PI);
      let eccentricity = 0.7;
      p.radius = map(cos(ellipseAngle), -1, 1, 150, 400) * (1 + eccentricity * sin(ellipseAngle));
    }
    
    // Occasionally trigger elliptical path
    if (!p.isElliptical && random() < 0.002) {
      p.isElliptical = true;
      p.ellipticalTime = 0;
      p.ellipticalDuration = random(60, 120);
    }
    
    // Calculate position
    let x = centerX + cos(p.angle) * p.radius;
    let y = centerY + sin(p.angle) * p.radius;
    
    // Update trail
    p.trail.push({x, y});
    if (p.trail.length > p.trailLength) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.color);
    strokeWeight(1.5);
    beginShape();
    for (let j = 0; j < p.trail.length; j++) {
      let alpha = map(j, 0, p.trail.length, 0, 255);
      stroke(red(p.color), green(p.color), blue(p.color), alpha);
      vertex(p.trail[j].x, p.trail[j].y);
    }
    endShape();
    
    // Draw particle
    noStroke();
    fill(p.color);
    ellipse(x, y, 4, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
