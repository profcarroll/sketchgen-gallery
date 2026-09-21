let cars = [];
let trackPoints = [];
let numCars = 8;
let carWidth = 12;
let carLength = 20;

function setup() {
  createCanvas(800, 600);
  
  // Create winding track using bezier curves
  for (let i = 0; i <= 100; i++) {
    let t = i / 100;
    let x = 200 + 400 * sin(t * PI * 2) + 100 * cos(t * PI * 4);
    let y = 300 + 200 * cos(t * PI * 1.5) + 150 * sin(t * PI * 3);
    trackPoints.push(createVector(x, y));
  }
  
  // Create cars at different starting positions
  for (let i = 0; i < numCars; i++) {
    let startPos = floor(i * trackPoints.length / numCars);
    cars.push({
      pos: startPos,
      speed: 0.5 + random(0.5, 2),
      offset: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
}

function draw() {
  background(40, 40, 50);
  
  // Draw the track (grey ribbon)
  stroke(100, 100, 100);
  strokeWeight(50);
  noFill();
  
  beginShape();
  for (let p of trackPoints) {
    vertex(p.x, p.y);
  }
  endShape();
  
  // Update and draw cars
  for (let car of cars) {
    car.pos += car.speed;
    if (car.pos >= trackPoints.length) {
      car.pos -= trackPoints.length;
    }
    
    let currentPt = trackPoints[floor(car.pos) % trackPoints.length];
    let nextPt = trackPoints[(floor(car.pos) + 1) % trackPoints.length];
    
    // Draw car as a rectangle facing along the track
    push();
    translate(currentPt.x, currentPt.y);
    
    // Calculate angle based on track direction
    let angle = atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x);
    rotate(angle + car.offset);
    
    // Draw car body
    fill(car.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, carLength, carWidth);
    
    // Draw car details
    fill(255);
    ellipse(-carLength/4, 0, 4, 4);
    ellipse(carLength/4, 0, 4, 4);
    pop();
  }
}

function mousePressed() {
  userStartAudio();
}
