let cables = [];
let streams = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a dense network of cables
  for (let i = 0; i < 200; i++) {
    cables.push({
      start: createVector(random(width), random(height)),
      end: createVector(random(width), random(height)),
      thickness: random(1, 5),
      hue: random(20, 40) // Dark metallic color
    });
  }
  
  // Create data streams that travel along cables
  for (let i = 0; i < 30; i++) {
    streams.push({
      cableIndex: floor(random(cables.length)),
      progress: random(1),
      speed: random(0.002, 0.008),
      color: color(random(200, 300), 100, 100, 0.8),
      size: random(5, 15)
    });
  }
}

function draw() {
  background(10, 10, 10); // Dark background
  
  // Draw cables
  for (let cable of cables) {
    stroke(cable.hue, 20, 30);
    strokeWeight(cable.thickness);
    line(cable.start.x, cable.start.y, cable.end.x, cable.end.y);
  }
  
  // Update and draw data streams
  for (let stream of streams) {
    let cable = cables[stream.cableIndex];
    
    // Move stream along the cable
    stream.progress += stream.speed;
    if (stream.progress > 1) stream.progress = 0;
    
    // Calculate position on cable
    let x = lerp(cable.start.x, cable.end.x, stream.progress);
    let y = lerp(cable.start.y, cable.end.y, stream.progress);
    
    // Draw glowing stream
    noStroke();
    fill(stream.color);
    ellipse(x, y, stream.size, stream.size);
    
    // Add glow effect
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = stream.color;
    ellipse(x, y, stream.size, stream.size);
    drawingContext.shadowBlur = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
