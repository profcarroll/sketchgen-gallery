let planes = [];
let hueShift = 0;
const numPlanes = 8;
const planeHeight = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create layered planes
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      y: i * planeHeight,
      speed: 0.2 + i * 0.05,
      hueOffset: i * 30,
      saturation: 80 + i * 5
    });
  }
}

function draw() {
  // Slowly shift hues for chroma rhythm
  hueShift = (frameCount * 0.01) % 360;
  
  // Draw background wash
  background(0, 0, 10);
  
  // Draw each plane with soft overlap and movement
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    // Calculate vertical position with drift
    const y = p.y + sin(frameCount * p.speed * 0.1 + i) * 20;
    
    // Apply hue shift to central areas
    let shiftAmount = 0;
    if (abs(y - height/2) < planeHeight) {
      shiftAmount = sin(frameCount * 0.05 + i) * 10;
    }
    
    // Create gradient color with hue shift
    const baseHue = (hueShift + p.hueOffset + shiftAmount) % 360;
    const color1 = color(baseHue, p.saturation, 70, 0.8);
    const color2 = color(baseHue, p.saturation, 40, 0.3);
    
    // Draw gradient plane
    drawGradientPlane(y, color1, color2);
  }
}

function drawGradientPlane(y, topColor, bottomColor) {
  // Draw a vertical gradient plane with soft edges
  noStroke();
  
  // Use a large rectangle with alpha blending for soft overlap
  fill(topColor);
  rect(0, y, width, planeHeight * 0.8);
  
  // Add subtle edge glow effect
  fill(bottomColor);
  rect(0, y + planeHeight * 0.7, width, planeHeight * 0.3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
