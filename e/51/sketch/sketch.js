let drones = [];
let trails = [];
let cityLights = [];
let waterReflections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create city lights
  for (let i = 0; i < 200; i++) {
    cityLights.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(0, 100),
      size: random(2, 8),
      hue: random(20, 40)
    });
  }
  
  // Create initial drones
  for (let i = 0; i < 15; i++) {
    drones.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(0, 50),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.2, 0.2),
      hue: random(180, 240),
      size: random(3, 7)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  // Camera movement for dynamic view
  let time = millis() * 0.0005;
  camera(
    sin(time) * width/4, 
    sin(time * 0.7) * height/6, 
    cos(time) * width/3,
    0, 0, 0,
    0, 1, 0
  );
  
  // Draw city backdrop
  drawCity();
  
  // Draw water reflections
  drawWater();
  
  // Update and draw drones
  updateDrones();
  drawDrones();
}

function drawCity() {
  // Sky gradient
  for (let i = 0; i < 100; i++) {
    let y = map(i, 0, 100, -height/2, height/2);
    let c = color(20, 5, 20, 0.1 + i/1000);
    fill(c);
    noStroke();
    rect(-width/2, y, width, 2);
  }
  
  // City buildings
  for (let i = 0; i < cityLights.length; i++) {
    let light = cityLights[i];
    push();
    translate(light.x, light.y, light.z);
    
    if (light.z > 0) {
      fill(light.hue, 80, 90, 0.8);
      noStroke();
      sphere(light.size);
    }
    
    pop();
  }
}

function drawWater() {
  // Water surface
  fill(180, 30, 20, 0.4);
  noStroke();
  plane(width * 1.5, height * 1.5);
  
  // Water reflections
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let size = random(2, 10);
    fill(240, 50, 80, 0.2);
    noStroke();
    ellipse(x, y, size, size * 0.5);
  }
}

function updateDrones() {
  // Update drone positions
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    
    // Apply cursor influence
    let dx = mouseX - width/2;
    let dy = mouseY - height/2;
    let distToCursor = dist(d.x, d.y, dx, dy);
    
    if (distToCursor < 300) {
      let force = map(distToCursor, 0, 300, 0.5, 0);
      d.vx += (dx - d.x) * force * 0.001;
      d.vy += (dy - d.y) * force * 0.001;
    }
    
    // Update position
    d.x += d.vx;
    d.y += d.vy;
    d.z += d.vz;
    
    // Apply damping
    d.vx *= 0.98;
    d.vy *= 0.98;
    d.vz *= 0.99;
    
    // Boundary checks with wrapping
    if (d.x > width/2) d.x = -width/2;
    if (d.x < -width/2) d.x = width/2;
    if (d.y > height/2) d.y = -height/2;
    if (d.y < -height/2) d.y = height/2;
    
    // Add trail
    trails.push({
      x: d.x,
      y: d.y,
      z: d.z,
      hue: d.hue,
      size: d.size * 0.5,
      life: 1.0
    });
  }
  
  // Update trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.life -= 0.02;
    if (t.life <= 0) {
      trails.splice(i, 1);
    }
  }
}

function drawDrones() {
  // Draw trails
  for (let i = 0; i < trails.length; i++) {
    let t = trails[i];
    push();
    translate(t.x, t.y, t.z);
    
    fill(t.hue, 80, 90, t.life * 0.5);
    noStroke();
    sphere(t.size);
    
    pop();
  }
  
  // Draw drones
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    push();
    translate(d.x, d.y, d.z);
    
    fill(d.hue, 100, 90);
    noStroke();
    sphere(d.size);
    
    // Drone glow
    fill(d.hue, 100, 100, 0.3);
    sphere(d.size * 2);
    
    pop();
  }
}

function mousePressed() {
  // Trigger new formation on click
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    
    // Create new formation pattern
    let angle = TWO_PI * i / drones.length;
    d.vx = cos(angle) * random(1, 3);
    d.vy = sin(angle) * random(1, 3);
    d.vz = random(-0.5, 0.5);
    
    // Add some randomness to the formation
    d.x += random(-100, 100);
    d.y += random(-100, 100);
    d.z += random(-20, 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
