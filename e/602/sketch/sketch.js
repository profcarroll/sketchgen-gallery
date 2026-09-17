let planes = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create 5 large overlapping planes
  for (let i = 0; i < 5; i++) {
    planes.push({
      x: 0,
      y: 0,
      w: width,
      h: height,
      alpha: random(100, 200),
      speed: random(0.002, 0.005),
      offset: random(TWO_PI)
    });
  }
  
  // Define Rothko-like color palette
  colors = [
    [255, 50, 50],   // Red
    [50, 100, 200],  // Blue
    [255, 200, 50],  // Yellow
    [150, 50, 150],  // Purple
    [50, 150, 100]   // Green
  ];
}

function draw() {
  background(255);
  
  // Draw planes with subtle color shifts
  for (let i = 0; i < planes.length; i++) {
    let plane = planes[i];
    
    // Calculate color based on time and offset
    let hue = (frameCount * plane.speed + plane.offset) % TWO_PI;
    let colorIndex = floor(map(hue, 0, TWO_PI, 0, colors.length));
    colorIndex = colorIndex % colors.length;
    
    let c = colors[colorIndex];
    let r = c[0];
    let g = c[1];
    let b = c[2];
    
    // Smooth color transition with alpha
    let alpha = map(sin(hue), -1, 1, plane.alpha * 0.7, plane.alpha * 1.3);
    
    fill(r, g, b, alpha);
    noStroke();
    
    // Draw a large rectangle that slightly moves and scales
    rect(plane.x, plane.y, plane.w, plane.h);
    
    // Slight movement effect for organic feel
    plane.x = sin(frameCount * 0.001 + i) * 20;
    plane.y = cos(frameCount * 0.001 + i) * 20;
    plane.w = width + sin(frameCount * 0.0005 + i) * 40;
    plane.h = height + cos(frameCount * 0.0005 + i) * 40;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
