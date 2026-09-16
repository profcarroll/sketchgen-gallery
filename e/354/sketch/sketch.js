let marbles = [];
let channels = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a complex funnel-shaped channel
  channels.push({
    points: [],
    radius: 80,
    height: 200,
    segments: 50
  });

  for (let i = 0; i <= channels[0].segments; i++) {
    let t = map(i, 0, channels[0].segments, 0, PI);
    let x = sin(t) * channels[0].radius;
    let z = cos(t) * channels[0].radius;
    let y = map(i, 0, channels[0].segments, -channels[0].height, 0);
    channels[0].points.push(createVector(x, y, z));
  }

  // Add a wide shallow basin at the end
  for (let i = 0; i < 20; i++) {
    let t = map(i, 0, 19, PI, PI * 1.5);
    let x = sin(t) * channels[0].radius * 1.5;
    let z = cos(t) * channels[0].radius * 1.5;
    let y = -channels[0].height + 20;
    channels[0].points.push(createVector(x, y, z));
  }

  // Initialize a marble
  marbles.push({
    pos: createVector(0, -channels[0].height + 10, 0),
    vel: createVector(0, 0, 0),
    radius: 8,
    color: color(200, 80, 90),
    trail: []
  });
}

function draw() {
  background(0, 0, 10);

  // Camera setup
  camera(0, -100, 300, 0, 0, 0, 0, 1, 0);
  rotateX(PI / 4);
  rotateY(frameCount * 0.005);

  // Draw the channel
  stroke(180, 50, 70);
  noFill();
  beginShape();
  for (let p of channels[0].points) {
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Update and draw marbles
  for (let m of marbles) {
    // Gravity
    m.vel.y += 0.2;

    // Apply velocity
    m.pos.add(m.vel);

    // Add to trail
    m.trail.push(m.pos.copy());
    if (m.trail.length > 20) {
      m.trail.shift();
    }

    // Check for collisions with the channel walls
    let closestPoint = null;
    let minDist = Infinity;

    for (let i = 0; i < channels[0].points.length - 1; i++) {
      let p1 = channels[0].points[i];
      let p2 = channels[0].points[i + 1];

      // Vector from p1 to p2
      let dir = p5.Vector.sub(p2, p1);
      let len = dir.mag();
      dir.normalize();

      // Vector from p1 to marble
      let toMarble = p5.Vector.sub(m.pos, p1);

      // Project onto the line segment
      let proj = toMarble.dot(dir);
      proj = constrain(proj, 0, len);

      // Closest point on the line segment
      let closest = p5.Vector.add(p1, dir.copy().mult(proj));

      // Distance to marble
      let dist = m.pos.dist(closest);
      if (dist < minDist) {
        minDist = dist;
        closestPoint = closest;
      }
    }

    if (closestPoint && minDist < m.radius + 5) {
      // Bounce effect
      let normal = p5.Vector.sub(m.pos, closestPoint).normalize();
      m.vel.reflect(normal);
      m.vel.mult(0.8); // Damping

      // Repel marble out of the wall
      let repel = normal.copy().mult(1);
      m.pos.add(repel);

      // Add some visual effect on bounce
    }

    // Draw trail
    noFill();
    beginShape();
    stroke(200, 80, 90, 0.5);
    for (let t of m.trail) {
      vertex(t.x, t.y, t.z);
    }
    endShape();

    // Draw marble
    push();
    translate(m.pos.x, m.pos.y, m.pos.z);
    noStroke();
    fill(m.color);
    sphere(m.radius);
    pop();

    // Slow down over time
    m.vel.mult(0.98);
  }
}
