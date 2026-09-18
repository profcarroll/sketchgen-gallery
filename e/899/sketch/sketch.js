let streams = [];
let residueParticles = [];
const NUM_STREAMS = 5;
const NUM_PARTICLES_PER_STREAM = 100;
const STREAM_RADIUS = 80;
const PARTICLE_SIZE = 2;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create data streams
  for (let i = 0; i < NUM_STREAMS; i++) {
    let stream = {
      points: [],
      hue: (i * 72) % 360,
      speed: random(0.005, 0.02),
      time: random(TWO_PI)
    };

    // Create helical path
    for (let j = 0; j < NUM_PARTICLES_PER_STREAM; j++) {
      let t = map(j, 0, NUM_PARTICLES_PER_STREAM - 1, 0, TWO_PI * 4);
      let x = cos(t) * STREAM_RADIUS;
      let y = sin(t) * STREAM_RADIUS;
      let z = t * 5;
      stream.points.push(createVector(x, y, z));
    }

    streams.push(stream);
  }
}

function draw() {
  background(0);

  // Rotate view slowly
  rotateY(frameCount * 0.001);
  rotateX(sin(frameCount * 0.0005) * 0.2);

  // Draw data streams
  for (let stream of streams) {
    stream.time += stream.speed;

    beginShape();
    noFill();
    stroke(stream.hue, 100, 100, 0.8);
    strokeWeight(3);

    for (let i = 0; i < stream.points.length; i++) {
      let t = stream.time + i * 0.1;
      let p = stream.points[i];

      // Add helical motion
      let x = p.x + cos(t) * 20;
      let y = p.y + sin(t) * 20;
      let z = p.z + sin(t * 0.5) * 30;

      vertex(x, y, z);
    }
    endShape();

    // Emit sparks
    for (let i = 0; i < 2; i++) {
      let t = stream.time + random(TWO_PI);
      let p = stream.points[int(random(stream.points.length))];

      let x = p.x + cos(t) * 20;
      let y = p.y + sin(t) * 20;
      let z = p.z + sin(t * 0.5) * 30;

      // Add residue particle
      residueParticles.push({
        pos: createVector(x, y, z),
        hue: stream.hue,
        life: 1.0
      });
    }
  }

  // Draw and update residue particles
  noStroke();
  for (let i = residueParticles.length - 1; i >= 0; i--) {
    let p = residueParticles[i];

    fill(p.hue, 80, 90, p.life);
    ellipse(p.pos.x, p.pos.y, PARTICLE_SIZE * p.life);

    p.life -= 0.01;
    if (p.life <= 0) {
      residueParticles.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
