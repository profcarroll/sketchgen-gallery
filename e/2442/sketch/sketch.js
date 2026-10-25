let specimens = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create botanical specimens that emerge and fold
  for (let i = 0; i < 20; i++) {
    specimens.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(30, 100),
      hue: random(30, 90), // Soft greenish hues for watercolor effect
      saturation: random(20, 60),
      brightness: random(70, 90),
      alpha: random(0.1, 0.4),
      speed: random(0.005, 0.02),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      angleZ: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      phase: random(TWO_PI),
      folded: false,
      foldPhase: random(TWO_PI),
      targetX: 0,
      targetY: 0,
      targetZ: 0
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Very faint background to simulate aged paper
  
  time += 0.01;
  
  for (let i = 0; i < specimens.length; i++) {
    let spec = specimens[i];
    
    push();
    
    // Slow, organic motion
    spec.x += sin(time * spec.speed + spec.phase) * 0.5;
    spec.y += cos(time * spec.speed * 0.7 + spec.phase) * 0.3;
    spec.z += sin(time * spec.speed * 0.5 + spec.phase) * 0.2;
    
    // Apply rotation
    spec.angleX += spec.rotationSpeed;
    spec.angleY += spec.rotationSpeed * 0.7;
    spec.angleZ += spec.rotationSpeed * 0.3;
    
    translate(spec.x, spec.y, spec.z);
    rotateX(spec.angleX);
    rotateY(spec.angleY);
    rotateZ(spec.angleZ);
    
    // Simulate unfolding/folding
    let fold = sin(time * 0.5 + spec.foldPhase) * 0.5 + 0.5;
    if (fold < 0.3) {
      spec.folded = true;
    } else if (fold > 0.7) {
      spec.folded = false;
    }
    
    // Adjust size based on folding state
    let size = spec.size * (spec.folded ? (1 - fold) : fold);
    
    // Draw the specimen with a watercolor-like appearance
    noStroke();
    fill(spec.hue, spec.saturation, spec.brightness, spec.alpha);
    
    // Draw a soft, organic shape (like a flower or leaf)
    beginShape();
    let points = 12;
    for (let j = 0; j < points; j++) {
      let angle = TWO_PI * j / points;
      let radius = size * (0.8 + 0.4 * sin(time * 2 + angle));
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Add subtle inner details to mimic botanical structure
    fill(spec.hue + 180, spec.saturation, spec.brightness, spec.alpha * 0.5);
    beginShape();
    for (let j = 0; j < points / 2; j++) {
      let angle = TWO_PI * j / (points/2);
      let radius = size * 0.4 * (0.8 + 0.4 * sin(time * 3 + angle));
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
