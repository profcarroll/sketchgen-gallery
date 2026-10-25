let gears = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a palette of warm wax colors with deep ocean blues
  const waxColors = [
    color(255, 180, 40),   // Golden yellow
    color(255, 140, 20),   // Amber orange
    color(255, 100, 0),    // Deep orange
    color(255, 200, 80),   // Light golden
    color(200, 120, 0)     // Rich brown
  ];
  
  const oceanColors = [
    color(0, 30, 60),      // Deep blue
    color(0, 50, 80),      // Dark blue
    color(0, 70, 100),     // Medium blue
    color(0, 100, 120)     // Light blue
  ];
  
  // Generate interlocking gears with varying sizes and rotations
  for (let i = 0; i < 50; i++) {
    let r = random(100, 300);
    let a = random(TWO_PI);
    let h = random(-200, 200);
    gears.push({
      x: r * cos(a),
      y: h,
      z: r * sin(a),
      size: random(20, 60),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: random(waxColors),
      angle: a,
      radius: r,
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Camera slowly orbits to show the entire mechanism
  let cx = cos(time * 0.005) * 400;
  let cy = sin(time * 0.003) * 100;
  let cz = sin(time * 0.007) * 400;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  time += 0.02;
  
  // Draw gears with mechanical precision
  for (let i = 0; i < gears.length; i++) {
    let g = gears[i];
    
    // Gear movement - interlocking rotations and orbital motion
    let angle = g.angle + time * g.speed;
    let r = g.radius + sin(time * 2 + g.phase) * 50;
    g.x = r * cos(angle);
    g.z = r * sin(angle);
    
    // Add rotational complexity to gears for mechanical effect
    let rot = time * 0.03 * (g.radius / 200);
    let x = g.x * cos(rot) - g.z * sin(rot);
    let z = g.x * sin(rot) + g.z * cos(rot);
    
    push();
    translate(x, g.y, z);
    
    // Apply gear rotation
    rotate(time * 0.1 + i * 0.2);
    
    // Draw gear with mechanical tooth pattern
    fill(g.color);
    drawGear(g.size, 12);
    
    pop();
  }
}

function drawGear(size, teeth) {
  // Draw a gear with teeth using basic shapes
  let toothAngle = TWO_PI / teeth;
  
  for (let i = 0; i < teeth; i++) {
    let angle = i * toothAngle;
    let x1 = cos(angle) * size;
    let y1 = sin(angle) * size;
    let x2 = cos(angle + toothAngle * 0.5) * (size * 1.3);
    let y2 = sin(angle + toothAngle * 0.5) * (size * 1.3);
    let x3 = cos(angle + toothAngle) * size;
    let y3 = sin(angle + toothAngle) * size;
    
    // Draw a gear tooth
    push();
    rotate(angle);
    beginShape();
    vertex(0, 0);
    vertex(x1, y1);
    vertex(x2, y2);
    vertex(x3, y3);
    endShape(CLOSE);
    pop();
  }
  
  // Draw the central hub
  fill(50);
  ellipse(0, 0, size * 0.5, size * 0.5);
}
