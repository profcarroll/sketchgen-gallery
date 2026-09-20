let waves = [];
let circles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize seismic waves
  for (let i = 0; i < 5; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(200, 400),
      speed: random(0.5, 2),
      hue: random(280, 320)
    });
  }
  
  // Initialize fracturing circles
  for (let i = 0; i < 8; i++) {
    circles.push({
      x: width/2,
      y: height/2,
      radius: random(100, 300),
      rotation: random(TWO_PI),
      speed: random(-0.005, 0.005),
      segments: floor(random(8, 16)),
      pulse: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.02;
  
  // Update and display seismic waves
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    
    wave.radius += wave.speed;
    
    if (wave.radius > wave.maxRadius) {
      wave.radius = 0;
      wave.x = random(width);
      wave.y = random(height);
      wave.maxRadius = random(200, 400);
    }
    
    stroke(wave.hue, 80, 90, 0.3);
    noFill();
    ellipse(wave.x, wave.y, wave.radius * 2);
    
    // Add inner ripple
    if (wave.radius > 50) {
      stroke(wave.hue + 30, 60, 80, 0.1);
      ellipse(wave.x, wave.y, wave.radius * 1.5);
    }
  }
  
  // Update and display fracturing circles
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    
    circle.rotation += circle.speed;
    
    push();
    translate(circle.x, circle.y);
    rotate(circle.rotation);
    
    stroke(280, 90, 95, 0.7);
    noFill();
    
    // Draw fracturing lines
    beginShape();
    for (let j = 0; j < circle.segments; j++) {
      let angle = map(j, 0, circle.segments, 0, TWO_PI);
      let x = cos(angle) * circle.radius;
      let y = sin(angle) * circle.radius;
      
      // Add some jitter to create jagged effect
      let jitter = sin(time + j * 0.3) * 20;
      x += cos(angle) * jitter;
      y += sin(angle) * jitter;
      
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw connecting lines for fracturing effect
    stroke(290, 80, 85, 0.4);
    beginShape(LINES);
    for (let j = 0; j < circle.segments; j++) {
      let angle1 = map(j, 0, circle.segments, 0, TWO_PI);
      let angle2 = map((j + 1) % circle.segments, 0, circle.segments, 0, TWO_PI);
      
      let x1 = cos(angle1) * circle.radius;
      let y1 = sin(angle1) * circle.radius;
      let x2 = cos(angle2) * circle.radius;
      let y2 = sin(angle2) * circle.radius;
      
      vertex(x1, y1);
      vertex(x2, y2);
    }
    endShape();
    
    pop();
  }
  
  // Add some pulsing effect to the circles
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    let pulse = sin(time * circle.pulse) * 10 + 10;
    
    push();
    translate(circle.x, circle.y);
    rotate(circle.rotation);
    
    stroke(300, 95, 100, 0.2);
    noFill();
    
    ellipse(0, 0, circle.radius + pulse);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
