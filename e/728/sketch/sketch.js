let shapes = [];
let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create base shapes with jewel tones and pastels
  for (let i = 0; i < 150; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      color: color(random([255, 0, 100], [0, 255, 150], [0, 100, 255], [255, 200, 0], [200, 0, 200], [0, 200, 200], [255, 100, 100], [100, 100, 255])),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
  
  // Create vein network
  for (let i = 0; i < 300; i++) {
    veins.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      opacity: random(30, 80),
      speed: random(0.002, 0.008)
    });
  }
}

function draw() {
  background(20);
  
  time += 0.01;
  
  // Draw veins
  for (let i = 0; i < veins.length; i++) {
    let v = veins[i];
    
    fill(255, 255, 255, v.opacity);
    ellipse(v.x + sin(time * v.speed) * 10, v.y + cos(time * v.speed) * 10, v.size);
    
    // Draw connections between nearby veins
    for (let j = i + 1; j < veins.length; j++) {
      let other = veins[j];
      let d = dist(v.x, v.y, other.x, other.y);
      
      if (d < 150) {
        stroke(255, 255, 255, map(d, 0, 150, 30, 0));
        line(v.x + sin(time * v.speed) * 10, v.y + cos(time * v.speed) * 10,
              other.x + sin(time * other.speed) * 10, other.y + cos(time * other.speed) * 10);
      }
    }
  }
  
  // Draw shapes with subtle breathing animation
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Animate shape size and rotation
    let size = s.size + sin(time * s.speed) * 5;
    let angle = s.angle + sin(time * s.speed * 0.5) * 0.1;
    
    push();
    translate(s.x, s.y);
    rotate(angle);
    
    fill(s.color);
    ellipse(0, 0, size, size);
    
    // Add a subtle glow effect
    fill(red(s.color), green(s.color), blue(s.color), 30);
    ellipse(0, 0, size * 1.5, size * 1.5);
    
    pop();
  }
  
  // Occasionally add new shapes for organic growth
  if (frameCount % 60 === 0 && shapes.length < 200) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      color: color(random([255, 0, 100], [0, 255, 150], [0, 100, 255], [255, 200, 0], [200, 0, 200], [0, 200, 200], [255, 100, 100], [100, 100, 255])),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
