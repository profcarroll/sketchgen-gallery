let wires = [];
let streams = [];
let colors = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate base colors for the network
  for (let i = 0; i < 12; i++) {
    colors.push(color(random(360), 70, 90, 0.8));
  }
  
  // Create initial wires
  for (let i = 0; i < 50; i++) {
    wires.push({
      start: { x: random(width), y: random(height) },
      end: { x: random(width), y: random(height) },
      thickness: random(1, 4),
      color: random(colors)
    });
  }
  
  // Create energy streams
  for (let i = 0; i < 200; i++) {
    let wireIndex = floor(random(wires.length));
    let wire = wires[wireIndex];
    streams.push({
      wireIndex: wireIndex,
      progress: random(1),
      speed: random(0.005, 0.02),
      size: random(3, 8)
    });
  }
}

function draw() {
  background(10, 5, 10);
  
  // Draw wires
  for (let wire of wires) {
    stroke(wire.color);
    strokeWeight(wire.thickness);
    line(wire.start.x, wire.start.y, wire.end.x, wire.end.y);
    
    // Add subtle glow effect
    noFill();
    stroke(255, 30);
    strokeWeight(wire.thickness + 2);
    line(wire.start.x, wire.start.y, wire.end.x, wire.end.y);
  }
  
  // Update and draw streams
  for (let stream of streams) {
    let wire = wires[stream.wireIndex];
    
    // Calculate position along the wire
    let t = stream.progress;
    let x = lerp(wire.start.x, wire.end.x, t);
    let y = lerp(wire.start.y, wire.end.y, t);
    
    // Draw the energy pulse
    fill(stream.size * 20 + 100, 100, 100, 0.8);
    noStroke();
    ellipse(x, y, stream.size, stream.size);
    
    // Update progress
    stream.progress += stream.speed;
    if (stream.progress > 1) {
      stream.progress = 0;
    }
  }
  
  // Occasionally add new streams for dynamic effect
  if (frameCount % 30 === 0 && streams.length < 300) {
    let wireIndex = floor(random(wires.length));
    streams.push({
      wireIndex: wireIndex,
      progress: random(1),
      speed: random(0.005, 0.02),
      size: random(3, 8)
    });
  }
  
  // Occasionally change wire positions for movement effect
  if (frameCount % 60 === 0) {
    for (let i = 0; i < wires.length; i += 5) {
      let wire = wires[i];
      wire.start.x += random(-2, 2);
      wire.start.y += random(-2, 2);
      wire.end.x += random(-2, 2);
      wire.end.y += random(-2, 2);
      
      // Keep within bounds
      wire.start.x = constrain(wire.start.x, 0, width);
      wire.start.y = constrain(wire.start.y, 0, height);
      wire.end.x = constrain(wire.end.x, 0, width);
      wire.end.y = constrain(wire.end.y, 0, height);
    }
  }
}
