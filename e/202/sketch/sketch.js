let nodes = [];
let connections = [];
let pulse = { active: false, x: 0, y: 0, radius: 0 };
let wave = { active: false, x: 0, y: 0, radius: 0 };
let renderer;

function setup() {
  createCanvas(800, 600, WEBGL);
  renderer = renderer;
  
  // Create nodes
  for (let i = 0; i < 150; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(3, 8)
    });
  }

  // Create connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (d < 150) {
        connections.push({ a: i, b: j });
      }
    }
  }

  noLoop();
}

function draw() {
  background(10, 10, 20);
  
  // Rotate the scene
  rotateY(frameCount * 0.001);
  rotateX(sin(frameCount * 0.001) * 0.2);

  // Draw connections
  stroke(100, 200, 255, 80);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let a = nodes[c.a];
    let b = nodes[c.b];
    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Draw nodes
  noStroke();
  fill(255, 200, 100, 200);
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    push();
    translate(n.x, n.y, n.z);
    sphere(n.size);
    pop();
  }

  // Draw pulse effect if active
  if (pulse.active) {
    stroke(255, 100, 100, 150);
    noFill();
    ellipse(pulse.x, pulse.y, pulse.radius * 2);
    pulse.radius += 3;
    if (pulse.radius > 200) {
      pulse.active = false;
    }
  }

  // Draw wave effect if active
  if (wave.active) {
    stroke(100, 255, 200, 150);
    noFill();
    ellipse(wave.x, wave.y, wave.radius * 2);
    wave.radius += 2;
    if (wave.radius > 300) {
      wave.active = false;
    }
  }

  // Update node positions based on pulse or wave
  if (pulse.active || wave.active) {
    for (let i = 0; i < nodes.length; i++) {
      let n = nodes[i];
      let d = dist(n.x, n.y, pulse.x, pulse.y);
      if (pulse.active && d < pulse.radius) {
        let force = map(d, 0, pulse.radius, 1, 0.2);
        n.x += random(-force, force) * 5;
        n.y += random(-force, force) * 5;
      }

      d = dist(n.x, n.y, wave.x, wave.y);
      if (wave.active && d < wave.radius) {
        let force = map(d, 0, wave.radius, 1, 0.1);
        n.x += random(-force, force) * 3;
        n.y += random(-force, force) * 3;
      }
    }
  }

  // Update connections if needed
  if (frameCount % 10 === 0) {
    for (let i = 0; i < connections.length; i++) {
      let c = connections[i];
      let a = nodes[c.a];
      let b = nodes[c.b];
      let d = dist(a.x, a.y, b.x, b.y);
      if (d > 200) {
        connections.splice(i, 1);
        i--;
      }
    }
  }
}

function mousePressed() {
  pulse.active = true;
  pulse.x = mouseX - width/2;
  pulse.y = mouseY - height/2;
  pulse.radius = 0;
  loop();
}

function mouseDragged() {
  wave.active = true;
  wave.x = mouseX - width/2;
  wave.y = mouseY - height/2;
  wave.radius = 0;
  loop();
}

function mouseReleased() {
  if (!pulse.active && !wave.active) {
    noLoop();
  }
}
