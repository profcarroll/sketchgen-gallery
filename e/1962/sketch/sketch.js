let circles = [];
let filaments = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize floating circles
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(50, 300),
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      hue: random(200, 260),
      alpha: random(0.02, 0.08),
      age: random(TWO_PI)
    });
  }
  
  // Initialize starfield
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      brightness: random(70, 100),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI),
      driftX: random(-0.2, 0.2),
      driftY: random(-0.2, 0.2)
    });
  }
  
  // Initialize filament webbing
  for (let i = 0; i < 300; i++) {
    filaments.push({
      points: [],
      hue: random(220, 240),
      alpha: random(0.05, 0.15),
      speed: random(0.001, 0.003),
      age: random(TWO_PI)
    });
  }
  
  // Seed random for consistent motion
  randomSeed(999);
}

function draw() {
  background(220, 10, 5); // Deep space blue

  // Update and draw circles
  for (let circle of circles) {
    circle.x += circle.speedX;
    circle.y += circle.speedY;
    
    // Wrap around screen edges
    if (circle.x < -circle.size) circle.x = width + circle.size;
    if (circle.x > width + circle.size) circle.x = -circle.size;
    if (circle.y < -circle.size) circle.y = height + circle.size;
    if (circle.y > height + circle.size) circle.y = -circle.size;
    
    // Pulsing glow effect
    let pulse = sin(circle.age) * 0.5 + 0.5;
    circle.age += 0.01;
    
    noFill();
    stroke(circle.hue, 30, 90, circle.alpha * pulse);
    ellipse(circle.x, circle.y, circle.size * (1 + pulse * 0.5));
  }

  // Draw and update filaments
  for (let filament of filaments) {
    if (filament.points.length === 0) {
      // Initialize points
      let x = random(width);
      let y = random(height);
      for (let i = 0; i < 15; i++) {
        filament.points.push({x, y, age: 0});
        x += random(-20, 20);
        y += random(-20, 20);
      }
    } else {
      // Animate points
      for (let point of filament.points) {
        point.x += random(-0.5, 0.5);
        point.y += random(-0.5, 0.5);
        point.age += filament.speed;
      }
      
      // Remove old points and add new ones
      if (random() < 0.1) {
        filament.points.shift();
        let last = filament.points[filament.points.length - 1];
        filament.points.push({
          x: last.x + random(-20, 20),
          y: last.y + random(-20, 20),
          age: 0
        });
      }
    }

    // Draw filament
    stroke(filament.hue, 50, 90, filament.alpha);
    noFill();
    beginShape();
    for (let point of filament.points) {
      curveVertex(point.x, point.y);
    }
    endShape();
    
    // Add subtle pulsing light effect
    if (frameCount % 30 === 0) {
      stroke(filament.hue, 50, 100, filament.alpha * 0.3);
      beginShape();
      for (let point of filament.points) {
        curveVertex(point.x + sin(point.age) * 2, point.y + cos(point.age) * 2);
      }
      endShape();
    }
  }

  // Draw stars
  noStroke();
  for (let star of stars) {
    let pulse = sin(frameCount * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
    fill(60, 100, star.brightness + pulse * 20, 1);
    
    // Drift counter-current
    star.x += star.driftX;
    star.y += star.driftY;
    
    // Wrap around screen edges
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;
    
    ellipse(star.x, star.y, star.size + pulse * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
