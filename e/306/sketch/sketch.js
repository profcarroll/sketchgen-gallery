let nodes = [];
let connections = [];
let time = 0;

class Node {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.size = random(2, 8);
    this.pulse = random(TWO_PI);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    let pulseVal = sin(this.pulse + time * 0.005) * 0.5 + 0.5;
    let glow = map(pulseVal, 0, 1, 100, 255);
    fill(255, 255, 200, glow);
    sphere(this.size, 4, 3);
    pop();
  }
}

class Connection {
  constructor(nodeA, nodeB) {
    this.a = nodeA;
    this.b = nodeB;
    this.length = p5.Vector.dist(nodeA.pos, nodeB.pos);
    this.segments = 10;
  }

  display() {
    let diff = p5.Vector.sub(this.b.pos, this.a.pos);
    let dir = diff.copy().normalize();
    let points = [];
    for (let i = 0; i <= this.segments; i++) {
      let t = i / this.segments;
      let pos = p5.Vector.add(this.a.pos, dir.copy().mult(t * this.length));
      points.push(pos);
    }
    stroke(255, 255, 200, 100);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y, points[i].z);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create nodes
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-200, 200);
    nodes.push(new Node(x, y, z));
  }

  // Create connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = p5.Vector.dist(nodes[i].pos, nodes[j].pos);
      if (d < 200) {
        connections.push(new Connection(nodes[i], nodes[j]));
      }
    }
  }

  // Add some planes
  for (let i = 0; i < 10; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    nodes.push(new Node(x, y, z));
  }
}

function draw() {
  background(0);
  time++;

  // Rotate the whole scene
  rotateY(time * 0.001);
  rotateX(time * 0.0005);

  // Display nodes and connections
  for (let node of nodes) {
    node.display();
  }

  for (let conn of connections) {
    conn.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
