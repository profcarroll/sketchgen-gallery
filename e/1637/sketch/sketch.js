let ribbons = [];
const ribbonCount = 50;
const segmentCount = 100;
const speed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < ribbonCount; i++) {
    ribbons.push({
      points: [],
      hue: random(360),
      timeOffset: random(1000)
    });
    
    // Initialize points for each ribbon
    for (let j = 0; j < segmentCount; j++) {
      ribbons[i].points.push({
        x: random(width),
        y: random(height),
        tx: random(1000),
        ty: random(1000)
      });
    }
  }
}

function draw() {
  background(20);
  
  for (let i = 0; i < ribbons.length; i++) {
    const ribbon = ribbons[i];
    
    // Update and draw each point in the ribbon
    beginShape();
    for (let j = 0; j < ribbon.points.length; j++) {
      const point = ribbon.points[j];
      
      // Animate point position using noise
      point.tx += speed;
      point.ty += speed;
      
      point.x = noise(point.tx) * width;
      point.y = noise(point.ty) * height;
      
      // Add some organic sway for more natural movement
      point.x += sin(frameCount * 0.01 + point.tx) * 30;
      point.y += cos(frameCount * 0.01 + point.ty) * 30;
      
      // Make the ribbon color shift over time
      const hue = (ribbon.hue + frameCount * 0.3) % 360;
      fill(hue, 80, 90, 0.6);
      
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
