let vehicles = [];
let buildings = [];
let streetLights = [];
let cameraOffset = { x: 0, z: 0 };
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Generate buildings
  for (let i = 0; i < 50; i++) {
    const x = random(-1000, 1000);
    const z = random(-1000, 1000);
    const width = random(30, 80);
    const depth = random(30, 80);
    const height = random(50, 200);
    buildings.push({ x, z, width, depth, height });
  }

  // Generate street lights
  for (let i = 0; i < 100; i++) {
    const x = random(-1000, 1000);
    const z = random(-1000, 1000);
    streetLights.push({ x, z });
  }

  // Generate vehicles
  for (let i = 0; i < 50; i++) {
    vehicles.push({
      x: random(-1000, 1000),
      z: random(-1000, 1000),
      speed: random(0.5, 3),
      angle: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255)),
    });
  }
}

function draw() {
  background(50, 80, 150);
  time += 0.01;

  // Camera movement
  cameraOffset.x = sin(time * 0.2) * 500;
  cameraOffset.z = cos(time * 0.2) * 500;
  camera(0, 300, 600 + time * 50, 0, 0, 0, 0, 1, 0);

  // Draw ground
  fill(100);
  noStroke();
  plane(2000, 2000);

  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(150, 150, 180);
    noStroke();
    box(building.width, building.height, building.depth);
    
    // Building windows
    fill(255, 255, 200, 180);
    for (let x = -building.width/2 + 5; x < building.width/2; x += 10) {
      for (let z = -building.depth/2 + 5; z < building.depth/2; z += 10) {
        if (random() > 0.7) {
          push();
          translate(x, building.height/2 - 5, z);
          box(4, 6, 4);
          pop();
        }
      }
    }
    pop();
  }

  // Draw street lights
  for (let light of streetLights) {
    push();
    translate(light.x, 0, light.z);
    fill(255, 255, 100);
    noStroke();
    sphere(3);
    
    // Light cone
    fill(255, 255, 100, 50);
    cone(10, 20);
    pop();
  }

  // Draw vehicles
  for (let vehicle of vehicles) {
    push();
    translate(vehicle.x, 0, vehicle.z);
    rotateY(vehicle.angle);
    
    // Vehicle body
    fill(vehicle.color);
    noStroke();
    box(20, 10, 40);
    
    // Vehicle lights
    fill(255, 255, 0);
    noStroke();
    sphere(3); // Front light
    
    pop();

    // Update position
    vehicle.x += cos(vehicle.angle) * vehicle.speed;
    vehicle.z += sin(vehicle.angle) * vehicle.speed;
    
    // Wrap around the world
    if (vehicle.x > 1000 || vehicle.x < -1000) vehicle.x *= -1;
    if (vehicle.z > 1000 || vehicle.z < -1000) vehicle.z *= -1;
    
    // Occasionally change direction
    if (random() < 0.005) {
      vehicle.angle += random(-0.3, 0.3);
    }
  }

  // Draw horizon
  fill(200, 220, 255);
  noStroke();
  plane(2000, 100);
}
