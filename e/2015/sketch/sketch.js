let particles = [];
let time = 0;
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create bioluminescent color palette
  colorPalette = [
    color(255, 50, 100, 200),   // Pink
    color(50, 200, 255, 200),   // Cyan
    color(100, 255, 100, 200),  // Green
    color(255, 150, 50, 200),   // Orange
    color(150, 50, 255, 200),   // Purple
    color(255, 200, 50, 200)    // Yellow
  ];
  
  // Generate particles for coral reef structure
  for (let i = 0; i < 1200; i++) {
    let r = random(300, 800);
    let a = random(TWO_PI);
    let h = random(-300, 300);
    particles.push({
      x: r * cos(a),
      y: h,
      z: r * sin(a),
      size: random(2, 15),
      color: random(colorPalette),
      angle: a,
      radius: r,
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement - slow, organic rotation
  let cx = cos(time * 0.1) * 300;
  let cy = sin(time * 0.08) * 150;
  let cz = sin(time * 0.12) * 300;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Apply time-based progression
  time += 0.01;
  
  // Draw particles with layered geometric patterns
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Layered movement - vortex + oscillation
    let angle = p.angle + time * p.speed * 2;
    let r = p.radius + sin(time * 3 + i * 0.01) * 100;
    p.x = r * cos(angle);
    p.z = r * sin(angle);
    
    // Add depth-based rotation
    let rot = time * 0.02 * (p.radius / 500);
    let x = p.x * cos(rot) - p.z * sin(rot);
    let z = p.x * sin(rot) + p.z * cos(rot);
    
    push();
    translate(x, p.y, z);
    
    // Layered geometric patterns
    rotate(time * 0.1 + i * 0.01);
    
    // Alternate between shapes for complexity
    if (i % 3 === 0) {
      sphere(p.size, 4, 4);  // Spheres for coral polyps
    } else if (i % 3 === 1) {
      box(p.size * 1.5);     // Boxes for reef structure
    } else {
      torus(p.size, p.size * 0.5, 8, 4);  // Torus for flowing patterns
    }
    
    fill(p.color);
    
    pop();
  }
  
  // Add subtle screen filter effect
  blendMode(DIFFERENCE);
  noStroke();
  fill(255, 30);
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
}
