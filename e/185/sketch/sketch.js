let shapes = [];
let colors = [];
let audioLevel = 0;
let time = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Initialize shapes with random properties
  for (let i = 0; i < 100; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      angle: random(TWO_PI),
      speed: random(0.5, 2),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(70, 100),
      shapeType: floor(random(3)) // 0: rect, 1: ellipse, 2: triangle
    });
  }
  
  // Initialize color palette
  for (let i = 0; i < 10; i++) {
    colors.push({
      h: random(360),
      s: random(70, 100),
      b: random(70, 100)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.02;
  
  // Simulate audio input
  audioLevel = sin(time * 3) * 0.5 + 0.5; // Simulated audio level
  
  // Update and draw shapes
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Move shape
    s.x += cos(s.angle) * s.speed;
    s.y += sin(s.angle) * s.speed;
    
    // Bounce off edges
    if (s.x < 0 || s.x > width) s.angle = PI - s.angle;
    if (s.y < 0 || s.y > height) s.angle = -s.angle;
    
    // Change direction occasionally
    if (random() < 0.01) {
      s.angle += random(-0.5, 0.5);
    }
    
    // Modify size based on audio
    let sizeMod = map(audioLevel, 0, 1, 0.8, 1.2);
    s.size *= sizeMod;
    s.size = constrain(s.size, 5, 100);
    
    // Update hue
    s.hue += sin(time + i) * 0.5;
    s.hue = (s.hue + 360) % 360;
    
    // Draw shape based on type
    fill(s.hue, s.saturation, s.brightness);
    
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    
    switch (s.shapeType) {
      case 0: // Rectangle
        rectMode(CENTER);
        rect(0, 0, s.size, s.size * 0.6);
        break;
      case 1: // Ellipse
        ellipse(0, 0, s.size, s.size * 0.6);
        break;
      case 2: // Triangle
        triangle(0, -s.size/2, -s.size/2, s.size/2, s.size/2, s.size/2);
        break;
    }
    
    pop();
    
    // Draw connecting lines between nearby shapes
    for (let j = i + 1; j < shapes.length; j++) {
      let other = shapes[j];
      let d = dist(s.x, s.y, other.x, other.y);
      
      if (d < 100) {
        let alpha = map(d, 0, 100, 255, 0);
        stroke(s.hue, s.saturation, s.brightness, alpha * 0.3);
        line(s.x, s.y, other.x, other.y);
      }
    }
  }
  
  // Add a pulsing effect based on audio
  let pulse = sin(time * 5) * 0.5 + 0.5;
  fill(255, 100, 100, 50 * pulse);
  ellipse(width/2, height/2, 200 + 100 * pulse, 200 + 100 * pulse);
  
  // Occasionally change color palette
  if (frameCount % 120 === 0) {
    for (let i = 0; i < colors.length; i++) {
      colors[i].h = (colors[i].h + random(30, 60)) % 360;
    }
  }
}
