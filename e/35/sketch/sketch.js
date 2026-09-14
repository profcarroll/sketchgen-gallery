let colors = [];
let canvasSize;

function setup() {
  canvasSize = Math.min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize);
  
  // Create deep, rich colors inspired by Rothko's palette
  colors = [
    color(120, 5, 15),   // Deep red
    color(180, 30, 40),  // Deep burgundy
    color(20, 20, 60),   // Deep blue
    color(80, 10, 40),   // Deep purple
    color(40, 5, 30)     // Deep maroon
  ];
  
  noStroke();
}

function draw() {
  background(245);
  
  // Draw stacked rectangles with varying opacity and size
  for (let i = 0; i < 5; i++) {
    let c = lerpColor(colors[i], colors[(i + 1) % colors.length], 
                     (sin(frameCount * 0.002 + i * 0.5) + 1) / 2);
    
    // Create a pulsating effect by scaling the rectangles
    let scale = 1 + sin(frameCount * 0.003 + i) * 0.1;
    let size = canvasSize * 0.8 * scale;
    
    // Adjust opacity based on layer and time
    let alpha = 150 + sin(frameCount * 0.005 + i) * 50;
    
    fill(red(c), green(c), blue(c), alpha);
    
    // Draw rectangles with some offset for diffusion effect
    let offsetX = sin(frameCount * 0.002 + i) * 10;
    let offsetY = cos(frameCount * 0.002 + i) * 10;
    
    rect(width/2 - size/2 + offsetX, 
         height/2 - size/2 + offsetY, 
         size, size);
  }
}

function windowResized() {
  resizeCanvas(Math.min(windowWidth, windowHeight), Math.min(windowWidth, windowHeight));
}
