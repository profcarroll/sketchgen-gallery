let helixPoints = [];
let bonds = [];
let baseColors = [
  [255, 0, 0],    // A - Red
  [0, 0, 255],    // T - Blue
  [0, 255, 0],    // G - Green
  [255, 255, 0]   // C - Yellow
];

function setup() {
  createCanvas(600, 600, WEBGL);
  
  // Create helix points with base types
  const turns = 3;
  const pointsPerTurn = 20;
  const radius = 150;
  const height = 300;
  
  for (let i = 0; i < turns * pointsPerTurn; i++) {
    const angle = (i / pointsPerTurn) * TWO_PI;
    const y = map(i, 0, turns * pointsPerTurn - 1, -height/2, height/2);
    const x = radius * cos(angle);
    const z = radius * sin(angle);
    
    // Assign base type based on position
    const baseType = i % 4;
    
    helixPoints.push({
      x: x,
      y: y,
      z: z,
      baseType: baseType,
      angle: angle,
      originalY: y
    });
  }
  
  // Create bonds between complementary bases (A-T, G-C)
  for (let i = 0; i < helixPoints.length; i++) {
    const pointA = helixPoints[i];
    
    // Find partner base (complementary pair)
    let partnerIndex = -1;
    if (pointA.baseType === 0) { // A
      partnerIndex = (i + 10) % helixPoints.length; // T
    } else if (pointA.baseType === 1) { // T
      partnerIndex = (i + 10) % helixPoints.length; // A
    } else if (pointA.baseType === 2) { // G
      partnerIndex = (i + 15) % helixPoints.length; // C
    } else if (pointA.baseType === 3) { // C
      partnerIndex = (i + 15) % helixPoints.length; // G
    }
    
    if (partnerIndex !== -1 && partnerIndex !== i) {
      const pointB = helixPoints[partnerIndex];
      bonds.push({
        start: pointA,
        end: pointB
      });
    }
  }
}

function draw() {
  background(0);
  
  // Slow rotation
  rotateY(frameCount * 0.005);
  rotateX(0.2);
  
  // Animate helix points with organic movement
  for (let i = 0; i < helixPoints.length; i++) {
    const point = helixPoints[i];
    point.y = point.originalY + sin(frameCount * 0.01 + point.angle) * 20;
    point.x = 150 * cos(point.angle + frameCount * 0.003);
    point.z = 150 * sin(point.angle + frameCount * 0.003);
  }
  
  // Draw bonds with pulsing effect
  beginShape(LINES);
  stroke(255, 200);
  noFill();
  for (let bond of bonds) {
    const pulse = sin(frameCount * 0.05 + bond.start.angle) * 0.3 + 0.7;
    const length = dist(bond.start.x, bond.start.y, bond.start.z,
                        bond.end.x, bond.end.y, bond.end.z);
    
    // Draw the bond with pulsing intensity
    strokeWeight(1);
    vertex(bond.start.x, bond.start.y, bond.start.z);
    vertex(bond.end.x, bond.end.y, bond.end.z);
  }
  endShape();
  
  // Draw base spheres
  for (let point of helixPoints) {
    push();
    translate(point.x, point.y, point.z);
    
    // Base color
    const color = baseColors[point.baseType];
    fill(color[0], color[1], color[2], 200);
    noStroke();
    
    // Pulsing size effect
    const pulseSize = sin(frameCount * 0.05 + point.angle) * 0.3 + 1;
    sphere(6 * pulseSize);
    pop();
  }
  
  // Check for close proximity and draw temporary bonds
  if (frameCount % 10 === 0) { // Only check every 10 frames for performance
    beginShape(LINES);
    stroke(255, 100);
    noFill();
    
    for (let i = 0; i < helixPoints.length; i++) {
      const pointA = helixPoints[i];
      for (let j = i + 1; j < helixPoints.length; j++) {
        const pointB = helixPoints[j];
        
        // Only draw if they're close enough
        const distance = dist(pointA.x, pointA.y, pointA.z, pointB.x, pointB.y, pointB.z);
        if (distance < 50) {
          vertex(pointA.x, pointA.y, pointA.z);
          vertex(pointB.x, pointB.y, pointB.z);
        }
      }
    }
    
    endShape();
  }
}
