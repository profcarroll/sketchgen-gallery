let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create multiple overlapping color planes
  for (let i = 0; i < 5; i++) {
    planes.push({
      color: color(
        random(50, 150),
        random(50, 150),
        random(50, 150),
        random(200, 255)
      ),
      speed: random(0.001, 0.005),
      amplitude: random(20, 60),
      frequency: random(0.001, 0.01),
      yOff: random(1000)
    });
  }
}

function draw() {
  background(255);
  
  time += 0.01;
  
  // Draw each plane with wave motion
  for (let i = 0; i < planes.length; i++) {
    let plane = planes[i];
    
    push();
    fill(plane.color);
    noStroke();
    
    beginShape();
    let yOff = plane.yOff + time * plane.speed;
    
    for (let x = -50; x < width + 50; x += 10) {
      // Create wave motion
      let y = height / 2 + sin(x * plane.frequency + yOff) * plane.amplitude;
      
      vertex(x, y);
    }
    
    // Close the shape
    vertex(width + 50, height);
    vertex(-50, height);
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
