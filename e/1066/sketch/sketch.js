let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create overlapping planes with different colors and blur effects
  for (let i = 0; i < 8; i++) {
    planes.push({
      color: color(
        random(100, 255),
        random(50, 200),
        random(100, 255),
        180
      ),
      speed: random(0.002, 0.005),
      amplitude: random(20, 60),
      frequency: random(0.005, 0.02),
      y: random(height)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw each plane with wave motion
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    fill(p.color);
    
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      // Create wave pattern using sine and cosine
      let y = p.y + 
              sin(x * p.frequency + time * p.speed) * p.amplitude +
              cos(x * p.frequency * 0.7 + time * p.speed * 0.8) * p.amplitude * 0.5;
      
      vertex(x, y);
    }
    
    // Close the shape to the bottom of the canvas
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
