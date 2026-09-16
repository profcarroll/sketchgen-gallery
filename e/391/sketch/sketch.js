let tunnels = [];
let cameraOffset = { x: 0, y: 0, z: 0 };
let lightSources = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate initial tunnel network
  for (let i = 0; i < 50; i++) {
    tunnels.push({
      x: random(-1000, 1000),
      y: random(-1000, 1000),
      z: random(-1000, 1000),
      width: random(50, 150),
      height: random(50, 150),
      depth: random(50, 200),
      rotation: random(TWO_PI),
      color: color(random(50, 150), random(50, 150), random(100, 200)),
      connections: []
    });
  }

  // Connect tunnels
  for (let i = 0; i < tunnels.length; i++) {
    const t1 = tunnels[i];
    for (let j = i + 1; j < tunnels.length; j++) {
      const t2 = tunnels[j];
      const d = dist(t1.x, t1.y, t1.z, t2.x, t2.y, t2.z);
      if (d < 300) {
        t1.connections.push(j);
        t2.connections.push(i);
      }
    }
  }

  // Add light sources
  for (let i = 0; i < 20; i++) {
    lightSources.push({
      x: random(-1000, 1000),
      y: random(-1000, 1000),
      z: random(-1000, 1000),
      r: random(100, 255),
      g: random(100, 255),
      b: random(100, 255),
      size: random(200, 400)
    });
  }
}

function draw() {
  background(10, 15, 25);

  // Update camera based on mouse position
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    cameraOffset.x += (pmouseX - mouseX) * 0.05;
    cameraOffset.y += (pmouseY - mouseY) * 0.05;
  }

  // Camera setup with slight animation
  const time = frameCount * 0.001;
  const camX = sin(time) * 200 + cameraOffset.x;
  const camY = cos(time * 0.7) * 100 + cameraOffset.y;
  const camZ = 300;

  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw light sources
  for (let i = 0; i < lightSources.length; i++) {
    const l = lightSources[i];
    pointLight(l.r, l.g, l.b, l.x, l.y, l.z);
  }

  // Draw tunnels and connections
  for (let i = 0; i < tunnels.length; i++) {
    const t = tunnels[i];

    push();
    translate(t.x, t.y, t.z);
    rotateY(t.rotation);

    // Draw tunnel body
    fill(t.color);
    box(t.width, t.height, t.depth);

    // Draw connections between tunnels
    for (let j = 0; j < t.connections.length; j++) {
      const c = t.connections[j];
      const target = tunnels[c];

      stroke(150, 200, 255, 100);
      strokeWeight(2);
      line(0, 0, 0, target.x - t.x, target.y - t.y, target.z - t.z);
    }

    pop();
  }

  // Add some glowing particles in the air
  for (let i = 0; i < 100; i++) {
    const x = sin(time + i * 0.1) * 500;
    const y = cos(time * 0.7 + i * 0.1) * 500;
    const z = sin(time * 0.3 + i * 0.1) * 500;

    push();
    translate(x, y, z);
    fill(255, 200, 100, 150);
    sphere(5);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
