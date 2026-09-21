let strands = [];
let numStrands = 12;
let knotRadius = 200;
let strandRadius = 3;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize strands with random starting positions
  for (let i = 0; i < numStrands; i++) {
    let angle = map(i, 0, numStrands, 0, TWO_PI);
    let x = cos(angle) * knotRadius;
    let y = sin(angle) * knotRadius;
    let z = 0;
    
    strands.push({
      points: [],
      color: color(map(i, 0, numStrands, 0, 360), 80, 90),
      baseAngle: angle,
      phase: random(TWO_PI)
    });
    
    // Create a helical path for each strand
    for (let j = 0; j < 100; j++) {
      let t = map(j, 0, 99, 0, TWO_PI * 4);
      let r = knotRadius + sin(t * 2 + angle) * 30;
      let x = cos(t + angle) * r;
      let y = sin(t + angle) * r;
      let z = sin(t * 1.5 + angle) * 50;
      
      strands[i].points.push(createVector(x, y, z));
    }
  }
}

function draw() {
  background(0);
  
  // Camera movement for dynamic view
  let rx = sin(time * 0.05) * 0.1;
  let ry = cos(time * 0.03) * 0.1;
  let rz = sin(time * 0.02) * 0.05;
  
  rotateX(rx);
  rotateY(ry);
  rotateZ(rz);
  
  // Apply mouse interaction
  if (mouseIsPressed) {
    let mouseOffset = createVector(mouseX - width/2, mouseY - height/2);
    for (let strand of strands) {
      for (let i = 0; i < strand.points.length; i++) {
        let p = strand.points[i];
        let d = p.dist(createVector(0, 0, 0));
        let force = map(d, 0, knotRadius * 2, 1, 0);
        let dir = p.copy().normalize();
        dir.mult(mouseOffset.mag() * 0.005 * force);
        p.add(dir);
      }
    }
  }
  
  // Draw all strands
  for (let strand of strands) {
    stroke(strand.color);
    noFill();
    
    beginShape();
    for (let i = 0; i < strand.points.length; i++) {
      let p = strand.points[i];
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }
  
  // Add pulsing effect
  time += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
