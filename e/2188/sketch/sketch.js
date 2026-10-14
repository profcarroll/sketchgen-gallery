// Deep-sea siphonophore crystalline structures
let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  frameRate(30);

  // Create complex interlocking crystalline structures
  const numStructures = 8;
  for (let i = 0; i < numStructures; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(150, 300),
      rotationSpeed: random(-0.002, 0.002),
      color: color(
        random(30, 80),   // R
        random(100, 180), // G
        random(180, 255), // B
        150               // A
      ),
      segments: floor(random(3, 7)),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  // Camera movement for organic perspective
  time += 0.002;
  const camX = sin(time * 0.1) * 200;
  const camY = cos(time * 0.15) * 100;
  const camZ = 800 + sin(time * 0.05) * 300;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Dynamic lighting
  ambientLight(40);
  pointLight(255, 255, 255, 0, -300, 500);
  pointLight(100, 200, 255, 300, 200, -300);
  
  // Draw all structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    push();
    
    translate(s.x, s.y, s.z);
    
    // Organic rotation
    rotateX(time * 0.2 + s.phase);
    rotateY(time * 0.15 + s.phase * 0.7);
    rotateZ(time * 0.1 + s.phase * 0.3);
    
    // Create bioluminescent glow effect
    const glow = sin(time * 2 + s.phase) * 50 + 100;
    fill(red(s.color), green(s.color), blue(s.color), 180);
    stroke(red(s.color), green(s.color), blue(s.color), 100);
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
  
  // Add floating particles for bioluminescent effect
  stroke(100, 200, 255, 150);
  strokeWeight(0.5);
  noFill();
  
  beginShape(POINTS);
  for (let i = 0; i < 200; i++) {
    const x = sin(time * 0.3 + i) * width/2;
    const y = cos(time * 0.2 + i) * height/2;
    const z = sin(time * 0.1 + i) * 500;
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
