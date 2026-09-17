let drones = [];
let buildings = [];
let water;
let grid = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create buildings
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let h = random(50, 200);
    let w = random(20, 60);
    let d = random(20, 60);
    buildings.push({x, y: h/2, z, w, d, h});
  }

  // Create drones
  for (let i = 0; i < 15; i++) {
    drones.push({
      x: random(-width/2, width/2),
      y: random(50, 150),
      z: random(-height/2, height/2),
      targetX: random(-width/2, width/2),
      targetY: random(50, 150),
      targetZ: random(-height/2, height/2),
      speed: random(0.5, 2),
      color: color(random(360), 80, 90),
      size: random(2, 6)
    });
  }

  // Create grid for hover detection
  let gridSize = 50;
  for (let x = -width/2; x < width/2; x += gridSize) {
    for (let z = -height/2; z < height/2; z += gridSize) {
      grid.push({x, z});
    }
  }
}

function draw() {
  background(0);
  noStroke();

  // Ambient lighting
  ambientLight(50);

  // Dynamic light from drones
  for (let drone of drones) {
    pointLight(drone.color, drone.x, drone.y, drone.z);
  }

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x, b.y, b.z);
    box(b.w, b.h, b.d);
    pop();
  }

  // Draw water
  fill(200, 30, 20);
  noStroke();
  plane(width, height);

  // Update and draw drones
  for (let drone of drones) {
    // Move towards target
    let dx = drone.targetX - drone.x;
    let dy = drone.targetY - drone.y;
    let dz = drone.targetZ - drone.z;

    if (abs(dx) > 0.5 || abs(dy) > 0.5 || abs(dz) > 0.5) {
      drone.x += dx * drone.speed * 0.01;
      drone.y += dy * drone.speed * 0.01;
      drone.z += dz * drone.speed * 0.01;
    } else {
      // Set new target
      drone.targetX = random(-width/2, width/2);
      drone.targetY = random(50, 150);
      drone.targetZ = random(-height/2, height/2);
    }

    push();
    translate(drone.x, drone.y, drone.z);
    fill(drone.color);
    sphere(drone.size);
    pop();
  }

  // Hover interaction
  let mouseXWorld = map(mouseX, 0, width, -width/2, width/2);
  let mouseZWorld = map(mouseY, 0, height, -height/2, height/2);

  // Check if mouse is over any grid cell
  for (let cell of grid) {
    let dx = mouseXWorld - cell.x;
    let dz = mouseZWorld - cell.z;
    if (abs(dx) < 25 && abs(dz) < 25) {
      // Form temporary geometric arrangement
      let arr = [];
      for (let i = 0; i < 8; i++) {
        let angle = TWO_PI * i / 8;
        let radius = 100;
        let x = cell.x + cos(angle) * radius;
        let z = cell.z + sin(angle) * radius;
        arr.push({x, z});
      }

      // Draw temporary formation
      stroke(255, 100);
      noFill();
      beginShape();
      for (let p of arr) {
        vertex(p.x, 0, p.z);
      }
      endShape(CLOSE);

      break;
    }
  }
}
