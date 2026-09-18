let marble;
let channel;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = {
    pos: createVector(-200, -200, 0),
    vel: createVector(2, 3, 0),
    radius: 10
  };
  
  channel = [];
  for (let i = 0; i < 50; i++) {
    let x = map(i, 0, 49, -250, 250);
    let y = sin(i * 0.3) * 100;
    let z = map(i, 0, 49, 0, 300);
    channel.push(createVector(x, y, z));
  }
}

function draw() {
  background(30);
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 300);
  
  // Draw channel
  stroke(180);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let v of channel) {
    vertex(v.x, v.y, v.z);
  }
  endShape();
  
  // Marble physics
  marble.vel.add(createVector(0, 0.1, 0)); // gravity
  marble.pos.add(marble.vel);
  
  // Simple collision with channel walls
  let closest = channel[0];
  let minDist = Infinity;
  for (let v of channel) {
    let d = dist(marble.pos.x, marble.pos.y, marble.pos.z, v.x, v.y, v.z);
    if (d < minDist) {
      minDist = d;
      closest = v;
    }
  }
  
  if (minDist < 50) {
    let dir = p5.Vector.sub(closest, marble.pos);
    dir.normalize();
    dir.mult(0.1);
    marble.vel.add(dir);
  }
  
  // Draw marble
  push();
  translate(marble.pos.x, marble.pos.y, marble.pos.z);
  noStroke();
  fill(200, 200, 220);
  sphere(marble.radius);
  pop();
}
