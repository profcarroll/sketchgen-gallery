let particles = [];
let cameraZ;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles in a spherical arrangement
  for (let i = 0; i < 1500; i++) {
    let r = random(200, 600);
    let theta = random(TWO_PI);
    let phi = random(PI);
    
    let x = r * sin(phi) * cos(theta);
    let y = r * sin(phi) * sin(theta);
    let z = r * cos(phi);
    
    particles.push({x, y, z});
  }
  
  cameraZ = -height / (2 * tan(PI/6));
}

function draw() {
  background(0);
  
  // Camera motion: accelerating tunnel effect
  time += 0.01;
  let speed = map(time, 0, 10, 0.5, 3);
  translate(0, 0, cameraZ + time * speed * 20);
  
  // Rotate the whole scene for dynamic perspective
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw particles as glowing points
  beginShape(POINTS);
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply some motion to each particle
    let angle = time + p.x * 0.001 + p.y * 0.001;
    let r = 20 + sin(angle) * 10;
    
    let x = p.x + cos(angle) * r;
    let y = p.y + sin(angle * 1.3) * r;
    let z = p.z + sin(angle * 0.7) * r;
    
    // Color based on position and time
    let hue = (time * 20 + x * 0.5 + y * 0.5) % 360;
    fill(hue, 80, 90, 0.8);
    
    vertex(x, y, z);
  }
  endShape();
  
  // Draw connecting lines between nearby particles
  stroke(200, 50, 80, 0.2);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      
      // Calculate distance
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dz = p1.z - p2.z;
      let dist = sqrt(dx * dx + dy * dy + dz * dz);
      
      // Draw if within threshold
      if (dist < 100) {
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
      }
    }
  }
  endShape();
}
