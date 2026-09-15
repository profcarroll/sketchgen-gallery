let structures = [];
let plants = [];
let time = 0;
let atmosphere = { 
  ambient: 0,
  sun: { x: 0, y: 0, z: 0 },
  color: [255, 255, 255]
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  
  // Generate cityscape structures
  for (let i = 0; i < 100; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 80),
      h: random(50, 200),
      d: random(20, 80),
      color: [random(100, 200), random(100, 200), random(100, 200)],
      angle: random(TWO_PI)
    });
  }
  
  // Generate bioluminescent plants
  for (let i = 0; i < 300; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(2, 10),
      pulse: random(TWO_PI),
      color: [random(50, 255), random(100, 255), random(100, 255)]
    });
  }
}

function draw() {
  background(0);
  
  // Update time and atmosphere
  time += 0.01;
  const cycle = (time % TWO_PI) / TWO_PI;
  
  // Cycle through light phases
  if (cycle < 0.25) {
    // Daylight to twilight
    atmosphere.ambient = map(cycle, 0, 0.25, 255, 50);
    atmosphere.color = [255, 230, 180];
  } else if (cycle < 0.5) {
    // Twilight to night
    atmosphere.ambient = map(cycle, 0.25, 0.5, 50, 10);
    atmosphere.color = [100, 120, 200];
  } else if (cycle < 0.75) {
    // Night to twilight
    atmosphere.ambient = map(cycle, 0.5, 0.75, 10, 50);
    atmosphere.color = [80, 90, 180];
  } else {
    // Twilight to day
    atmosphere.ambient = map(cycle, 0.75, 1, 50, 255);
    atmosphere.color = [255, 230, 180];
  }
  
  // Update sun position
  const sunAngle = time * 0.2;
  atmosphere.sun.x = cos(sunAngle) * width/2;
  atmosphere.sun.y = sin(sunAngle) * height/2;
  atmosphere.sun.z = 0;
  
  // Draw cityscape structures
  for (let s of structures) {
    push();
    translate(s.x, s.y - s.h/2, s.z);
    rotateY(s.angle);
    
    // Reflective wet surfaces
    fill(200 + sin(time * 2 + s.x) * 50, 
         200 + sin(time * 2 + s.y) * 50, 
         200 + sin(time * 2 + s.z) * 50);
    
    // Structure with fractal-like patterns
    for (let i = 0; i < 3; i++) {
      push();
      translate(0, i * s.h/3, 0);
      box(s.w, s.h/3, s.d);
      
      // Add fractal-like details
      fill(150 + sin(time + i) * 50, 
           150 + sin(time + i + PI/2) * 50, 
           150 + sin(time + i + PI) * 50);
      
      for (let j = 0; j < 4; j++) {
        push();
        translate(
          random(-s.w/3, s.w/3),
          random(-s.h/6, s.h/6),
          random(-s.d/3, s.d/3)
        );
        box(random(5, 15), random(5, 15), random(5, 15));
        pop();
      }
      pop();
    }
    pop();
  }
  
  // Draw bioluminescent plants
  beginShape(POINTS);
  for (let p of plants) {
    const pulse = sin(p.pulse + time * 2) * 0.5 + 0.5;
    const intensity = 100 + pulse * 150;
    
    fill(
      p.color[0] * intensity/255,
      p.color[1] * intensity/255,
      p.color[2] * intensity/255
    );
    
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw fractal projections on wet surfaces
  for (let s of structures) {
    if (random() < 0.3) {
      push();
      translate(s.x, s.y - s.h/2, s.z);
      rotateY(s.angle);
      
      const projectionSize = map(s.h, 50, 200, 100, 300);
      const fractalLevel = floor(random(2, 5));
      
      // Draw a simple fractal pattern
      for (let i = 0; i < fractalLevel; i++) {
        push();
        scale(1 - i * 0.2);
        stroke(
          200 + sin(time + i) * 55,
          255,
          200 + cos(time + i) * 55
        );
        strokeWeight(1);
        noFill();
        
        beginShape();
        for (let j = 0; j < 8; j++) {
          const angle = j * TWO_PI / 8;
          const radius = projectionSize * (0.5 + 0.3 * sin(time * 2 + i));
          vertex(
            cos(angle) * radius,
            0,
            sin(angle) * radius
          );
        }
        endShape(CLOSE);
        pop();
      }
      
      pop();
    }
  }
  
  // Ambient lighting based on time of day
  ambientLight(atmosphere.ambient);
  pointLight(
    atmosphere.color[0],
    atmosphere.color[1],
    atmosphere.color[2],
    atmosphere.sun.x,
    atmosphere.sun.y,
    atmosphere.sun.z
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
