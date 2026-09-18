let wires = [];
let streams = [];
const WIRE_COUNT = 100;
const STREAM_COUNT = 20;
const MAX_CONNECTIONS = 5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create wire network
  for (let i = 0; i < WIRE_COUNT; i++) {
    wires.push({
      start: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      end: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      connections: []
    });
  }

  // Connect wires
  for (let i = 0; i < WIRE_COUNT; i++) {
    let count = floor(random(1, MAX_CONNECTIONS + 1));
    for (let j = 0; j < count; j++) {
      let target = floor(random(WIRE_COUNT));
      if (target !== i && !wires[i].connections.includes(target)) {
        wires[i].connections.push(target);
      }
    }
  }

  // Create data streams
  for (let i = 0; i < STREAM_COUNT; i++) {
    const wireIndex = floor(random(WIRE_COUNT));
    streams.push({
      wire: wireIndex,
      progress: random(1),
      color: color(random(255), 100, 100, 0.8)
    });
  }
}

function draw() {
  background(0);
  noFill();

  // Move streams
  for (let stream of streams) {
    stream.progress += 0.01;
    if (stream.progress > 1) stream.progress = 0;
  }

  // Draw wires
  stroke(100, 50, 80);
  strokeWeight(1);
  for (let wire of wires) {
    line(wire.start.x, wire.start.y, wire.start.z, wire.end.x, wire.end.y, wire.end.z);
    
    // Draw connections
    for (let targetIndex of wire.connections) {
      let target = wires[targetIndex];
      line(wire.end.x, wire.end.y, wire.end.z, target.start.x, target.start.y, target.start.z);
    }
  }

  // Draw streams
  for (let stream of streams) {
    const wire = wires[stream.wire];
    const pos = p5.Vector.lerp(wire.start, wire.end, stream.progress);
    
    push();
    translate(pos.x, pos.y, pos.z);
    noStroke();
    fill(stream.color);
    sphere(3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
