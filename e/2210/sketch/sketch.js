let structures = [];
let time = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Initialize crystalline structures
  for (let i = 0; i < 10; i++) {
    let x = random(-width/3, width/3);
    let y = random(-height/3, height/3);
    let z = random(-200, 200);
    let size = random(20, 60);
    structures.push({x, y, z, size, angle: random(TWO_PI), growth: 0});
  }
  
  // Initialize particles for concrete matrix
  for (let i = 0; i < 300; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    particles.push({x, y, z, size: random(0.5, 1.5)});
  }
}

function draw() {
  background(40, 35, 30);
  
  // Slowly rotate the entire scene
  rotateY(time * 0.0002);
  rotateX(sin(time * 0.0001) * 0.03);
  
  time++;
  
  // Draw concrete matrix particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(60, 55, 50, 80);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw and grow crystalline structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    push();
    translate(s.x, s.y, s.z);
    
    // Grow structure over time
    s.growth += 0.0015;
    if (s.growth > 1) s.growth = 1;
    
    let scaleValue = s.growth;
    scale(scaleValue);
    
    // Color based on growth stage and position
    let colorValue = map(s.growth, 0, 1, 150, 220);
    fill(colorValue, colorValue - 30, colorValue - 60);
    
    // Create branching crystal structure using points and lines for efficiency
    beginShape(POINTS);
    for (let j = 0; j < 8; j++) {
      let angle = j * TWO_PI / 8 + time * 0.001;
      let length = s.size * 0.6 * s.growth;
      
      let x = cos(angle) * length;
      let y = sin(angle) * length;
      
      // Add points for branches
      vertex(x, y, 0);
    }
    endShape();
    
    // Draw connecting lines between branches
    beginShape(LINES);
    for (let j = 0; j < 8; j++) {
      let angle1 = j * TWO_PI / 8 + time * 0.001;
      let angle2 = ((j + 1) % 8) * TWO_PI / 8 + time * 0.001;
      
      let x1 = cos(angle1) * s.size * 0.6 * s.growth;
      let y1 = sin(angle1) * s.size * 0.6 * s.growth;
      let x2 = cos(angle2) * s.size * 0.6 * s.growth;
      let y2 = sin(angle2) * s.size * 0.6 * s.growth;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
