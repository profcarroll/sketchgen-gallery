let lattice = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a lattice of interwoven steel beams in a suspension bridge pattern
  const gridSize = 20;
  const gridCount = 30;
  
  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      // Create vertical supports
      let x1 = map(i, 0, gridCount - 1, -width/3, width/3);
      let y1 = -height/4;
      let z1 = map(j, 0, gridCount - 1, -200, 200);
      
      let x2 = x1;
      let y2 = height/4;
      let z2 = z1;
      
      lattice.push({
        type: 'vertical',
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        baseAngle: random(TWO_PI)
      });
    }
  }
  
  // Add horizontal tension cables
  for (let i = 0; i < gridCount; i++) {
    let y = map(i, 0, gridCount - 1, -height/4, height/4);
    
    for (let j = 0; j < gridCount - 1; j++) {
      let x1 = map(j, 0, gridCount - 2, -width/3, width/3);
      let z1 = -200;
      
      let x2 = map(j + 1, 0, gridCount - 2, -width/3, width/3);
      let z2 = -200;
      
      lattice.push({
        type: 'cable',
        x1: x1,
        y1: y,
        z1: z1,
        x2: x2,
        y2: y,
        z2: z2,
        baseAngle: random(TWO_PI)
      });
    }
  }
  
  // Add diagonal tension braces
  for (let i = 0; i < gridCount - 1; i++) {
    for (let j = 0; j < gridCount - 1; j++) {
      let x1 = map(i, 0, gridCount - 2, -width/3, width/3);
      let y1 = map(j, 0, gridCount - 2, -height/4, height/4);
      let z1 = -200;
      
      let x2 = map(i + 1, 0, gridCount - 2, -width/3, width/3);
      let y2 = map(j + 1, 0, gridCount - 2, -height/4, height/4);
      let z2 = -200;
      
      lattice.push({
        type: 'brace',
        x1: x1,
        y1: y1,
        z1: z1,
        x2: x2,
        y2: y2,
        z2: z2,
        baseAngle: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(20, 30, 5); // Deep earthy background
  
  // Slow rotation of the entire lattice
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);
  
  time += 0.02;
  
  // Draw the lattice structure with oscillating tension
  beginShape(LINES);
  for (let i = 0; i < lattice.length; i++) {
    let beam = lattice[i];
    
    // Apply oscillation to create the sense of stress and movement
    let oscillation1 = sin(time * 0.03 + beam.baseAngle) * 2;
    let oscillation2 = cos(time * 0.02 + beam.baseAngle) * 2;
    
    let x1 = beam.x1 + oscillation1;
    let y1 = beam.y1 + oscillation2;
    let z1 = beam.z1;
    
    let x2 = beam.x2 + oscillation1;
    let y2 = beam.y2 + oscillation2;
    let z2 = beam.z2;
    
    // Tension effect - varying stroke weight and color
    let tension = sin(time * 0.05 + i) * 0.3 + 0.7;
    let hue = 200 + sin(time * 0.01 + i) * 10; // Cool gray with metallic tint
    let sat = 10 + sin(time * 0.02 + i) * 5; // Low saturation for aged metal
    let bright = 60 + sin(time * 0.03 + i) * 10;
    
    stroke(hue, sat, bright, tension * 0.8);
    strokeWeight(0.5 + tension * 1.5);
    
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
  
  // Add subtle light effects to simulate illumination on the structure
  beginShape(POINTS);
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    
    // Light flicker effect
    let light = sin(time * 2 + i) * 0.5 + 0.5;
    
    stroke(180, 5, 90, light * 0.3);
    strokeWeight(light * 0.2);
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
