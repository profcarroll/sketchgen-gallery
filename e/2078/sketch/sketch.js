let veins = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create mineral vein network with fewer segments for performance
  for (let i = 0; i < 80; i++) {
    veins.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      length: random(80, 200),
      angle: random(TWO_PI),
      hue: random(120, 180), // Emerald hues
      saturation: random(70, 90),
      brightness: random(80, 100),
      segments: floor(random(5, 10)), // Reduced for performance
      twist: random(-0.3, 0.3)
    });
  }
  
  // Create floating light particles - batched as points
  particles = new Array(200); // Reduced particle count for performance
  for (let i = 0; i < particles.length; i++) {
    particles[i] = {
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(0.5, 1.5),
      speed: random(0.1, 0.3),
      hue: random(140, 160) // Vibrant emerald
    };
  }
}

function draw() {
  background(0, 0, 5); // Deep dark blue cave
  ambientLight(10);
  pointLight(255, 255, 255, 0, 0, 300);
  
  let time = millis() * 0.001;
  
  // Center the view
  translate(0, 0, -400);
  
  // Slow rotation
  rotateY(time * 0.05);
  rotateX(sin(time * 0.1) * 0.05);
  
  // Draw veins as wireframes and internal light
  for (let i = 0; i < veins.length; i++) {
    let vein = veins[i];
    
    push();
    translate(vein.x, vein.y, vein.z);
    rotateZ(vein.angle + time * vein.twist);
    
    stroke(vein.hue, vein.saturation, vein.brightness, 0.8);
    noFill();
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < vein.segments; j++) {
      let angle = TWO_PI * j / vein.segments;
      let x = cos(angle) * vein.length;
      let y = sin(angle) * vein.length;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Add internal light
    noStroke();
    fill(vein.hue, vein.saturation, vein.brightness + 20, 0.2);
    beginShape();
    for (let j = 0; j < vein.segments; j++) {
      let angle = TWO_PI * j / vein.segments;
      let x = cos(angle) * vein.length * 0.7;
      let y = sin(angle) * vein.length * 0.7;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw particles as a batched point cloud
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(p.hue, 100, 100, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Update particle positions
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.y += p.speed * sin(time * 2 + i * 0.1);
    p.x += p.speed * cos(time * 2 + i * 0.1) * 0.5;
    
    // Keep particles within bounds
    if (p.y > height/2) p.y = -height/2;
    if (p.y < -height/2) p.y = height/2;
    if (p.x > width/2) p.x = -width/2;
    if (p.x < -width/2) p.x = width/2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
