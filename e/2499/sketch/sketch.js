let lattice = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a lattice of crystallized beeswax strands in an ancient astronomical instrument
  const gridCount = 25;
  const strandLength = 300;
  
  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      // Create vertical crystallized strands
      let x1 = map(i, 0, gridCount - 1, -width/3, width/3);
      let y1 = -height/4;
      let z1 = map(j, 0, gridCount - 1, -250, 250);
      
      let x2 = x1;
      let y2 = height/4;
      let z2 = z1;
      
      lattice.push({
        type: 'strand',
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        baseAngle: random(TWO_PI),
        timeOffset: random(1000)
      });
    }
  }
  
  // Add horizontal connections
  for (let i = 0; i < gridCount; i++) {
    let y = map(i, 0, gridCount - 1, -height/4, height/4);
    
    for (let j = 0; j < gridCount - 1; j++) {
      let x1 = map(j, 0, gridCount - 2, -width/3, width/3);
      let z1 = map(i, 0, gridCount - 1, -250, 250);
      
      let x2 = map(j + 1, 0, gridCount - 2, -width/3, width/3);
      let z2 = z1;
      
      lattice.push({
        type: 'connection',
        x1: x1,
        y1: y,
        z1: z1,
        x2: x2,
        y2: y,
        z2: z2,
        baseAngle: random(TWO_PI),
        timeOffset: random(1000)
      });
    }
  }
}

function draw() {
  background(25, 20, 10); // Deep warm earthy background
  
  // Slow rotation of the entire lattice
  rotateY(time * 0.0005);
  rotateX(sin(time * 0.0002) * 0.05);
  
  time += 0.03;
  
  // Draw the crystallized lattice with subtle settling and hardening
  beginShape(LINES);
  for (let i = 0; i < lattice.length; i++) {
    let strand = lattice[i];
    
    // Apply slow oscillation to simulate the settling process of beeswax
    let t = time + strand.timeOffset;
    let oscillation1 = sin(t * 0.02 + strand.baseAngle) * 1;
    let oscillation2 = cos(t * 0.015 + strand.baseAngle) * 1;
    
    let x1 = strand.x1 + oscillation1;
    let y1 = strand.y1 + oscillation2;
    let z1 = strand.z1;
    
    let x2 = strand.x2 + oscillation1;
    let y2 = strand.y2 + oscillation2;
    let z2 = strand.z2;
    
    // Color based on beeswax tones - warm, slightly amber
    let hue = 30 + sin(t * 0.005) * 5; // Warm yellowish hues
    let sat = 15 + sin(t * 0.007) * 5; // Low saturation for aged look
    let bright = 60 + sin(t * 0.01) * 10;
    
    // Gradual hardening effect - strands become more defined over time
    let hardening = 0.5 + sin(t * 0.003) * 0.2;
    let strokeWeightVal = 0.8 + hardening * 0.7;
    
    stroke(hue, sat, bright, 0.7);
    strokeWeight(strokeWeightVal);
    
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
  
  // Add subtle light particles to simulate the glow of hardened beeswax
  beginShape(POINTS);
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    
    // Soft glow effect
    let glow = sin(time * 1.5 + i) * 0.3 + 0.7;
    
    stroke(40, 5, 95, glow * 0.2);
    strokeWeight(glow * 0.5);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
