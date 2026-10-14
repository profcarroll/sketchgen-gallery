let cables = [];
let streams = [];
const cableCount = 150;
const streamCount = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a dense network of cables
  for (let i = 0; i < cableCount; i++) {
    const start = createVector(
      random(-width/2, width/2),
      random(-height/2, height/2),
      random(-200, 200)
    );
    
    const end = p5.Vector.add(start, p5.Vector.random3D().mult(random(50, 300)));
    
    cables.push({
      start,
      end,
      color: color(random(180, 240), 60, 70, 0.7)
    });
  }
  
  // Initialize streams
  for (let i = 0; i < streamCount; i++) {
    const cableIndex = floor(random(cables.length));
    const t = random();
    const pos = p5.Vector.lerp(cables[cableIndex].start, cables[cableIndex].end, t);
    
    streams.push({
      cableIndex,
      t: t,
      speed: random(0.002, 0.008),
      size: random(2, 6),
      color: color(random(200, 260), 100, 100, 0.9)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the scene slowly
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Draw cables
  for (let cable of cables) {
    stroke(cable.color);
    strokeWeight(1);
    line(
      cable.start.x, cable.start.y, cable.start.z,
      cable.end.x, cable.end.y, cable.end.z
    );
  }
  
  // Draw streams
  noStroke();
  for (let stream of streams) {
    const cable = cables[stream.cableIndex];
    
    // Update position
    stream.t += stream.speed;
    if (stream.t > 1) {
      stream.t = 0;
      stream.cableIndex = floor(random(cables.length));
    }
    
    const pos = p5.Vector.lerp(cable.start, cable.end, stream.t);
    
    // Draw glowing pulse
    fill(stream.color);
    push();
    translate(pos.x, pos.y, pos.z);
    sphere(stream.size + sin(frameCount * 0.1 + stream.t) * 1.5);
    pop();
  }
  
  // Handle intersections with enhanced glow
  for (let i = 0; i < streams.length; i++) {
    for (let j = i + 1; j < streams.length; j++) {
      const s1 = streams[i];
      const s2 = streams[j];
      
      if (s1.cableIndex === s2.cableIndex) continue;
      
      const cable1 = cables[s1.cableIndex];
      const cable2 = cables[s2.cableIndex];
      
      // Simple intersection check
      const p1 = p5.Vector.lerp(cable1.start, cable1.end, s1.t);
      const p2 = p5.Vector.lerp(cable2.start, cable2.end, s2.t);
      
      const distance = p5.Vector.dist(p1, p2);
      if (distance < 20) {
        // Create a bright intersection point
        fill(240, 100, 100, 0.9);
        push();
        translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
        sphere(5 + sin(frameCount * 0.2) * 2);
        pop();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
