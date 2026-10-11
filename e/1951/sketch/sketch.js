let cables = [];
let streams = [];
const cableCount = 300;
const streamCount = 50;
const maxCableLength = 150;
const minCableLength = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cables with branching structure
  for (let i = 0; i < cableCount; i++) {
    const start = createVector(
      random(-width/2, width/2),
      random(-height/2, height/2),
      random(-100, 100)
    );
    
    const end = p5.Vector.add(start, p5.Vector.random3D().mult(random(minCableLength, maxCableLength)));
    
    const thickness = random(0.5, 3);
    
    cables.push({
      start,
      end,
      thickness
    });
  }
  
  // Create data streams
  for (let i = 0; i < streamCount; i++) {
    const cableIndex = floor(random(cableCount));
    const t = random();
    
    streams.push({
      cableIndex,
      t,
      speed: random(0.002, 0.01),
      color: color(random(360), 100, 100, 0.8)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the scene slowly
  rotateY(frameCount * 0.002);
  rotateX(frameCount * 0.001);
  
  // Draw cables with depth and subtle variation
  stroke(100, 30, 70);
  strokeWeight(1);
  
  for (let cable of cables) {
    line(
      cable.start.x, cable.start.y, cable.start.z,
      cable.end.x, cable.end.y, cable.end.z
    );
  }
  
  // Draw data streams with glowing pulses
  for (let stream of streams) {
    const cable = cables[stream.cableIndex];
    const pos = p5.Vector.lerp(cable.start, cable.end, stream.t);
    
    // Draw the glowing pulse with subtle animation
    noStroke();
    fill(stream.color);
    push();
    translate(pos.x, pos.y, pos.z);
    sphere(2 + sin(frameCount * 0.1) * 1.5);
    pop();
    
    // Update stream position
    stream.t += stream.speed;
    if (stream.t > 1) {
      stream.t = 0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
