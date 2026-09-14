let car;
let road;
let speed = 0;
let maxSpeed = 8;
let acceleration = 0.1;
let braking = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  car = {
    x: width / 2,
    y: height - 100,
    width: 40,
    height: 20,
    steering: 0
  };
  road = {
    lanes: 3,
    laneWidth: width / 3,
    markings: []
  };
  // Initialize road markings
  for (let i = 0; i < 20; i++) {
    road.markings.push({
      x: width / 2,
      y: i * 60
    });
  }
}

function draw() {
  background(50, 150, 50);
  
  // Draw sky
  fill(135, 206, 235);
  noStroke();
  rect(0, 0, width, height / 2);
  
  // Draw road
  fill(30);
  rect(0, height / 2, width, height / 2);
  
  // Draw road markings
  fill(255);
  for (let marking of road.markings) {
    rect(marking.x - 10, marking.y, 20, 30);
  }
  
  // Update car speed
  if (braking) {
    speed = max(speed - 0.3, 0);
  } else {
    speed = min(speed + acceleration, maxSpeed);
  }
  
  // Update car position based on steering
  car.x += car.steering * 5;
  car.x = constrain(car.x, car.width / 2, width - car.width / 2);
  
  // Update road markings for motion effect
  for (let marking of road.markings) {
    marking.y += speed;
    if (marking.y > height) {
      marking.y = -30;
    }
  }
  
  // Draw car
  fill(255, 0, 0);
  rect(car.x - car.width / 2, car.y - car.height / 2, car.width, car.height);
  
  // Draw car details
  fill(0);
  rect(car.x - car.width / 2 + 5, car.y - car.height / 2 + 5, 10, 10);
  rect(car.x + car.width / 2 - 15, car.y - car.height / 2 + 5, 10, 10);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    car.steering = -1;
  } else if (keyCode === RIGHT_ARROW) {
    car.steering = 1;
  } else if (key === ' ') {
    braking = true;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    car.steering = 0;
  } else if (key === ' ') {
    braking = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
