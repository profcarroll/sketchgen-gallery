let marble;
let channel;
let gravity;
let basin;

function setup() {
  createCanvas(800, 600, WEBGL);
  marble = { x: 0, y: -250, z: 0, vx: 0, vy: 0, vz: 0 };
  gravity = 0.2;
  channel = generateChannel();
  basin = { x: 0, y: 200, z: 0, width: 100, depth: 50 };
}

function draw() {
  background(30);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 0);
  
  // Draw channel
  push();
  rotateX(PI/4);
  stroke(200);
  noFill();
  for (let i = 0; i < channel.length; i++) {
    beginShape();
    for (let j = 0; j < channel[i].length; j++) {
      vertex(channel[i][j].x, channel[i][j].y, channel[i][j].z);
    }
    endShape(CLOSE);
  }
  pop();

  // Draw basin
  push();
  translate(basin.x, basin.y, basin.z);
  rotateX(PI/2);
  fill(100);
  plane(basin.width, basin.depth);
  pop();

  // Update marble physics
  marble.vy += gravity;
  marble.x += marble.vx;
  marble.y += marble.vy;
  marble.z += marble.vz;

  // Simple collision with channel walls
  if (marble.y > -200 && marble.y < 200) {
    const dx = marble.x - channel[0][0].x;
    const dz = marble.z - channel[0][0].z;
    if (dx * dx + dz * dz < 1000) {
      marble.vx = random(-2, 2);
      marble.vz = random(-2, 2);
    }
  }

  // Marble display
  push();
  translate(marble.x, marble.y, marble.z);
  noStroke();
  fill(255, 200, 50);
  sphere(10);
  pop();

  // Slow down when entering basin
  if (marble.y > basin.y - 30 && marble.y < basin.y + 30) {
    marble.vx *= 0.95;
    marble.vy *= 0.95;
    marble.vz *= 0.95;
  }
}

function generateChannel() {
  const channel = [];
  for (let i = 0; i < 10; i++) {
    const layer = [];
    for (let j = 0; j < 20; j++) {
      const angle = map(j, 0, 19, 0, TWO_PI);
      const radius = 150 + sin(i * 0.5 + j * 0.3) * 50;
      layer.push({
        x: cos(angle) * radius,
        y: -200 + i * 50,
        z: sin(angle) * radius
      });
    }
    channel.push(layer);
  }
  return channel;
}
