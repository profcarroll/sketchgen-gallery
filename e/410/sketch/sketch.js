let marble;
let channel;
let camera;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = {
    x: 0,
    y: -200,
    z: 0,
    radius: 15,
    vx: 0,
    vy: 0,
    vz: 0,
    speed: 0.8
  };

  channel = [];
  const segments = 100;
  for (let i = 0; i < segments; i++) {
    const t = map(i, 0, segments - 1, 0, TWO_PI);
    const r = 200 + sin(t * 3) * 50;
    const h = map(i, 0, segments - 1, -300, 300);
    channel.push({ x: r * cos(t), y: h, z: r * sin(t) });
  }

  camera = { x: 0, y: 0, z: 500 };
}

function draw() {
  background(20);

  // Update marble physics
  const currentSegment = Math.floor((marble.y + 300) / 6);
  if (currentSegment >= 0 && currentSegment < channel.length - 1) {
    const seg = channel[currentSegment];
    const nextSeg = channel[currentSegment + 1];

    // Calculate direction vector
    const dx = nextSeg.x - seg.x;
    const dy = nextSeg.y - seg.y;
    const dz = nextSeg.z - seg.z;

    // Normalize and apply gravity
    const len = sqrt(dx * dx + dy * dy + dz * dz);
    const nx = dx / len;
    const ny = dy / len;
    const nz = dz / len;

    marble.vx += nx * 0.02;
    marble.vy += ny * 0.02;
    marble.vz += nz * 0.02;

    // Add some friction
    marble.vx *= 0.98;
    marble.vy *= 0.98;
    marble.vz *= 0.98;

    // Update position
    marble.x += marble.vx;
    marble.y += marble.vy;
    marble.z += marble.vz;

    // Apply a sudden curve at certain points to simulate pause
    if (abs(marble.y) > 100 && abs(marble.y) < 120) {
      marble.vx *= 0.5;
      marble.vz *= 0.5;
      marble.vy = 0;
    }
  }

  // Camera follows marble
  camera.x = marble.x * 0.8;
  camera.y = marble.y * 0.8 - 100;
  camera.z = marble.z * 0.8 + 300;

  // Draw the funnel channel
  push();
  translate(0, 0, 0);
  stroke(255, 100);
  noFill();
  beginShape();
  for (let i = 0; i < channel.length; i++) {
    const p = channel[i];
    vertex(p.x, p.y, p.z);
  }
  endShape(CLOSE);

  // Draw inner walls
  stroke(255, 50);
  noFill();
  beginShape();
  for (let i = 0; i < channel.length; i++) {
    const p = channel[i];
    vertex(p.x * 0.8, p.y, p.z * 0.8);
  }
  endShape(CLOSE);

  pop();

  // Draw marble
  push();
  translate(marble.x, marble.y, marble.z);
  noStroke();
  fill(255, 100, 100);
  sphere(marble.radius);
  pop();
}
