let plants = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(135, 206, 235); // Sky blue background
  
  // Draw ground
  fill(34, 139, 34);
  rect(0, height * 0.7, width, height * 0.3);
  
  time += 0.01;
  
  // Add new plants occasionally
  if (random() < 0.02) {
    plants.push({
      x: random(width),
      y: height * 0.7,
      height: 0,
      maxH: random(50, 150),
      age: 0,
      color: color(random(100, 255), random(50, 150), random(50, 100)),
      fruitColor: color(random(200, 255), random(50, 150), random(50, 100)),
      sway: 0,
      swaySpeed: random(0.01, 0.03)
    });
  }
  
  // Update and draw plants
  for (let i = plants.length - 1; i >= 0; i--) {
    let p = plants[i];
    
    // Grow plant
    if (p.height < p.maxH) {
      p.height += 0.5;
    }
    
    // Age plant
    p.age += 0.01;
    
    // Sway with time
    p.sway = sin(time * p.swaySpeed + p.age) * 3;
    
    // Draw stem
    stroke(101, 67, 33);
    strokeWeight(2);
    line(p.x + p.sway, p.y, p.x + p.sway, p.y - p.height);
    
    // Draw leaves (as a group)
    fill(p.color);
    noStroke();
    ellipse(p.x + p.sway, p.y - p.height * 0.7, p.height * 0.3, p.height * 0.2);
    ellipse(p.x + p.sway, p.y - p.height * 0.5, p.height * 0.25, p.height * 0.15);
    
    // Draw fruit when mature
    if (p.age > 2 && p.height > p.maxH * 0.7) {
      fill(p.fruitColor);
      ellipse(p.x + p.sway, p.y - p.height * 0.9, p.height * 0.15, p.height * 0.15);
    }
    
    // Remove old plants
    if (p.age > 10) {
      plants.splice(i, 1);
    }
  }
  
  // Draw some grass details
  fill(34, 139, 34);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let h = random(5, 15);
    rect(x, height * 0.7, 2, -h);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
