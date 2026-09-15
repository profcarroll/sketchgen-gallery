let marble;
let funnel;
let slope;

function setup() {
  createCanvas(600, 600, WEBGL);
  marble = {
    x: 0,
    y: -200,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    radius: 15
  };

  funnel = [];
  for (let i = 0; i < 100; i++) {
    const angle = map(i, 0, 99, 0, TWO_PI);
    const radius = map(i, 0, 99, 250, 50);
    const y = map(i, 0, 99, -200, 100);
    funnel.push({ x: cos(angle) * radius, y: y, z: sin(angle) * radius });
  }

  slope = [];
  for (let i = 0; i < 50; i++) {
    const angle = map(i, 0, 49, 0, PI / 2);
    const x = map(i, 0, 49, -100, 100);
    const y = map(i, 0, 49, 100, 200);
    const z = sin(angle) * 50;
    slope.push({ x: x, y: y, z: z });
  }
}

function draw() {
  background(20, 30, 50);

  // Camera
  rotateX(-0.3);
  rotateY(frameCount * 0.005);

  // Funnel
  noFill();
  stroke(255, 100);
  strokeWeight(2);
  beginShape();
  for (let point of funnel) {
    vertex(point.x, point.y, point.z);
  }
  endShape();

  // Slope
  beginShape();
  for (let point of slope) {
    vertex(point.x, point.y, point.z);
  }
  endShape();

  // Marble physics
  marble.vy += 0.2; // gravity

  marble.x += marble.vx;
  marble.y += marble.vy;
  marble.z += marble.vz;

  // Funnel collision
  const funnelRadius = map(marble.y, -200, 100, 250, 50);
  const distanceFromCenter = dist(marble.x, marble.z, 0, 0);
  if (distanceFromCenter > funnelRadius - marble.radius) {
    const angle = atan2(marble.z, marble.x);
    marble.x = cos(angle) * (funnelRadius - marble.radius);
    marble.z = sin(angle) * (funnelRadius - marble.radius);
    marble.vx *= 0.9;
    marble.vz *= 0.9;
  }

  // Slope collision
  if (marble.y > 100) {
    const slopeIndex = map(marble.y, 100, 200, 0, slope.length - 1);
    const i = floor(slopeIndex);
    const t = slopeIndex - i;
    if (i < slope.length - 1) {
      const p1 = slope[i];
      const p2 = slope[i + 1];
      const targetY = lerp(p1.y, p2.y, t);
      if (marble.y > targetY - marble.radius && marble.y < targetY + marble.radius) {
        marble.y = targetY;
        marble.vy *= 0.9;
        marble.vx += 0.05 * sin(frameCount * 0.05);
        marble.vz += 0.05 * cos(frameCount * 0.05);
      }
    }
  }

  // Marble
  push();
  translate(marble.x, marble.y, marble.z);
  noStroke();
  fill(255, 100, 100);
  sphere(marble.radius);
  pop();
}
