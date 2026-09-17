let nodes = [];
let seams = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create structural nodes at major junctions
  for (let i = 0; i < 20; i++) {
    nodes.push({
      pos: p5.Vector.random3D().mult(300),
      charge: random(0.5, 1),
      pulse: random(TWO_PI)
    });
  }

  // Create energy seams between nodes
  for (let i = 0; i < 50; i++) {
    let start = p5.Vector.random3D().mult(250);
    let end = p5.Vector.random3D().mult(250);
    seams.push({
      start: start,
      end: end,
      wave: random(TWO_PI)
    });
  }
}

function draw() {
  background(0.1);
  time += 0.01;

  // Camera movement for immersive effect
  let cx = sin(time * 0.2) * 500;
  let cy = cos(time * 0.3) * 300;
  let cz = sin(time * 0.1) * 400;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);

  // Draw energy seams
  stroke(0.3, 1, 0.8, 0.7);
  strokeWeight(2);
  noFill();
  
  beginShape(LINES);
  for (let seam of seams) {
    let t = sin(time + seam.wave) * 0.5 + 0.5;
    let pos = p5.Vector.lerp(seam.start, seam.end, t);
    vertex(seam.start.x, seam.start.y, seam.start.z);
    vertex(seam.end.x, seam.end.y, seam.end.z);
  }
  endShape();

  // Draw pulsating nodes
  noStroke();
  for (let node of nodes) {
    let pulse = sin(time + node.pulse) * 0.5 + 0.5;
    let radius = 15 + pulse * 10;
    
    fill(0.3, 1, 0.8, 0.9);
    push();
    translate(node.pos.x, node.pos.y, node.pos.z);
    sphere(radius, 6, 4);
    pop();

    // Energy waves radiating from nodes
    fill(0.3, 1, 0.8, 0.2);
    push();
    translate(node.pos.x, node.pos.y, node.pos.z);
    sphere(radius * 2 + pulse * 20, 6, 4);
    pop();
  }

  // Draw crystalline reflections
  stroke(0.3, 1, 1, 0.5);
  strokeWeight(1);
  noFill();

  for (let i = 0; i < 100; i++) {
    let pos = p5.Vector.random3D().mult(200);
    let size = random(10, 30);
    beginShape(LINES);
    vertex(pos.x, pos.y, pos.z);
    vertex(pos.x + random(-size, size), pos.y + random(-size, size), pos.z + random(-size, size));
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
