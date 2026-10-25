let geodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a palette of mineral geode colors with rich saturated hues
  const geodeColors = [
    color(255, 100, 200),   // Magenta
    color(100, 200, 255),   // Cyan
    color(255, 200, 100),   // Orange-yellow
    color(150, 100, 255),   // Purple
    color(200, 255, 150),   // Mint green
    color(255, 150, 100)    // Peach
  ];
  
  // Generate folded origami geode structures
  for (let i = 0; i < 30; i++) {
    let r = random(150, 400);
    let a = random(TWO_PI);
    let h = random(-200, 200);
    geodes.push({
      x: r * cos(a),
      y: h,
      z: r * sin(a),
      size: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.015),
      color: random(geodeColors),
      angle: a,
      radius: r,
      phase: random(TWO_PI),
      foldAngle: random(PI/4, PI/2),
      segments: floor(random(3, 7))
    });
  }
}

function draw() {
  background(0);
  
  // Camera slowly orbits to show the entire geode structure
  let cx = cos(time * 0.003) * 500;
  let cy = sin(time * 0.002) * 100;
  let cz = sin(time * 0.004) * 500;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  time += 0.015;
  
  // Draw folded origami geodes with crystalline structure
  for (let i = 0; i < geodes.length; i++) {
    let g = geodes[i];
    
    // Geode movement - orbital motion with subtle wobble
    let angle = g.angle + time * g.speed;
    let r = g.radius + sin(time * 1.5 + g.phase) * 80;
    g.x = r * cos(angle);
    g.z = r * sin(angle);
    
    // Add rotational complexity for origami folding effect
    let rot = time * 0.02 * (g.radius / 300);
    let x = g.x * cos(rot) - g.z * sin(rot);
    let z = g.x * sin(rot) + g.z * cos(rot);
    
    push();
    translate(x, g.y, z);
    
    // Apply geode rotation
    rotate(time * 0.05 + i * 0.1);
    
    // Draw folded origami structure with crystalline segments
    fill(g.color);
    drawGeode(g.size, g.segments, g.foldAngle);
    
    pop();
  }
}

function drawGeode(size, segments, foldAngle) {
  // Draw a folded origami geode structure
  let segmentAngle = TWO_PI / segments;
  
  for (let i = 0; i < segments; i++) {
    let angle = i * segmentAngle;
    
    push();
    rotate(angle);
    
    // Create folded triangular segments
    beginShape();
    vertex(0, 0, 0);
    vertex(cos(angle + foldAngle) * size, sin(angle + foldAngle) * size, 0);
    vertex(cos(angle + segmentAngle - foldAngle) * size, sin(angle + segmentAngle - foldAngle) * size, 0);
    endShape(CLOSE);
    
    // Add inner crystalline details
    fill(255, 200);
    beginShape();
    vertex(cos(angle + foldAngle * 0.5) * size * 0.6, sin(angle + foldAngle * 0.5) * size * 0.6, 0);
    vertex(cos(angle + foldAngle) * size * 0.8, sin(angle + foldAngle) * size * 0.8, 0);
    vertex(cos(angle + segmentAngle - foldAngle) * size * 0.8, sin(angle + segmentAngle - foldAngle) * size * 0.8, 0);
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw central crystalline core
  fill(255);
  sphere(size * 0.3, 6, 4);
}
