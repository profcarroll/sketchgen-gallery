let cables = [];
let streams = [];
const cableCount = 150;
const streamCount = 80;
const maxConnections = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cables (network structure)
  for (let i = 0; i < cableCount; i++) {
    cables.push({
      start: createVector(random(width), random(height)),
      end: createVector(random(width), random(height)),
      thickness: random(1, 3),
      color: color(random(200, 300), 50, 80)
    });
  }

  // Create junctions (nodes where cables connect)
  let junctions = [];
  for (let i = 0; i < 30; i++) {
    junctions.push(createVector(random(width), random(height)));
  }

  // Connect cables to junctions
  for (let cable of cables) {
    let closest = Infinity;
    let nearestJunction = null;
    
    for (let junc of junctions) {
      let d = dist(cable.start.x, cable.start.y, junc.x, junc.y);
      if (d < closest) {
        closest = d;
        nearestJunction = junc;
      }
    }

    if (nearestJunction && closest < 200) {
      cable.end = nearestJunction;
    }
  }

  // Initialize streams
  for (let i = 0; i < streamCount; i++) {
    let cableIndex = floor(random(cables.length));
    let t = random();
    let pos = p5.Vector.lerp(cables[cableIndex].start, cables[cableIndex].end, t);
    
    streams.push({
      pos: pos.copy(),
      cableIndex: cableIndex,
      speed: random(0.5, 2),
      size: random(3, 8),
      hue: random(100, 200),
      pulse: random(TWO_PI),
      split: false
    });
  }
}

function draw() {
  background(0);
  
  // Draw cables
  strokeWeight(1);
  for (let cable of cables) {
    stroke(cable.color);
    line(cable.start.x, cable.start.y, cable.end.x, cable.end.y);
  }

  // Update and draw streams
  for (let stream of streams) {
    let cable = cables[stream.cableIndex];
    
    // Move stream along cable
    stream.pos.lerp(cable.end, stream.speed * 0.01);
    
    // Check if reached end of cable
    let d = dist(stream.pos.x, stream.pos.y, cable.end.x, cable.end.y);
    if (d < 5) {
      // Move to next cable at junction
      let neighbors = [];
      for (let i = 0; i < cables.length; i++) {
        if (i === stream.cableIndex) continue;
        if (dist(cable.end.x, cable.end.y, cables[i].start.x, cables[i].start.y) < 10 ||
            dist(cable.end.x, cable.end.y, cables[i].end.x, cables[i].end.y) < 10) {
          neighbors.push(i);
        }
      }
      
      if (neighbors.length > 0) {
        stream.cableIndex = random(neighbors);
        let nextCable = cables[stream.cableIndex];
        stream.pos.set(nextCable.start.x, nextCable.start.y);
      } else {
        // Reset stream
        stream.cableIndex = floor(random(cables.length));
        let nextCable = cables[stream.cableIndex];
        stream.pos.set(nextCable.start.x, nextCable.start.y);
      }
    }

    // Pulse effect
    stream.pulse += 0.1;
    let pulseSize = sin(stream.pulse) * 2 + 5;
    
    // Brighten near junctions
    let distToJunction = dist(stream.pos.x, stream.pos.y, cable.end.x, cable.end.y);
    if (distToJunction < 30 && random() < 0.1) {
      stream.split = true;
    } else if (stream.split && random() < 0.05) {
      stream.split = false;
    }
    
    // Draw main stream
    noStroke();
    fill(stream.hue, 100, 100, 0.8);
    ellipse(stream.pos.x, stream.pos.y, stream.size + pulseSize, stream.size + pulseSize);
    
    // Draw glow effect
    fill(stream.hue, 100, 100, 0.2);
    ellipse(stream.pos.x, stream.pos.y, stream.size * 4 + pulseSize * 2, stream.size * 4 + pulseSize * 2);
    
    // Draw split streams if needed
    if (stream.split && random() < 0.3) {
      for (let i = 0; i < 3; i++) {
        let angle = random(TWO_PI);
        let offset = p5.Vector.fromAngle(angle).mult(random(2, 6));
        fill(stream.hue + random(-10, 10), 100, 100, 0.6);
        ellipse(stream.pos.x + offset.x, stream.pos.y + offset.y, 
                stream.size * 0.8 + pulseSize * 0.5, stream.size * 0.8 + pulseSize * 0.5);
      }
    }
  }

  // Occasionally add new streams
  if (random() < 0.02) {
    let cableIndex = floor(random(cables.length));
    let t = random();
    let pos = p5.Vector.lerp(cables[cableIndex].start, cables[cableIndex].end, t);
    
    streams.push({
      pos: pos.copy(),
      cableIndex: cableIndex,
      speed: random(0.5, 2),
      size: random(3, 8),
      hue: random(100, 200),
      pulse: random(TWO_PI),
      split: false
    });
    
    if (streams.length > streamCount + 10) {
      streams.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
