let city, plankton, plants;
let time = 0;
let cameraZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  // Build city grid
  city = [];
  const gridSize = 20;
  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      if (x === 0 && z === 0) continue;
      const height = random(10, 50);
      city.push({ x: x * 30, z: z * 30, h: height });
    }
  }

  // Initialize plankton
  plankton = [];
  for (let i = 0; i < 200; i++) {
    plankton.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, -500),
      size: random(3, 8),
      speed: random(0.2, 0.8)
    });
  }

  // Initialize plants
  plants = [];
  for (let i = 0; i < 100; i++) {
    plants.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: random(5, 20),
      color: color(random(50, 255), random(200, 255), random(50, 150), 200)
    });
  }
}

function draw() {
  time += 0.005;
  
  background(10, 15, 30);
  
  // Camera movement
  cameraZ = map(sin(time * 0.2), -1, 1, -400, -800);
  camera(0, 0, cameraZ, 0, 0, 0, 0, 1, 0);

  // Atmosphere lighting
  const lightIntensity = map(sin(time * 0.5), -1, 1, 0.2, 0.8);
  ambientLight(20, 30, 60);
  pointLight(255, 255, 255, 0, -200, 0);
  pointLight(255, 200, 100, 300, 200, 300);

  // Draw city
  for (let building of city) {
    push();
    translate(building.x, 0, building.z);
    rotateX(HALF_PI);
    fill(60, 70, 100);
    noStroke();
    
    // Building base
    box(20, building.h, 20);
    
    // Reflective top
    fill(80, 90, 130, 150);
    push();
    translate(0, building.h/2, 0);
    sphere(15, 4, 4);
    pop();
    
    pop();
  }

  // Draw plankton
  for (let p of plankton) {
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(255, 200, 100, 180);
    sphere(p.size, 3, 3);
    pop();
    
    // Update position
    p.z += p.speed;
    if (p.z > 0) {
      p.z = -1000;
      p.x = random(-width/2, width/2);
      p.y = random(-height/2, height/2);
    }
  }

  // Draw plants
  for (let plant of plants) {
    push();
    translate(plant.x, 0, plant.z);
    noStroke();
    fill(plant.color);
    sphere(plant.size, 6, 6);
    pop();
  }

  // Pulsing city lights
  const pulse = sin(time * 3) * 0.2 + 0.8;
  for (let building of city) {
    push();
    translate(building.x, 0, building.z);
    fill(255, 200, 100, 100 * pulse);
    noStroke();
    sphere(3, 4, 4);
    pop();
  }

  // Glowing paths
  beginShape(LINES);
  stroke(100, 255, 200, 100);
  for (let i = 0; i < plankton.length - 1; i++) {
    const p1 = plankton[i];
    const p2 = plankton[i + 1];
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();
}
