let marble;
let channel;
let ridges = [];
let troughs = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = {
    pos: createVector(0, -250, 0),
    vel: createVector(0, 1, 0),
    radius: 8
  };
  
  channel = [];
  for (let i = 0; i < 100; i++) {
    const angle = map(i, 0, 99, 0, TWO_PI);
    const radius = 200 + sin(i * 0.2) * 50;
    channel.push(createVector(cos(angle) * radius, i * 3 - 150, sin(angle) * radius));
  }
  
  for (let i = 0; i < 20; i++) {
    ridges.push({
      pos: createVector(random(-150, 150), random(-100, 100), random(-150, 150)),
      size: random(20, 40)
    });
    troughs.push({
      pos: createVector(random(-150, 150), random(-100, 100), random(-150, 150)),
      size: random(30, 60)
    });
  }
}

function draw() {
  background(20);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -200, 0);
  
  translate(0, 0, -300);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.003);
  
  // Draw channel
  stroke(100, 150, 255);
  noFill();
  beginShape();
  for (let v of channel) {
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);
  
  // Draw ridges and troughs
  for (let r of ridges) {
    push();
    translate(r.pos.x, r.pos.y, r.pos.z);
    noStroke();
    fill(100, 120, 200, 150);
    sphere(r.size);
    pop();
  }
  
  for (let t of troughs) {
    push();
    translate(t.pos.x, t.pos.y, t.pos.z);
    noStroke();
    fill(80, 100, 180, 150);
    sphere(t.size);
    pop();
  }
  
  // Marble physics
  marble.vel.add(createVector(0, 0.1, 0)); // gravity
  
  // Check collisions with channel walls
  for (let i = 0; i < channel.length - 1; i++) {
    const p1 = channel[i];
    const p2 = channel[i + 1];
    const distToWall = dist(marble.pos.x, marble.pos.y, marble.pos.z, p1.x, p1.y, p1.z);
    
    if (distToWall < 100 && distToWall > 95) {
      const normal = p5.Vector.sub(marble.pos, p1).normalize();
      marble.vel.reflect(normal);
      marble.pos.add(normal.mult(2));
    }
  }
  
  // Update position
  marble.pos.add(marble.vel);
  
  // Draw marble
  push();
  translate(marble.pos.x, marble.pos.y, marble.pos.z);
  noStroke();
  fill(255, 100, 100);
  sphere(marble.radius);
  pop();
}
