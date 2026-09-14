let stripes = [];
let colorPalette = [
  [255, 50, 50],    // Red
  [255, 150, 50],   // Orange
  [255, 255, 50],   // Yellow
  [50, 255, 50],    // Green
  [50, 150, 255],   // Blue
  [150, 50, 255],   // Purple
  [255, 50, 200]    // Pink
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize stripes with random positions and speeds
  for (let i = 0; i < 15; i++) {
    stripes.push({
      y: random(height),
      speed: random(0.5, 2),
      width: random(30, 100),
      colorIndex: floor(random(colorPalette.length)),
      easeFactor: random(0.01, 0.05)
    });
  }
}

function draw() {
  // Use a subtle background fade to create motion trails
  fill(0, 20);
  rect(0, 0, width, height);
  
  // Draw diagonal stripes with smooth transitions
  for (let i = 0; i < stripes.length; i++) {
    let s = stripes[i];
    
    // Smoothly update position using easing
    s.y += s.speed;
    
    // Reset stripe when it goes off screen
    if (s.y > height + 50) {
      s.y = -50;
      s.colorIndex = (s.colorIndex + 1) % colorPalette.length;
    }
    
    // Apply easing to the width for smooth slicing effect
    let targetWidth = s.width;
    s.width += (targetWidth - s.width) * s.easeFactor;
    
    // Calculate diagonal offset based on time and position
    let offsetX = (s.y + millis() * 0.01) * 0.2;
    
    // Draw the stripe with a diagonal pattern
    fill(colorPalette[s.colorIndex]);
    
    push();
    translate(0, s.y);
    rotate(radians(30)); // Diagonal angle
    
    rect(offsetX, -s.width/2, width + 100, s.width);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
