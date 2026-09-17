let hexagonVertices;
let globularSplines = [];
let shards = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create hexagon vertices
  hexagonVertices = [];
  const radius = min(width, height) * 0.4;
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6 - PI/2;
    hexagonVertices.push(createVector(
      width/2 + cos(angle) * radius,
      height/2 + sin(angle) * radius
    ));
  }

  // Initialize globular splines
  for (let i = 0; i < 8; i++) {
    globularSplines.push({
      points: [],
      color: color(random(100, 255), random(100, 255), random(200, 255), 150),
      speed: random(0.002, 0.005),
      phase: random(TWO_PI)
    });
  }

  // Initialize shards
  for (let i = 0; i < 30; i++) {
    shards.push({
      pos: createVector(random(width), random(height)),
      size: random(10, 40),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10);
  time += 0.01;

  // Draw hexagonal boundary
  push();
  stroke(255, 50);
  noFill();
  beginShape();
  for (let v of hexagonVertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
  pop();

  // Update and draw globular splines
  for (let s of globularSplines) {
    s.points = [];
    const segments = 30;
    for (let i = 0; i < segments; i++) {
      const angle = TWO_PI * i / segments + time * s.speed + s.phase;
      const radius = 50 + sin(time * 0.7 + angle * 2) * 20;
      const x = width/2 + cos(angle) * radius;
      const y = height/2 + sin(angle) * radius;
      s.points.push(createVector(x, y));
    }

    // Draw spline
    push();
    noFill();
    stroke(s.color);
    strokeWeight(2);
    beginShape();
    for (let p of s.points) {
      curveVertex(p.x, p.y);
    }
    endShape(CLOSE);
    pop();
  }

  // Update and draw shards
  for (let shard of shards) {
    shard.pos.x += sin(time * shard.speed) * 0.5;
    shard.pos.y += cos(time * shard.speed) * 0.5;
    
    const pulse = sin(time * 2 + shard.phase) * 0.5 + 0.5;
    const size = shard.size * (0.8 + pulse * 0.4);
    
    // Draw glowing shard
    push();
    noStroke();
    fill(255, 200, 50, 100);
    ellipse(shard.pos.x, shard.pos.y, size * 2);
    fill(255, 100, 0, 150);
    ellipse(shard.pos.x, shard.pos.y, size);
    
    // Draw sharp edges
    stroke(255, 255, 255, 200);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI * i / 6 + time * shard.speed;
      const x = shard.pos.x + cos(angle) * size;
      const y = shard.pos.y + sin(angle) * size;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  // Draw intersections
  for (let s of globularSplines) {
    for (let shard of shards) {
      const dx = s.points[0].x - shard.pos.x;
      const dy = s.points[0].y - shard.pos.y;
      const dist = sqrt(dx * dx + dy * dy);
      
      if (dist < shard.size * 1.5) {
        push();
        stroke(255, 200, 100, 100);
        strokeWeight(1);
        noFill();
        beginShape();
        for (let p of s.points) {
          vertex(p.x, p.y);
        }
        endShape(CLOSE);
        pop();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
