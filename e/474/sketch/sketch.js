let rays = [];
const numRays = 200;
const maxLife = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  // Initialize rays with random directions and positions
  for (let i = 0; i < numRays; i++) {
    const angle = random(TWO_PI);
    const radius = random(50, 200);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    const z = random(-100, 100);
    rays.push({
      pos: createVector(x, y, z),
      dir: p5.Vector.random3D(),
      life: maxLife,
      color: color(random(20, 40), 80, 90, 0.8)
    });
  }
}

function draw() {
  background(0);
  // Ambient lighting
  ambientLight(100);
  pointLight(255, 255, 255, 0, 0, 300);
  
  // Camera movement for dynamic view
  const time = millis() * 0.0005;
  camera(
    sin(time) * 500,
    cos(time * 0.7) * 300,
    sin(time * 0.5) * 400 + 300,
    0, 0, 0,
    0, 1, 0
  );

  // Draw architecture planes
  push();
  rotateX(PI / 2);
  fill(30, 20, 20, 0.2);
  plane(800, 800);
  pop();

  push();
  rotateY(PI / 2);
  fill(30, 20, 20, 0.2);
  plane(800, 800);
  pop();

  // Draw central light source
  push();
  noStroke();
  fill(60, 100, 100, 0.9);
  sphere(30);
  pop();

  // Update and draw rays
  beginShape(LINES);
  for (let i = rays.length - 1; i >= 0; i--) {
    const ray = rays[i];
    if (ray.life <= 0) {
      rays.splice(i, 1);
      continue;
    }

    ray.life--;
    const alpha = map(ray.life, 0, maxLife, 0, 1);

    // Update position
    ray.pos.add(ray.dir.copy().mult(2));

    // Draw ray as a line segment with dynamic glow
    const prevPos = ray.pos.copy().sub(ray.dir.copy().mult(2));
    
    // Color blending for glow effect
    const hue = (ray.color.levels[0] + time * 10) % 360;
    const col = color(hue, ray.color.levels[1], ray.color.levels[2], alpha);
    fill(col);

    vertex(prevPos.x, prevPos.y, prevPos.z);
    vertex(ray.pos.x, ray.pos.y, ray.pos.z);
  }
  endShape();

  // Add new rays occasionally
  if (random() < 0.3) {
    const angle = random(TWO_PI);
    const radius = random(50, 200);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    const z = random(-100, 100);
    rays.push({
      pos: createVector(x, y, z),
      dir: p5.Vector.random3D(),
      life: maxLife,
      color: color(random(20, 40), 80, 90, 0.8)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
