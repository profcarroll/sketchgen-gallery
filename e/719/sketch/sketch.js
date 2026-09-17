let fragments = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create fragments
  for (let i = 0; i < 150; i++) {
    fragments.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(5, 20),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.005, 0.02)
    });
  }

  // Create connections
  for (let i = 0; i < fragments.length; i++) {
    for (let j = i + 1; j < fragments.length; j++) {
      let d = dist(fragments[i].x, fragments[i].y, fragments[i].z,
                   fragments[j].x, fragments[j].y, fragments[j].z);
      if (d < 150) {
        connections.push({
          a: i,
          b: j,
          len: d
        });
      }
    }
  }
}

function draw() {
  background(10);
  time += 0.01;

  // Camera rotation
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.2);

  // Draw connections
  stroke(255, 100);
  noFill();
  beginShape(LINES);
  for (let c of connections) {
    let f1 = fragments[c.a];
    let f2 = fragments[c.b];
    vertex(f1.x, f1.y, f1.z);
    vertex(f2.x, f2.y, f2.z);
  }
  endShape();

  // Draw energy arcs
  for (let c of connections) {
    let f1 = fragments[c.a];
    let f2 = fragments[c.b];

    let d = dist(f1.x, f1.y, f1.z, f2.x, f2.y, f2.z);
    if (d < 150) {
      let pulse = sin(time * 3 + d * 0.01) * 0.5 + 0.5;
      stroke(255, 150 * pulse);
      line(f1.x, f1.y, f1.z, f2.x, f2.y, f2.z);
    }
  }

  // Draw fragments
  for (let f of fragments) {
    push();
    translate(f.x, f.y, f.z);
    rotateX(f.rotX + time * f.speed);
    rotateY(f.rotY + time * f.speed * 0.7);
    rotateZ(f.rotZ + time * f.speed * 0.3);

    let pulse = sin(time + f.size) * 0.5 + 0.5;
    fill(100 + pulse * 155, 200, 255, 200);
    box(f.size);
    pop();
  }
}
