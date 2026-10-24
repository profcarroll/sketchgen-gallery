let currents = [];
let crystals = [];
const numCurrents = 8;
const numCrystals = 100;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Initialize energy currents
  for (let i = 0; i < numCurrents; i++) {
    currents.push({
      y: map(i, 0, numCurrents - 1, -height/2, height/2),
      amplitude: random(40, 100),
      frequency: random(0.005, 0.02),
      speed: random(0.002, 0.008),
      color: color(random(50, 150), random(100, 200), random(200, 255), 180),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize crystalline formations
  for (let i = 0; i < numCrystals; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -100),
      size: random(8, 30),
      growth: random(0.001, 0.005),
      color: color(random(200, 255), random(180, 220), random(180, 220), 200)
    });
  }
}

function draw() {
  background(10, 5, 20);
  
  time += 0.01;
  
  // Draw energy currents as large striated sheets
  for (let i = 0; i < currents.length; i++) {
    const current = currents[i];
    
    fill(current.color);
    beginShape(TRIANGLES);
    for (let x = -width/2; x <= width/2; x += 10) {
      let y = current.y + 
              sin(x * current.frequency + time * current.speed + current.phase) * current.amplitude +
              sin(x * current.frequency * 0.7 + time * current.speed * 1.3 + current.phase * 0.8) * (current.amplitude * 0.6);
      
      // Add vertical variation to simulate depth
      let z = sin(time * 0.005 + i * 0.2) * 100;
      
      vertex(x, y, z);
      vertex(x + 10, y, z);
      vertex(x, y + 15, z);
      
      vertex(x + 10, y, z);
      vertex(x + 10, y + 15, z);
      vertex(x, y + 115, z);
    }
    endShape();
  }
  
  // Draw crystalline formations as point clouds
  beginShape(POINTS);
  for (let i = 0; i < crystals.length; i++) {
    const crystal = crystals[i];
    
    // Grow crystals over time
    crystal.size += crystal.growth;
    
    // Glow effect based on growth rate
    let glow = map(crystal.growth, 0.001, 0.005, 50, 200);
    fill(red(crystal.color), green(crystal.color), blue(crystal.color), glow);
    
    // Draw crystal as a point with size based on growth
    vertex(crystal.x, crystal.y, crystal.z);
  }
  endShape();
  
  // Add subtle energy differentials at crystal intersections using batched lines
  beginShape(LINES);
  for (let i = 0; i < crystals.length; i++) {
    const c1 = crystals[i];
    for (let j = i + 1; j < crystals.length; j++) {
      const c2 = crystals[j];
      let d = dist(c1.x, c1.y, c2.x, c2.y);
      if (d < 80) {
        fill(255, 100);
        stroke(255, 50);
        vertex(c1.x, c1.y, c1.z);
        vertex(c2.x, c2.y, c2.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
