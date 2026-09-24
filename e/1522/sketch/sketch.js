let lines = [];
const lineCount = 100;
const segmentCount = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < lineCount; i++) {
    lines.push({
      points: [],
      hue: random(360),
      speed: random(0.005, 0.02),
      timeOffset: random(1000)
    });
    
    // Initialize points for each line
    for (let j = 0; j < segmentCount; j++) {
      lines[i].points.push({
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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Update and draw each point in the line
    beginShape();
    for (let j = 0; j < line.points.length; j++) {
      const point = line.points[j];
      
      // Animate point position using noise
      point.tx += line.speed;
      point.ty += line.speed;
      
      point.x = noise(point.tx) * width;
      point.y = noise(point.ty) * height;
      
      // Apply some additional sway to make it more organic
      point.x += sin(frameCount * 0.01 + point.tx) * 20;
      point.y += cos(frameCount * 0.01 + point.ty) * 20;
      
      // Make the line color shift over time
      const hue = (line.hue + frameCount * 0.5) % 360;
      fill(hue, 80, 90, 0.7);
      
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
