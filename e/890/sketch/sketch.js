let streams = [];
let clusters = [];
let numStreams = 100;
let numClusters = 50;

function setup() {
  createCanvas(800, 600);
  colorMode(GRAY);
  noStroke();

  // Create flowing light streaks
  for (let i = 0; i < numStreams; i++) {
    streams.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(2, 8),
      alpha: random(50, 150),
      path: []
    });
  }

  // Create initial clusters
  for (let i = 0; i < numClusters; i++) {
    clusters.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      shape: int(random(3, 7)) // number of points
    });
  }
}

function draw() {
  background(20);

  // Update and draw streams
  for (let stream of streams) {
    // Move stream
    stream.x += stream.vx;
    stream.y += stream.vy;

    // Add to path
    stream.path.push({x: stream.x, y: stream.y});
    if (stream.path.length > 50) {
      stream.path.shift();
    }

    // Draw stream trail
    fill(255, stream.alpha);
    for (let i = 0; i < stream.path.length - 1; i++) {
      let alpha = map(i, 0, stream.path.length - 1, 0, stream.alpha);
      fill(255, alpha);
      let p1 = stream.path[i];
      let p2 = stream.path[i + 1];
      line(p1.x, p1.y, p2.x, p2.y);
    }

    // Draw head of stream
    ellipse(stream.x, stream.y, stream.size);

    // Boundary check
    if (stream.x < 0 || stream.x > width || stream.y < 0 || stream.y > height) {
      stream.x = random(width);
      stream.y = random(height);
      stream.path = [];
    }
  }

  // Update and draw clusters
  for (let cluster of clusters) {
    cluster.angle += cluster.rotationSpeed;

    // Draw crystalline cluster
    push();
    translate(cluster.x, cluster.y);
    rotate(cluster.angle);

    fill(255, 100);
    noStroke();

    beginShape();
    for (let i = 0; i < cluster.shape; i++) {
      let angle = map(i, 0, cluster.shape, 0, TWO_PI);
      let x = cos(angle) * cluster.size;
      let y = sin(angle) * cluster.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  // Occasionally create new clusters at intersections
  if (frameCount % 100 === 0 && clusters.length < 100) {
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(height);
      clusters.push({
        x: x,
        y: y,
        size: random(20, 60),
        angle: random(TWO_PI),
        rotationSpeed: random(-0.01, 0.01),
        shape: int(random(3, 7))
      });
    }
  }

  // Occasionally remove old clusters
  if (clusters.length > 80) {
    clusters = clusters.slice(0, 60);
  }
}
