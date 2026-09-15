let cables = [];
let streams = [];
let numCables = 150;
let numStreams = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cables
  for (let i = 0; i < numCables; i++) {
    let start = createVector(random(width), random(height));
    let end = createVector(random(width), random(height));
    let thickness = random(1, 4);
    cables.push({
      start: start,
      end: end,
      thickness: thickness
    });
  }
  
  // Create data streams
  for (let i = 0; i < numStreams; i++) {
    let cableIndex = floor(random(cables.length));
    let t = random(1);
    let pos = p5.Vector.lerp(cables[cableIndex].start, cables[cableIndex].end, t);
    let speed = random(0.5, 2);
    let hue = random(360);
    streams.push({
      cableIndex: cableIndex,
      t: t,
      speed: speed,
      hue: hue,
      pos: pos
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  // Draw cables
  for (let cable of cables) {
    stroke(200, 50, 80, 0.3);
    strokeWeight(cable.thickness);
    line(cable.start.x, cable.start.y, cable.end.x, cable.end.y);
  }
  
  // Update and draw streams
  for (let stream of streams) {
    // Move stream along its cable
    stream.t += stream.speed * 0.005;
    
    // Reset if stream goes off the cable
    if (stream.t > 1 || stream.t < 0) {
      stream.t = random(1);
    }
    
    // Update position
    let cable = cables[stream.cableIndex];
    stream.pos = p5.Vector.lerp(cable.start, cable.end, stream.t);
    
    // Draw stream pulse
    fill(stream.hue, 100, 100, 0.8);
    noStroke();
    ellipse(stream.pos.x, stream.pos.y, 6, 6);
    
    // Draw trailing effect
    stroke(stream.hue, 100, 100, 0.3);
    strokeWeight(2);
    line(
      stream.pos.x - 10 * cos(frameCount * 0.05 + stream.hue),
      stream.pos.y - 10 * sin(frameCount * 0.05 + stream.hue),
      stream.pos.x,
      stream.pos.y
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
