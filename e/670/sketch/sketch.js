let shapes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of interlocking organic shapes
  for (let i = 0; i < 150; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      color: color(
        random(30, 100), // R
        random(40, 90),  // G
        random(80, 150), // B
        random(180, 220)
      ),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      sway: random(0.5, 2.0)
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  time += 0.005;
  
  // Draw interwoven layers
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    
    // Slowly shift color hue over time
    let h = hue(s.color);
    let newHue = (h + sin(time * s.speed) * 2) % 360;
    s.color = color(newHue, saturation(s.color), brightness(s.color), alpha(s.color));
    
    // Animate position and rotation
    let x = s.x + sin(time * s.sway) * 10;
    let y = s.y + cos(time * s.sway * 0.7) * 10;
    let angle = s.angle + sin(time * s.speed * 0.5) * 0.02;
    
    push();
    translate(x, y);
    rotate(angle);
    
    // Draw organic shape with depth
    fill(s.color);
    drawOrganicShape(s.size);
    
    pop();
  }
}

function drawOrganicShape(size) {
  // Create a multi-layered organic form that suggests interwoven threads
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let r = size * (0.8 + 0.2 * sin(time * 3 + i));
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Inner layer with different color
  fill(lerpColor(color(255), color(0), 0.7));
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let r = size * 0.4 * (0.9 + 0.1 * cos(time * 2 + i));
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
