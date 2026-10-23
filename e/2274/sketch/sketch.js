let corals = [];
let time = 0;
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create vibrant, saturated coral color palette
  colorPalette = [
    color(255, 50, 100, 200),   // Bright red
    color(100, 255, 200, 200),   // Teal
    color(255, 150, 50, 200),    // Orange
    color(150, 100, 255, 200),   // Purple
    color(50, 255, 150, 200),    // Green
    color(255, 200, 100, 200)    // Yellow
  ];
  
  // Generate coral structures using geometric facets
  for (let i = 0; i < 1000; i++) {
    let r = random(300, 700);
    let a = random(TWO_PI);
    let h = random(-400, 400);
    corals.push({
      x: r * cos(a),
      y: h,
      z: r * sin(a),
      size: random(5, 20),
      color: random(colorPalette),
      angle: a,
      radius: r,
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement - gentle, flowing motion
  let cx = cos(time * 0.02) * 300;
  let cy = sin(time * 0.015) * 100;
  let cz = sin(time * 0.03) * 300;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Apply time-based progression
  time += 0.015;
  
  // Draw coral structures with geometric patterns
  for (let i = 0; i < corals.length; i++) {
    let c = corals[i];
    
    // Flowing movement - rhythmic expansion and contraction
    let angle = c.angle + time * c.speed;
    let r = c.radius + sin(time * 3 + c.phase) * 100;
    c.x = r * cos(angle);
    c.z = r * sin(angle);
    
    // Add depth-based rotation and scaling
    let rot = time * 0.02 * (c.radius / 500);
    let x = c.x * cos(rot) - c.z * sin(rot);
    let z = c.x * sin(rot) + c.z * cos(rot);
    
    push();
    translate(x, c.y, z);
    
    // Rotate based on position and time for layered effect
    rotate(time * 0.1 + i * 0.01);
    
    // Alternate between shapes to create coral-like structures
    if (i % 3 === 0) {
      sphere(c.size, 4, 4);        // Spheres for coral tips
    } else if (i % 3 === 1) {
      box(c.size * 1.5);           // Boxes for coral branches
    } else {
      torus(c.size, c.size * 0.5, 8, 6);  // Torus for flowing patterns
    }
    
    fill(c.color);
    
    pop();
  }
  
  // Add subtle bioluminescent glow effect
  blendMode(ADD);
  noStroke();
  fill(255, 30);
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
}
