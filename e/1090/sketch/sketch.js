let shards = [];
const numShards = 150;
let explosion = false;
let explosionTime = 0;
let cameraZ;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cameraZ = (height / 2.0) / tan(PI * 30.0 / 180.0);

  for (let i = 0; i < numShards; i++) {
    shards.push({
      pos: createVector(random(-width/4, width/4), random(-height/4, height/4), random(-200, 200)),
      rot: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(random(-0.005, 0.005), random(-0.005, 0.005), random(-0.005, 0.005)),
      vel: createVector(0, 0, 0),
      size: random(20, 60),
      color: color(random(180, 255), random(180, 255), random(220, 255), 200),
      originalPos: createVector(0, 0, 0)
    });
  }
}

function draw() {
  background(0);
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 0);

  // Camera movement
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.001);

  // Handle explosion effect
  if (explosion) {
    explosionTime++;
    if (explosionTime > 60) {
      explosion = false;
      explosionTime = 0;
    }
  }

  for (let shard of shards) {
    // Update rotation
    shard.rot.add(shard.rotSpeed);

    // Apply explosion force if active
    if (explosion) {
      let force = p5.Vector.sub(shard.pos, createVector(0, 0, 0));
      force.normalize();
      force.mult(0.1);
      shard.vel.add(force);
    }

    // Update position with velocity
    shard.pos.add(shard.vel);

    // Apply drag to slow down shards
    if (!explosion) {
      shard.vel.mult(0.95);
    }

    // Return to original position if not exploding
    if (!explosion && explosionTime === 0) {
      let target = shard.originalPos;
      let dir = p5.Vector.sub(target, shard.pos);
      dir.normalize();
      dir.mult(0.01);
      shard.vel.add(dir);
    }

    push();
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    rotateX(shard.rot.x);
    rotateY(shard.rot.y);
    rotateZ(shard.rot.z);

    // Draw shard with jagged edges
    noStroke();
    fill(shard.color);
    drawJaggedShard(shard.size);
    pop();
  }
}

function drawJaggedShard(size) {
  beginShape(QUADS);
  for (let i = 0; i < 8; i++) {
    let angle1 = TWO_PI * i / 8;
    let angle2 = TWO_PI * (i + 1) / 8;
    let x1 = cos(angle1) * size;
    let y1 = sin(angle1) * size;
    let x2 = cos(angle2) * size;
    let y2 = sin(angle2) * size;

    // Add jagged edges
    let jaggedX1 = x1 + random(-size/4, size/4);
    let jaggedY1 = y1 + random(-size/4, size/4);
    let jaggedX2 = x2 + random(-size/4, size/4);
    let jaggedY2 = y2 + random(-size/4, size/4);

    vertex(jaggedX1, jaggedY1, 0);
    vertex(jaggedX2, jaggedY2, 0);
    vertex(jaggedX2, jaggedY2, size/2);
    vertex(jaggedX1, jaggedY1, size/2);
  }
  endShape();
}

function mousePressed() {
  explosion = true;
  explosionTime = 0;
}
