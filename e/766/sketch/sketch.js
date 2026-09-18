let bands = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a set of geometric bands with different properties
  for (let i = 0; i < 8; i++) {
    bands.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.005),
      radius: random(100, 300),
      width: random(20, 60),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      segments: floor(random(4, 10))
    });
  }
}

function draw() {
  background(10);
  
  // Center of the canvas
  let cx = width / 2;
  let cy = height / 2;
  
  time += 0.01;
  
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    
    // Update angle with time and individual speed
    band.angle += band.speed;
    
    // Draw the band as a series of intersecting planes
    push();
    translate(cx, cy);
    rotate(band.angle);
    
    // Draw multiple segments to create striped effect
    for (let j = 0; j < band.segments; j++) {
      let segmentAngle = TWO_PI / band.segments;
      let startAngle = j * segmentAngle;
      let endAngle = startAngle + segmentAngle;
      
      // Add a slight offset to each segment for dynamic stripe pattern
      let offset = sin(time + i * 0.5) * 0.2;
      startAngle += offset;
      endAngle += offset;
      
      // Draw the segment as a filled arc (plane)
      fill(band.color);
      arc(0, 0, band.radius * 2, band.radius * 2, startAngle, endAngle);
    }
    
    pop();
  }
  
  // Add an overlay of intersecting lines to enhance the tapestry effect
  push();
  stroke(255, 30);
  for (let i = 0; i < 200; i++) {
    let x1 = sin(time * 0.5 + i * 0.1) * width / 2 + width / 2;
    let y1 = cos(time * 0.3 + i * 0.1) * height / 2 + height / 2;
    let x2 = sin(time * 0.7 + i * 0.1 + PI) * width / 2 + width / 2;
    let y2 = cos(time * 0.9 + i * 0.1 + PI) * height / 2 + height / 2;
    
    line(x1, y1, x2, y2);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
