let particles = [];
let centralCore;
let time = 0;
let splineMesh;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create central core with molten bronze effect
  centralCore = {
    pos: createVector(0, 0, 0),
    radius: 40,
    hue: 25,
    saturation: 80,
    brightness: 90,
    droplets: [],
    dripTime: 0
  };

  // Build a spline mesh for the connections
  splineMesh = buildSplineMesh();

  // Create orbiting particles with splines
  for (let i = 0; i < 80; i++) {
    let angle = random(TWO_PI);
    let radius = random(150, 300);
    let height = random(-100, 100);
    let speed = random(0.002, 0.008);
    let size = random(2, 6);
    
    particles.push({
      pos: createVector(
        cos(angle) * radius,
        height,
        sin(angle) * radius
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      angle: angle,
      radius: radius,
      speed: speed,
      size: size,
      hue: random(10, 30), // oxidized copper hues
      saturation: random(60, 80),
      brightness: random(40, 70)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;
  centralCore.dripTime += 0.02;

  // Rotate the whole scene
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.1);

  // Draw central glowing core with molten bronze effect
  push();
  translate(centralCore.pos.x, centralCore.pos.y, centralCore.pos.z);
  
  // Add dynamic droplets
  for (let i = 0; i < 20; i++) {
    if (frameCount % 15 === 0) {
      let angle = random(TWO_PI);
      let radius = random(0, 10);
      let x = cos(angle) * radius;
      let z = sin(angle) * radius;
      let y = random(-20, 20);
      
      centralCore.droplets.push({
        pos: createVector(x, y, z),
        size: random(3, 8),
        hue: 25,
        saturation: 80,
        brightness: 90,
        life: 1.0
      });
    }
  }

  // Update and draw droplets
  for (let i = centralCore.droplets.length - 1; i >= 0; i--) {
    let d = centralCore.droplets[i];
    
    d.pos.y += 0.5;
    d.life -= 0.01;
    
    if (d.life <= 0) {
      centralCore.droplets.splice(i, 1);
      continue;
    }
    
    push();
    translate(d.pos.x, d.pos.y, d.pos.z);
    
    fill(d.hue, d.saturation, d.brightness, d.life);
    noStroke();
    sphere(d.size);
    pop();
  }

  // Draw core as glowing bronze
  noStroke();
  fill(centralCore.hue, centralCore.saturation, centralCore.brightness, 1);
  sphere(centralCore.radius);
  
  // Add glow effect
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 0.2, 0);
    fill(centralCore.hue, centralCore.saturation, centralCore.brightness, alpha);
    sphere(centralCore.radius + i * 5);
  }
  pop();

  // Draw orbiting particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle position in orbit
    p.angle += p.speed;
    p.pos.x = cos(p.angle) * p.radius;
    p.pos.z = sin(p.angle) * p.radius;
    
    // Add some vertical movement
    p.pos.y += sin(time * 2 + i) * 0.5;
    
    // Draw particle as a reflective brass sphere
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    
    // Use specular lighting for brass reflection
    fill(p.hue, p.saturation, p.brightness, 1);
    noStroke();
    shininess(128);
    specularColor(255, 255, 255);
    sphere(p.size);
    pop();
  }
  
  // Draw connecting splines between particles using prebuilt mesh
  stroke(255, 0.3);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < splineMesh.length; i += 2) {
    let p1 = splineMesh[i];
    let p2 = splineMesh[i + 1];
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();
}

function buildSplineMesh() {
  let mesh = [];
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let p2 = particles[(i + 1) % particles.length];
    
    // Create a few intermediate points for a spline effect
    for (let j = 0; j < 5; j++) {
      let t = j / 4;
      let x = lerp(p1.pos.x, p2.pos.x, t);
      let y = lerp(p1.pos.y, p2.pos.y, t);
      let z = lerp(p1.pos.z, p2.pos.z, t);
      
      mesh.push(createVector(x, y, z));
    }
  }
  return mesh;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
