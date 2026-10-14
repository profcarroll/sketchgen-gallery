let structures = [];
let pulseOffset = 0;
let foldGeometry;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Pre-compute fold geometry for efficiency
  foldGeometry = [];
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 5, 0, TWO_PI);
    foldGeometry.push({x: cos(angle), y: sin(angle)});
  }
  
  // Create folded origami structures resembling hydrothermal vents
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-800, -200); // Deep-sea depth
    
    structures.push({
      x: x,
      y: y,
      z: z,
      size: random(20, 60),
      rotation: random(TWO_PI),
      segments: floor(random(4, 7)),
      color: color(random(190, 220), 70, 60, 0.8)
    });
  }
}

function draw() {
  background(200, 20, 15); // Deep-sea blue-black
  
  // Ambient light simulating deep ocean
  ambientLight(20);
  
  // Pulsing light source to simulate biological circuits
  let pulse = sin(frameCount * 0.03 + pulseOffset) * 0.3 + 0.7;
  pointLight(180, 90, 95, 0, 0, -300);
  
  // Rotate the entire scene slowly for a drifting effect
  rotateY(frameCount * 0.002);
  rotateX(frameCount * 0.001);
  
  // Draw origami structures using batched shapes
  beginShape(LINES);
  for (let structure of structures) {
    let pulseFold = sin(frameCount * 0.05 + structure.x * 0.01) * 0.2 + 0.8;
    
    stroke(structure.color);
    noFill();
    strokeWeight(1);
    
    // Draw the structure's edges using precomputed geometry
    for (let i = 0; i < structure.segments; i++) {
      let angle1 = map(i, 0, structure.segments - 1, 0, TWO_PI * 2);
      let angle2 = map((i + 1) % structure.segments, 0, structure.segments - 1, 0, TWO_PI * 2);
      
      let x1 = sin(angle1) * structure.size;
      let y1 = cos(angle1) * structure.size;
      let x2 = sin(angle2) * structure.size;
      let y2 = cos(angle2) * structure.size;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
  }
  endShape();
  
  // Draw folds using batched shapes
  beginShape(LINES);
  for (let structure of structures) {
    stroke(180, 90, 95, 0.6 * pulse);
    noFill();
    strokeWeight(0.5);
    
    let foldSize = structure.size * 0.3;
    
    // Draw each fold as a polygon
    for (let i = 0; i < 6; i++) {
      let point1 = foldGeometry[i];
      let point2 = foldGeometry[(i + 1) % 6];
      
      let x1 = point1.x * foldSize;
      let y1 = point1.y * foldSize;
      let x2 = point2.x * foldSize;
      let y2 = point2.y * foldSize;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
  }
  endShape();
  
  pulseOffset += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
