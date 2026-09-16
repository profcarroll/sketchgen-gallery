let streams = [];
let nodes = [];
const NUM_NODES = 50;
const NUM_STREAMS = 100;
const STREAM_LIFETIME = 200;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create nodes
  for (let i = 0; i < NUM_NODES; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(5, 15)
    });
  }

  // Initialize streams
  for (let i = 0; i < NUM_STREAMS; i++) {
    resetStream(i);
  }
}

function resetStream(id) {
  streams[id] = {
    pos: createVector(random(-width/2, width/2), random(-height/2, height/2)),
    vel: p5.Vector.random3D().mult(random(0.5, 2)),
    hue: random(180, 240),
    alpha: 1,
    age: 0,
    trail: []
  };
}

function draw() {
  background(0, 0, 0, 0.1);
  noStroke();

  // Update and display streams
  for (let i = 0; i < streams.length; i++) {
    let s = streams[i];
    
    // Move stream
    s.pos.add(s.vel);
    s.age++;

    // Add to trail
    s.trail.push({x: s.pos.x, y: s.pos.y, z: s.pos.z, alpha: s.alpha});
    if (s.trail.length > 20) {
      s.trail.shift();
    }

    // Draw trail
    push();
    beginShape();
    for (let j = 0; j < s.trail.length; j++) {
      let t = s.trail[j];
      let alpha = map(j, 0, s.trail.length - 1, 0, t.alpha);
      fill(t.hue, 100, 100, alpha * 0.5);
      vertex(t.x, t.y, t.z);
    }
    endShape();
    pop();

    // Draw head
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    fill(s.hue, 100, 100, s.alpha * 0.8);
    sphere(3);
    pop();

    // Reset if too old or off-screen
    if (s.age > STREAM_LIFETIME || 
        abs(s.pos.x) > width/2 + 100 ||
        abs(s.pos.y) > height/2 + 100) {
      resetStream(i);
    }
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    push();
    translate(n.x, n.y, n.z);
    fill(200, 50, 100, 0.3);
    sphere(n.size);
    pop();
  }

  // Connect nearby nodes with glowing lines
  strokeWeight(0.5);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[i].z,
                   nodes[j].x, nodes[j].y, nodes[j].z);
      if (d < 200) {
        let alpha = map(d, 0, 200, 0.8, 0);
        stroke(200, 50, 100, alpha);
        line(nodes[i].x, nodes[i].y, nodes[i].z,
             nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
}
