// Massive derelict Art Deco radio equipment with interlocking bioluminescent crystalline structures
let structures = [];
let time = 0;
let cabinetEdges = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  frameRate(30);

  // Create the derelict radio equipment framework
  const numCabinetEdges = 12;
  for (let i = 0; i < numCabinetEdges; i++) {
    cabinetEdges.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-800, 800),
      size: random(100, 250),
      rotationSpeed: random(-0.001, 0.001),
      color: color(
        random(40, 90),   // R
        random(60, 120),  // G
        random(180, 230), // B
        120               // A
      )
    });
  }

  // Create complex interlocking crystalline structures inside the equipment
  const numStructures = 15;
  for (let i = 0; i < numStructures; i++) {
    structures.push({
      x: random(-300, 300),
      y: random(-200, 200),
      z: random(-400, 400),
      size: random(80, 150),
      rotationSpeed: random(-0.005, 0.005),
      color: color(
        random(30, 70),   // R
        random(120, 200), // G
        random(200, 255), // B
        180               // A
      ),
      segments: floor(random(4, 8)),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(15, 20, 35);
  
  // Camera movement for organic perspective
  time += 0.003;
  const camX = sin(time * 0.1) * 300;
  const camY = cos(time * 0.15) * 150;
  const camZ = 600 + sin(time * 0.05) * 400;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Dynamic lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, -300, 500);
  pointLight(100, 200, 255, 300, 200, -300);
  
  // Draw the radio equipment cabinet
  for (let i = 0; i < cabinetEdges.length; i++) {
    const c = cabinetEdges[i];
    
    push();
    
    translate(c.x, c.y, c.z);
    
    // Organic rotation
    rotateX(time * 0.1 + c.phase);
    rotateY(time * 0.05 + c.phase * 0.7);
    rotateZ(time * 0.08 + c.phase * 0.3);
    
    // Draw cabinet edge with metallic finish
    fill(red(c.color), green(c.color), blue(c.color), 120);
    stroke(100, 150, 200, 100);
    strokeWeight(1);
    
    // Create a complex metallic structure
    for (let j = 0; j < 3; j++) {
      const angle = TWO_PI * j / 3;
      const xoff = cos(angle) * c.size * 0.5;
      const yoff = sin(angle) * c.size * 0.5;
      
      push();
      translate(xoff, yoff, 0);
      rotateZ(angle + time * 0.2);
      
      // Draw metallic frame segments
      for (let k = 0; k < 3; k++) {
        const segmentSize = c.size * (0.7 - k * 0.15);
        const segmentAngle = angle + PI * k / 2;
        const segX = cos(segmentAngle) * segmentSize * 0.4;
        const segY = sin(segmentAngle) * segmentSize * 0.4;
        
        push();
        translate(segX, segY, 0);
        rotateZ(time * 0.5 + k);
        
        // Draw frame segment
        beginShape(QUADS);
        vertex(-segmentSize/2, -segmentSize/6, 0);
        vertex(segmentSize/2, -segmentSize/6, 0);
        vertex(segmentSize/2, segmentSize/6, 0);
        vertex(-segmentSize/2, segmentSize/6, 0);
        endShape();
        
        pop();
      }
      
      pop();
    }
    
    pop();
  }

  // Draw interlocking bioluminescent crystalline structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    push();
    
    translate(s.x, s.y, s.z);
    
    // Organic rotation
    rotateX(time * 0.2 + s.phase);
    rotateY(time * 0.15 + s.phase * 0.7);
    rotateZ(time * 0.1 + s.phase * 0.3);
    
    // Create bioluminescent glow effect
    const glow = sin(time * 2 + s.phase) * 60 + 120;
    fill(red(s.color), green(s.color), blue(s.color), 200);
    stroke(red(s.color), green(s.color), blue(s.color), 120);
    strokeWeight(1);
    
    // Draw crystalline structure with multiple intersecting planes
    for (let j = 0; j < s.segments; j++) {
      const angle = TWO_PI * j / s.segments;
      const xoff = cos(angle) * s.size * 0.5;
      const yoff = sin(angle) * s.size * 0.5;
      
      push();
      translate(xoff, yoff, 0);
      rotateZ(angle + time * 0.3);
      
      // Draw interlocking crystal segments
      for (let k = 0; k < 4; k++) {
        const segmentSize = s.size * (0.8 - k * 0.15);
        const segmentAngle = angle + PI * k / 2;
        const segX = cos(segmentAngle) * segmentSize * 0.3;
        const segY = sin(segmentAngle) * segmentSize * 0.3;
        
        push();
        translate(segX, segY, 0);
        rotateZ(time * 0.5 + k);
        
        // Draw crystal segment
        beginShape(QUADS);
        vertex(-segmentSize/2, -segmentSize/4, 0);
        vertex(segmentSize/2, -segmentSize/4, 0);
        vertex(segmentSize/2, segmentSize/4, 0);
        vertex(-segmentSize/2, segmentSize/4, 0);
        endShape();
        
        pop();
      }
      
      pop();
    }
    
    // Add subtle glow effect
    noStroke();
    fill(red(s.color), green(s.color), blue(s.color), 30);
    sphere(s.size * 0.15);
    
    pop();
  }
  
  // Add floating particles for bioluminescent effect inside the equipment
  stroke(120, 220, 255, 180);
  strokeWeight(0.7);
  noFill();
  
  beginShape(POINTS);
  for (let i = 0; i < 300; i++) {
    const x = sin(time * 0.3 + i) * 300;
    const y = cos(time * 0.2 + i) * 200;
    const z = sin(time * 0.1 + i) * 500;
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
