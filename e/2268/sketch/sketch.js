// Massive interlocking crystalline structures like geothermal vent formations,
// seen at city block scale, drawn as chalk on matte black slate
let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  frameRate(30);

  // Create complex interlocking crystalline structures
  const numStructures = 25;
  for (let i = 0; i < numStructures; i++) {
    structures.push({
      x: random(-400, 400),
      y: random(-300, 300),
      z: random(-500, 500),
      size: random(60, 120),
      rotationSpeed: random(-0.003, 0.003),
      segments: floor(random(5, 9)),
      phase: random(TWO_PI),
      color: color(
        220,   // R
        230,   // G
        255,   // B
        180    // A
      )
    });
  }
}

function draw() {
  background(10, 15, 25);
  
  // Camera movement for organic perspective
  time += 0.002;
  const camX = sin(time * 0.08) * 200;
  const camY = cos(time * 0.05) * 100;
  const camZ = 500 + sin(time * 0.03) * 300;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Dynamic lighting
  ambientLight(40);
  pointLight(255, 255, 255, 0, -300, 500);
  pointLight(200, 230, 255, 300, 200, -300);
  
  // Draw interlocking crystalline structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    push();
    
    translate(s.x, s.y, s.z);
    
    // Organic rotation
    rotateX(time * 0.15 + s.phase);
    rotateY(time * 0.1 + s.phase * 0.7);
    rotateZ(time * 0.08 + s.phase * 0.3);
    
    // Create bioluminescent glow effect
    const glow = sin(time * 1.5 + s.phase) * 40 + 100;
    fill(red(s.color), green(s.color), blue(s.color), 200);
    stroke(255, 255, 255, 120);
    strokeWeight(0.8);
    
    // Draw crystalline structure with multiple intersecting planes
    for (let j = 0; j < s.segments; j++) {
      const angle = TWO_PI * j / s.segments;
      const xoff = cos(angle) * s.size * 0.4;
      const yoff = sin(angle) * s.size * 0.4;
      
      push();
      translate(xoff, yoff, 0);
      rotateZ(angle + time * 0.2);
      
      // Draw crystal segments
      for (let k = 0; k < 3; k++) {
        const segmentSize = s.size * (0.9 - k * 0.25);
        const segmentAngle = angle + PI * k / 2;
        const segX = cos(segmentAngle) * segmentSize * 0.3;
        const segY = sin(segmentAngle) * segmentSize * 0.3;
        
        push();
        translate(segX, segY, 0);
        rotateZ(time * 0.4 + k);
        
        // Draw crystal segment
        beginShape(QUADS);
        vertex(-segmentSize/2, -segmentSize/8, 0);
        vertex(segmentSize/2, -segmentSize/8, 0);
        vertex(segmentSize/2, segmentSize/8, 0);
        vertex(-segmentSize/2, segmentSize/8, 0);
        endShape();
        
        pop();
      }
      
      pop();
    }
    
    // Add subtle glow effect
    noStroke();
    fill(red(s.color), green(s.color), blue(s.color), 20);
    sphere(s.size * 0.1);
    
    pop();
  }
  
  // Add floating particles for bioluminescent effect
  stroke(200, 230, 255, 150);
  strokeWeight(0.5);
  noFill();
  
  beginShape(POINTS);
  for (let i = 0; i < 200; i++) {
    const x = sin(time * 0.2 + i) * 400;
    const y = cos(time * 0.15 + i) * 300;
    const z = sin(time * 0.1 + i) * 600;
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
