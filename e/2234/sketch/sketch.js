let stripes = [];
const numStripes = 20;
const colorPalette = [
  [255, 204, 51],   // Mustard yellow
  [255, 102, 0],    // Burnt orange
  [34, 139, 34],    // Forest green
  [139, 69, 19],    // Brown
  [205, 92, 92],    // Indian red
  [107, 142, 35]    // Olive green
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize stripes with varying angles and speeds
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.008),
      width: random(50, 200),
      color: random(colorPalette),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 10);
  
  // Draw animated diagonal stripes
  for (let i = 0; i < stripes.length; i++) {
    const s = stripes[i];
    
    // Animate the stripe position and color
    const time = frameCount * s.speed;
    const offset = sin(time + s.offset) * 20;
    
    // Create a gradient for each stripe
    drawingContext.globalCompositeOperation = 'screen';
    
    const gradient = drawingContext.createLinearGradient(
      0, 0, width, height
    );
    
    // Add color stops with smooth transitions
    const color1 = s.color;
    const color2 = [
      color1[0] * 0.7,
      color1[1] * 0.7,
      color1[2] * 0.7
    ];
    
    gradient.addColorStop(0, `rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.8)`);
    gradient.addColorStop(0.5, `rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 0.4)`);
    gradient.addColorStop(1, `rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.8)`);
    
    drawingContext.fillStyle = gradient;
    
    // Draw a skewed rectangle that creates the diagonal effect
    push();
    translate(width / 2, height / 2);
    rotate(s.angle);
    rect(-width / 2, -s.width / 2 + offset, width, s.width);
    pop();
  }
  
  drawingContext.globalCompositeOperation = 'source-over';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
