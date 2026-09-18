let buildings = [];
let cars = [];
let streetlights = [];
let skyColor;

function setup() {
  createCanvas(800, 600, WEBGL);
  skyColor = color(135, 206, 235);

  // Generate buildings
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let w = random(40, 100);
    let h = random(80, 200);
    let d = random(40, 100);
    buildings.push({ x, z, w, h, d });
  }

  // Generate cars
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let y = 0;
    let speed = random(0.5, 2);
    cars.push({ x, z, y, speed });
  }

  // Generate streetlights
  for (let i = 0; i < 30; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    streetlights.push({ x, z });
  }
}

function draw() {
  background(skyColor);

  // Camera
  rotateX(PI / 3);
  rotateY(frameCount * 0.005);
  translate(0, 0, -500);

  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(100, 100, 120);
    noStroke();
    box(building.w, building.h, building.d);
    pop();
  }

  // Draw streetlights
  for (let light of streetlights) {
    push();
    translate(light.x, 0, light.z);
    fill(255, 215, 0);
    noStroke();
    sphere(5);
    pop();
  }

  // Draw cars
  for (let car of cars) {
    push();
    translate(car.x, car.y, car.z);
    fill(220, 20, 60);
    noStroke();
    box(30, 15, 10);
    pop();
  }

  // Draw ground
  fill(50, 50, 50);
  noStroke();
  plane(width, height);
}
