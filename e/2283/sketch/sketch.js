let gears = [];
let tissues = [];
let mouseForce = { x: 0, y: 0 };
let forceActive = false;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create clockwork gears
  for (let i = 0; i < 20; i++) {
    gears.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-100, 100),
      radius: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.002, 0.008),
      segments: int(random(12, 24)),
      color: color(200, 60, 30 + random(20)),
      decay: random(0.95, 0.99)
    });
  }
  
  // Create organic tissue patches
  for (let i = 0; i < 15; i++) {
    tissues.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-150, 150),
      size: random(50, 150),
      shape: random(['sphere', 'blob']),
      color: color(0, 0, 40 + random(30)),
      decay: random(0.96, 0.995)
    });
  }
}

function draw() {
  background(0);
  
  // Add subtle movement
  time += 0.001;
  
  // Apply mouse force if active
  if (forceActive) {
    for (let i = 0; i < gears.length; i++) {
      const gear = gears[i];
      const dx = gear.x - mouseForce.x;
      const dy = gear.y - mouseForce.y;
      const dist = sqrt(dx * dx + dy * dy);
      
      if (dist < 200) {
        const force = map(dist, 0, 200, 0.1, 0);
        gear.rotation += force * 0.5;
        gear.decay -= 0.002;
      }
    }
    
    for (let i = 0; i < tissues.length; i++) {
      const tissue = tissues[i];
      const dx = tissue.x - mouseForce.x;
      const dy = tissue.y - mouseForce.y;
      const dist = sqrt(dx * dx + dy * dy);
      
      if (dist < 200) {
        const force = map(dist, 0, 200, 0.05, 0);
        tissue.decay -= force * 0.01;
      }
    }
    
    // Reduce force over time
    mouseForce.x += (mouseX - mouseForce.x) * 0.05;
    mouseForce.y += (mouseY - mouseForce.y) * 0.05;
  }
  
  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear body
    fill(gear.color);
    noStroke();
    sphere(gear.radius * 0.8);
    
    // Gear teeth
    stroke(180, 70, 20);
    noFill();
    for (let j = 0; j < gear.segments; j++) {
      const angle = TWO_PI * j / gear.segments;
      const x1 = cos(angle) * gear.radius * 0.9;
      const y1 = sin(angle) * gear.radius * 0.9;
      const x2 = cos(angle + PI / gear.segments) * gear.radius * 0.9;
      const y2 = sin(angle + PI / gear.segments) * gear.radius * 0.9;
      
      line(x1, y1, 0, x2, y2, 0);
    }
    
    pop();
    
    // Update rotation
    gear.rotation += gear.speed;
    gear.decay *= 0.999;
  }
  
  // Draw tissues
  for (let i = 0; i < tissues.length; i++) {
    const tissue = tissues[i];
    
    push();
    translate(tissue.x, tissue.y, tissue.z);
    
    fill(tissue.color);
    noStroke();
    
    if (tissue.shape === 'sphere') {
      sphere(tissue.size * 0.5);
    } else {
      // Blob shape
      for (let j = 0; j < 10; j++) {
        const angle = random(TWO_PI);
        const dist = random(0, tissue.size * 0.4);
        const x = cos(angle) * dist;
        const y = sin(angle) * dist;
        const size = random(5, 20);
        sphere(size);
      }
    }
    
    pop();
    
    // Update decay
    tissue.decay *= 0.999;
  }
  
  // Add slow dissolving effect
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    if (random() < 0.01) {
      gear.decay -= 0.02;
    }
    
    if (gear.decay < 0.8) {
      gear.decay += 0.005;
      gear.radius *= 0.99;
    }
  }
  
  for (let i = 0; i < tissues.length; i++) {
    const tissue = tissues[i];
    if (random() < 0.01) {
      tissue.decay -= 0.02;
    }
    
    if (tissue.decay < 0.9) {
      tissue.decay += 0.005;
      tissue.size *= 0.995;
    }
  }
  
  // Add slow organic motion
  for (let i = 0; i < gears.length; i++) {
    const gear = gears[i];
    gear.x += sin(time + i) * 0.2;
    gear.y += cos(time + i) * 0.2;
  }
  
  for (let i = 0; i < tissues.length; i++) {
    const tissue = tissues[i];
    tissue.x += sin(time * 0.5 + i) * 0.1;
    tissue.y += cos(time * 0.5 + i) * 0.1;
  }
}

function mousePressed() {
  forceActive = true;
  mouseForce.x = mouseX;
  mouseForce.y = mouseY;
}

function mouseDragged() {
  mouseForce.x = mouseX;
  mouseForce.y = mouseY;
}

function mouseReleased() {
  forceActive = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
