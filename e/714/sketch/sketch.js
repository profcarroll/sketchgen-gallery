let shards = [];
let stressLines = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial shards
  for (let i = 0; i < 200; i++) {
    shards.push({
      pos: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
      size: random(10, 30),
      rot: random(TWO_PI),
      spin: random(-0.01, 0.01),
      color: color(random(240, 300), 80, 90, 0.7)
    });
  }

  // Initialize stress lines
  for (let i = 0; i < 500; i++) {
    stressLines.push({
      a: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
      b: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
      age: 0,
      maxAge: random(100, 300)
    });
  }
}

function draw() {
  background(0);
  ambientLight(30);
  pointLight(255, 255, 255, 0, -300, 300);

  // Camera movement
  let time = millis() / 1000;
  camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);
  rotateX(sin(time * 0.1) * 0.1);
  rotateY(time * 0.05);

  // Draw shards
  for (let shard of shards) {
    push();
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    rotateZ(shard.rot);
    shard.rot += shard.spin;

    fill(shard.color);
    stroke(255, 0.3);
    strokeWeight(0.5);

    // Draw a simple crystal-like shape
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = cos(angle) * shard.size;
      let y = sin(angle) * shard.size;
      vertex(x, y, 0);
    }
    endShape(CLOSE);

    // Add some facets
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = cos(angle) * shard.size * 0.6;
      let y = sin(angle) * shard.size * 0.6;
      vertex(x, y, -shard.size * 0.3);
    }
    endShape(CLOSE);

    pop();
  }

  // Draw stress lines
  stroke(255, 0.5);
  strokeWeight(0.5);
  noFill();

  beginShape(LINES);
  for (let line of stressLines) {
    if (line.age < line.maxAge) {
      line.age++;
      vertex(line.a.x, line.a.y, line.a.z);
      vertex(line.b.x, line.b.y, line.b.z);
    } else {
      // Reset line
      line.a = createVector(random(-200, 200), random(-200, 200), random(-200, 200));
      line.b = createVector(random(-200, 200), random(-200, 200), random(-200, 200));
      line.age = 0;
    }
  }
  endShape();
}
