let drones = [];
let formations = [];
let currentFormation = 0;
let waterColor, skyColor;
let droneSize = 20;
let mouseInfluence = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial drones
  for (let i = 0; i < 50; i++) {
    drones.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-100, 100),
      targetX: random(-width/2, width/2),
      targetY: random(-height/4, height/4),
      targetZ: random(-100, 100),
      speed: random(0.5, 2),
      hue: random(360),
      size: droneSize + random(-5, 5)
    });
  }
  
  // Create formation presets
  for (let i = 0; i < 4; i++) {
    let form = [];
    for (let j = 0; j < drones.length; j++) {
      let angle = map(j, 0, drones.length, 0, TWO_PI);
      let radius = 200 + i * 100;
      let x = cos(angle + i) * radius;
      let y = sin(angle + i) * radius;
      let z = (i % 2 === 0 ? -1 : 1) * 50;
      form.push({x, y, z});
    }
    formations.push(form);
  }
  
  // Set colors
  skyColor = color(20, 10, 10);
  waterColor = color(220, 30, 20);
}

function draw() {
  background(skyColor);
  
  // Draw water surface
  push();
  translate(0, height/2 - 50, 0);
  rotateX(PI / 2);
  noStroke();
  fill(waterColor);
  plane(width, 300);
  pop();
  
  // Draw buildings
  for (let i = 0; i < 10; i++) {
    let x = map(i, 0, 10, -width/2, width/2);
    let height = random(50, 200);
    push();
    translate(x, height/2 - 50, 0);
    fill(30, 20, 40);
    box(30, height, 30);
    pop();
  }
  
  // Update and draw drones
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    
    // Apply mouse influence
    if (mouseInfluence > 0) {
      let dx = mouseX - width/2;
      let dy = mouseY - height/2;
      let distToMouse = dist(d.x, d.y, dx, dy);
      if (distToMouse < 300) {
        let force = map(distToMouse, 0, 300, 1, 0);
        d.targetX += dx * force * 0.005;
        d.targetY += dy * force * 0.005;
      }
    }
    
    // Move towards target
    d.x += (d.targetX - d.x) * d.speed * 0.01;
    d.y += (d.targetY - d.y) * d.speed * 0.01;
    d.z += (d.targetZ - d.z) * d.speed * 0.01;
    
    // Keep drones within bounds
    if (abs(d.x) > width/2 + 200) d.targetX = -d.x;
    if (abs(d.y) > height/2 + 200) d.targetY = -d.y;
    
    // Update formation targets
    let form = formations[currentFormation];
    if (form && i < form.length) {
      d.targetX = form[i].x;
      d.targetY = form[i].y;
      d.targetZ = form[i].z;
    }
    
    // Draw drone
    push();
    translate(d.x, d.y, d.z);
    rotateZ(frameCount * 0.01 + i);
    
    // Drone body
    noStroke();
    fill(d.hue, 80, 90);
    sphere(d.size);
    
    // Drone lights
    fill(255, 100);
    sphere(d.size * 0.3);
    
    pop();
  }
  
  // Add some ambient glow from distant drones
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    push();
    translate(x, y, z);
    fill(30, 50, 90, 0.2);
    sphere(10 + sin(frameCount * 0.01 + i) * 5);
    pop();
  }
  
  // Reduce mouse influence over time
  mouseInfluence = max(0, mouseInfluence - 0.01);
}

function mouseDragged() {
  mouseInfluence = 1;
}

function mouseClicked() {
  currentFormation = (currentFormation + 1) % formations.length;
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    if (i < formations[currentFormation].length) {
      let target = formations[currentFormation][i];
      d.targetX = target.x;
      d.targetY = target.y;
      d.targetZ = target.z;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
