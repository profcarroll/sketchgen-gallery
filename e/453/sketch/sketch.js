let shards = [];
let particles = [];
let cameraZ;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  cameraZ = height / (2.0 * tan(PI * 30.0 / 180.0));

  // Create shards
  for (let i = 0; i < 50; i++) {
    shards.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      size: random(10, 30),
      rot: random(TWO_PI),
      speed: random(0.005, 0.02),
      halt: false,
      stability: random(0.8, 1.0)
    });
  }

  // Create particles
  for (let i = 0; i < 300; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(0.5, 2),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(200, 5, 5, 0.9);

  // Camera movement
  let time = millis() * 0.0002;
  camera(
    sin(time) * width/4,
    sin(time*0.7) * height/6,
    cameraZ + sin(time*0.5) * 100,
    0, 0, 0,
    0, 1, 0
  );

  // Draw shards
  for (let shard of shards) {
    push();
    translate(shard.pos.x, shard.pos.y, shard.pos.z);
    rotateZ(shard.rot);

    if (!shard.halt && random() < 0.005) {
      shard.halt = true;
    }

    if (shard.halt) {
      // Stabilize
      fill(180, 70, 90, 0.8);
      stroke(180, 60, 80, 0.9);
      strokeWeight(0.5);
      box(shard.size * 0.8, shard.size * 0.2, shard.size * 0.8);
    } else {
      // Fall and dissolve
      fill(180, 70, 90, 0.6);
      stroke(180, 60, 80, 0.7);
      strokeWeight(0.3);
      box(shard.size * 0.6, shard.size * 0.2, shard.size * 0.6);

      // Dissolve particles
      for (let i = 0; i < 5; i++) {
        let p = particles.find(p => p.life <= 0);
        if (p) {
          p.pos = shard.pos.copy();
          p.vel = p5.Vector.random3D().mult(random(0.1, 0.4));
          p.life = random(100, 200);
        }
      }
    }

    pop();

    // Update position
    if (!shard.halt) {
      shard.pos.y += shard.speed * 5;
      shard.pos.x += sin(time * 10 + shard.pos.z * 0.01) * 0.3;
      shard.rot += 0.01;
    } else {
      // Maintain stability
      shard.size *= 0.995;
    }
  }

  // Draw particles
  noStroke();
  for (let p of particles) {
    if (p.life > 0) {
      fill(180, 40, 90, 0.5);
      push();
      translate(p.pos.x, p.pos.y, p.pos.z);
      sphere(p.size);
      pop();

      p.pos.add(p.vel);
      p.life--;
    }
  }

  // Prevent particles from accumulating
  particles = particles.filter(p => p.life > 0);
}
