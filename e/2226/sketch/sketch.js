let particles = [];
let time = 0;
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create crystalline, silicate color palette
  colorPalette = [
    color(100, 200, 255, 180),   // Blue
    color(150, 255, 200, 180),   // Teal
    color(200, 150, 255, 180),   // Lavender
    color(255, 180, 100, 180),   // Peach
    color(180, 255, 150, 180),   // Mint
    color(255, 100, 150, 180)    // Rose
  ];
  
  // Generate particles for crystalline structure
  for (let i = 0; i < 800; i++) {
    let r = random(300, 700);
    let a = random(TWO_PI);
    let h = random(-400, 400);
    particles.push({
      x: r * cos(a),
      y: h,
      z: r * sin(a),
      size: random(3, 12),
      color: random(colorPalette),
      angle: a,
      radius: r,
      speed: random(0.002, 0.008)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement - continuous, spiraling motion
  let cx = cos(time * 0.05) * 400;
  let cy = sin(time * 0.03) * 200;
  let cz = sin(time * 0.07) * 400;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Apply time-based progression
  time += 0.02;
  
  // Draw particles with crystalline geometric patterns
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Vortex movement - spiraling outward
    let angle = p.angle + time * p.speed;
    let r = p.radius + sin(time * 2 + i * 0.01) * 80;
    p.x = r * cos(angle);
    p.z = r * sin(angle);
    
    // Add depth-based rotation and scaling
    let rot = time * 0.03 * (p.radius / 500);
    let x = p.x * cos(rot) - p.z * sin(rot);
    let z = p.x * sin(rot) + p.z * cos(rot);
    
    push();
    translate(x, p.y, z);
    
    // Rotate based on position and time for layered effect
    rotate(time * 0.15 + i * 0.02);
    
    // Alternate between shapes to create crystalline structure
    if (i % 4 === 0) {
      sphere(p.size, 3, 3);        // Spheres for crystal points
    } else if (i % 4 === 1) {
      box(p.size * 1.2);           // Boxes for crystal facets
    } else if (i % 4 === 2) {
      torus(p.size, p.size * 0.4, 6, 3);  // Torus for flowing patterns
    } else {
      cone(p.size, p.size * 2, 4); // Cones for sharp crystal forms
    }
    
    fill(p.color);
    
    pop();
  }
  
  // Add subtle screen filter effect to enhance depth
  blendMode(DIFFERENCE);
  noStroke();
  fill(255, 20);
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
}
