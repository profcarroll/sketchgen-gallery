let drones = [];
let water;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize water surface as a grid of points
  water = new WaterSurface();
  
  // Create initial drones with random positions and colors
  for (let i = 0; i < 15; i++) {
    drones.push({
      x: random(width),
      y: random(height * 0.3, height * 0.6),
      z: random(-200, 200),
      size: random(8, 15),
      color: color(random(100, 255), random(100, 255), random(200, 255)),
      speed: random(0.5, 2),
      formationTime: millis() + random(3000, 8000)
    });
  }
}

function draw() {
  background(10, 10, 30);
  
  time += 0.02;
  
  // Draw cityscape
  drawCityscape();
  
  // Draw water surface with pulsating reflections
  water.update(time);
  water.display();
  
  // Update and draw drones
  for (let drone of drones) {
    updateDrone(drone);
    drawDrone(drone);
  }
  
  // Occasionally form geometric patterns
  if (millis() > drones[0].formationTime) {
    formGeometricPattern();
    drones[0].formationTime = millis() + random(5000, 12000);
  }
}

function drawCityscape() {
  // Draw buildings with high contrast lighting
  fill(30, 30, 50);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);
  
  // Buildings
  for (let i = 0; i < 20; i++) {
    let x = map(i, 0, 20, 0, width);
    let h = random(height * 0.15, height * 0.4);
    let w = random(30, 80);
    
    // Building with some windows
    fill(50, 50, 70);
    rect(x, height * 0.6 - h, w, h);
    
    // Windows
    fill(200, 220, 255);
    for (let j = 0; j < 5; j++) {
      if (random() > 0.3) {
        rect(x + random(w * 0.1, w * 0.9), height * 0.6 - h + random(10, h - 20), 
             random(4, 10), random(8, 15));
      }
    }
  }
}

function updateDrone(drone) {
  drone.x += sin(time * drone.speed) * 0.5;
  drone.y += cos(time * drone.speed * 0.7) * 0.3;
  
  // Keep drones within bounds
  if (drone.x > width + 50) drone.x = -50;
  if (drone.x < -50) drone.x = width + 50;
  if (drone.y < 0) drone.y = height;
  if (drone.y > height) drone.y = 0;
}

function drawDrone(drone) {
  push();
  translate(drone.x, drone.y);
  
  // Glow effect
  noStroke();
  fill(red(drone.color), green(drone.color), blue(drone.color), 100);
  ellipse(0, 0, drone.size * 3, drone.size * 3);
  
  // Drone body
  fill(drone.color);
  ellipse(0, 0, drone.size, drone.size);
  
  // Lights
  fill(255, 255, 255, 200);
  ellipse(-drone.size * 0.3, -drone.size * 0.3, drone.size * 0.4, drone.size * 0.4);
  ellipse(drone.size * 0.3, drone.size * 0.3, drone.size * 0.4, drone.size * 0.4);
  
  pop();
}

function formGeometricPattern() {
  // Create temporary formation points
  let points = [];
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let radius = random(width * 0.2, width * 0.4);
    points.push({
      x: width/2 + cos(angle) * radius,
      y: height * 0.3 + sin(angle) * radius
    });
  }
  
  // Draw connecting lines with pulsating effect
  stroke(255, 150);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  
  // Add inner formation
  let innerPoints = [];
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6;
    let radius = random(width * 0.1, width * 0.2);
    innerPoints.push({
      x: width/2 + cos(angle) * radius,
      y: height * 0.3 + sin(angle) * radius
    });
  }
  
  stroke(255, 200);
  strokeWeight(1);
  beginShape();
  for (let p of innerPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

class WaterSurface {
  constructor() {
    this.points = [];
    this.resolution = 20;
    this.waveHeight = 8;
    
    // Initialize grid points
    for (let x = 0; x < width; x += this.resolution) {
      let row = [];
      for (let y = height * 0.6; y < height; y += this.resolution) {
        row.push({x: x, y: y, z: 0});
      }
      this.points.push(row);
    }
  }
  
  update(time) {
    // Animate water surface
    for (let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.points[i].length; j++) {
        let point = this.points[i][j];
        let wave1 = sin(point.x * 0.02 + time) * this.waveHeight;
        let wave2 = cos(point.y * 0.03 + time * 1.2) * this.waveHeight;
        point.z = (wave1 + wave2) * 0.5;
      }
    }
  }
  
  display() {
    // Draw water with dynamic reflections
    noStroke();
    
    for (let i = 0; i < this.points.length - 1; i++) {
      beginShape(TRIANGLE_STRIP);
      for (let j = 0; j < this.points[i].length; j++) {
        let point = this.points[i][j];
        let nextPoint = this.points[i + 1][j];
        
        // Create color based on position and wave height
        let waterColor = lerpColor(color(20, 50, 100), color(10, 80, 150), 
                                   (point.z + this.waveHeight) / (this.waveHeight * 2));
        
        fill(waterColor);
        vertex(point.x, point.y + point.z);
        vertex(nextPoint.x, nextPoint.y + nextPoint.z);
      }
      endShape();
    }
  }
}
