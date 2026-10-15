let roots = [];
let cameraZ = 0;
let speed = 2;
let pulsePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Generate root structures
  for (let i = 0; i < 150; i++) {
    let x = random(-3000, 3000);
    let z = random(-3000, 3000);
    let y = random(-2000, 2000);
    let length = random(50, 200);
    let segments = floor(random(3, 8));
    let points = [];
    for (let j = 0; j < segments; j++) {
      points.push({
        x: random(-length/4, length/4),
        y: random(-length/4, length/4),
        z: -j * (length / segments)
      });
    }
    roots.push({ x, y, z, points, length });
  }
}

function draw() {
  background(10);
  
  // Camera movement
  cameraZ -= speed;
  
  // Set up camera
  perspective(PI/3, width/height, 1, 10000);
  translate(0, 0, cameraZ);

  // Pulsing effect
  pulsePhase += 0.05;
  
  // Draw roots
  for (let root of roots) {
    push();
    translate(root.x, root.y, root.z);
    
    // Create a pulsing glow effect
    let pulse = sin(pulsePhase + root.x * 0.001) * 0.3 + 0.7;
    let baseColor = color(255, 255, 200);
    let glowColor = lerpColor(baseColor, color(255, 100, 100), 0.5);
    
    // Draw segments with spring-like tension
    beginShape(LINES);
    for (let i = 0; i < root.points.length - 1; i++) {
      let p1 = root.points[i];
      let p2 = root.points[i + 1];
      
      // Apply spring-like tension to the segments
      let tension = 0.5;
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;
      let dz = p2.z - p1.z;
      
      let tensionX = dx * tension;
      let tensionY = dy * tension;
      let tensionZ = dz * tension;
      
      // Draw the segment with pulsing intensity
      let intensity = map(i, 0, root.points.length - 1, 0.5, 1);
      stroke(lerpColor(glowColor, baseColor, 0.8));
      strokeWeight(2 * pulse * intensity);
      
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x + tensionX, p2.y + tensionY, p2.z + tensionZ);
    }
    endShape();
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
