let drones = [];
let searchlights = [];
let contrails = [];
let gridSize = 20;
let gridSpacing = 30;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  centerX = width / 2;
  centerY = height / 2;
  
  // Create drones
  for (let i = 0; i < 50; i++) {
    drones.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-1000, -500),
      vx: random(-1, 1),
      vy: random(-1, 1),
      vz: random(-1, 1),
      size: random(2, 6),
      color: color(random(100, 255), random(100, 255), 255),
      trail: []
    });
  }
  
  // Create searchlights
  for (let i = 0; i < 8; i++) {
    searchlights.push({
      angle: i * TWO_PI / 8,
      speed: random(0.001, 0.005),
      size: random(200, 400),
      color: color(random(200, 255), random(200, 255), 255, 100)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.2) * 300;
  let camY = cos(time * 0.15) * 100;
  camera(camX, camY, height / 2, 0, 0, 0, 0, 1, 0);
  
  // Draw harbor water
  fill(0, 20, 60);
  noStroke();
  beginShape();
  vertex(-width/2, height/3, -1000);
  vertex(width/2, height/3, -1000);
  vertex(width/2, height/3, 1000);
  vertex(-width/2, height/3, 1000);
  endShape(CLOSE);
  
  // Draw buildings
  drawBuildings();
  
  // Update and draw drones
  for (let drone of drones) {
    updateDrone(drone);
    drawDrone(drone);
  }
  
  // Draw searchlights
  for (let light of searchlights) {
    drawSearchlight(light);
  }
}

function updateDrone(drone) {
  // Update position
  drone.x += drone.vx;
  drone.y += drone.vy;
  drone.z += drone.vz;
  
  // Add to trail
  drone.trail.push({x: drone.x, y: drone.y, z: drone.z});
  if (drone.trail.length > 20) {
    drone.trail.shift();
  }
  
  // Bounce off boundaries
  if (abs(drone.x) > width/2 - 50) drone.vx *= -1;
  if (abs(drone.y) > height/2 - 50) drone.vy *= -1;
  if (drone.z < -1000) drone.z = -500;
}

function drawDrone(drone) {
  push();
  translate(drone.x, drone.y, drone.z);
  
  // Draw drone body
  fill(drone.color);
  noStroke();
  sphere(drone.size);
  
  // Draw contrail
  if (drone.trail.length > 1) {
    stroke(255, 200);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < drone.trail.length; i++) {
      let p = drone.trail[i];
      vertex(p.x - drone.x, p.y - drone.y, p.z - drone.z);
    }
    endShape();
  }
  
  pop();
}

function drawBuildings() {
  // Draw city skyline
  for (let x = -width/2; x < width/2; x += gridSpacing) {
    for (let z = -1000; z < 1000; z += gridSpacing * 2) {
      if (random() > 0.7) {
        let height = random(100, 300);
        push();
        translate(x, height/2 - height/2, z);
        fill(random(30, 60));
        noStroke();
        box(gridSpacing * 0.8, height, gridSpacing * 0.8);
        pop();
      }
    }
  }
}

function drawSearchlight(light) {
  // Update light angle
  light.angle += light.speed;
  
  let x = cos(light.angle) * 500;
  let z = sin(light.angle) * 500;
  
  // Draw beam
  push();
  translate(x, -height/4, z);
  rotateY(light.angle);
  
  fill(light.color);
  noStroke();
  cone(100, 500, 8, 1, false);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Change drone formation on click
  for (let i = 0; i < drones.length; i++) {
    let drone = drones[i];
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 - 100 && mouseY < height/2 + 100) {
      drone.vx += random(-0.5, 0.5);
      drone.vy += random(-0.5, 0.5);
    }
  }
}

function mouseDragged() {
  // Shift formation on drag
  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;
  
  for (let drone of drones) {
    drone.x += dx * 0.1;
    drone.y += dy * 0.1;
  }
}
