function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  angleMode(RADIANS);
  
  // Initialize dominoes
  dominoes = [];
  for (let i = 0; i < 50; i++) {
    dominoes.push({
      x: random(width),
      y: random(-50, -10),
      w: random(8, 12),
      h: random(30, 40),
      angle: random(TWO_PI),
      speed: random(1, 3),
      fallTime: random(100),
      active: false,
      color: color(random(20, 40), 80, 90)
    });
  }
  
  // Initialize crystalline structures
  crystals = [];
  for (let i = 0; i < 30; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      segments: floor(random(3, 8)),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.01, 0.01),
      dissolveProgress: 0,
      targetDissolve: random(0.3, 0.9)
    });
  }
}

function draw() {
  background(240, 10, 5, 1);
  
  const time = frameCount * 0.01;
  
  // Draw riverbed sediment
  drawRiverbed(time);
  
  // Update and draw crystals
  updateCrystals(time);
  
  // Update and draw dominoes
  updateDominoes();
}

function drawRiverbed(time) {
  const sedimentColor = color(30, 30, 20, 0.8);
  
  push();
  translate(width/2, height/2);
  
  // Draw slow-moving sediment layers
  for (let i = 0; i < 15; i++) {
    const layerY = sin(time * 0.5 + i * 0.3) * 20;
    const layerHeight = 8 + sin(time * 0.3 + i * 0.2) * 4;
    
    fill(sedimentColor);
    noStroke();
    
    beginShape();
    for (let j = 0; j < 100; j++) {
      const angle = map(j, 0, 99, 0, TWO_PI);
      const radius = 300 + sin(time * 0.2 + angle) * 20 + layerY;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add some viscosity
    stroke(30, 20, 15, 0.5);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let j = 0; j < 100; j++) {
      const angle = map(j, 0, 99, 0, TWO_PI);
      const radius = 300 + sin(time * 0.2 + angle) * 20 + layerY;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  pop();
}

function updateCrystals(time) {
  for (let i = 0; i < crystals.length; i++) {
    const crystal = crystals[i];
    
    // Animate dissolution
    if (crystal.dissolveProgress < crystal.targetDissolve) {
      crystal.dissolveProgress += 0.002;
    }
    
    const dissolveFactor = crystal.dissolveProgress;
    
    push();
    translate(crystal.x, crystal.y);
    rotate(crystal.angle + time * crystal.rotationSpeed);
    
    // Draw crystalline structure
    const segments = crystal.segments;
    const size = crystal.size;
    
    for (let j = 0; j < segments; j++) {
      const angle = TWO_PI / segments * j;
      
      // Base crystal shape - sharp edges
      fill(200, 70, 90, 1 - dissolveFactor * 0.5);
      stroke(200, 80, 100, 1 - dissolveFactor * 0.3);
      strokeWeight(1);
      
      push();
      rotate(angle);
      
      // Draw a geometric segment
      beginShape();
      vertex(0, 0);
      vertex(size * 0.7, size * 0.2);
      vertex(size * 0.8, size * 0.6);
      vertex(size * 0.5, size * 0.9);
      vertex(size * 0.1, size * 0.7);
      endShape(CLOSE);
      
      pop();
    }
    
    // Draw connecting lines (eroding)
    if (dissolveFactor > 0.3) {
      stroke(200, 60, 80, 0.5 - dissolveFactor * 0.4);
      strokeWeight(1);
      for (let j = 0; j < segments; j++) {
        const angle1 = TWO_PI / segments * j;
        const angle2 = TWO_PI / segments * ((j + 1) % segments);
        
        line(
          cos(angle1) * size * 0.5,
          sin(angle1) * size * 0.5,
          cos(angle2) * size * 0.5,
          sin(angle2) * size * 0.5
        );
      }
    }
    
    pop();
  }
}

function updateDominoes() {
  const time = frameCount * 0.01;
  
  for (let i = 0; i < dominoes.length; i++) {
    const domino = dominoes[i];
    
    // Activate domino after delay
    if (!domino.active && frameCount > domino.fallTime) {
      domino.active = true;
    }
    
    if (domino.active) {
      // Apply gravity
      domino.y += domino.speed;
      
      // Add some horizontal movement
      domino.x += sin(time * 0.5 + i) * 0.3;
      
      // Rotate as it falls
      domino.angle += 0.1;
      
      // Draw domino
      push();
      translate(domino.x, domino.y);
      rotate(domino.angle);
      
      fill(domino.color);
      stroke(0, 0, 0, 0.2);
      strokeWeight(1);
      
      rectMode(CENTER);
      rect(0, 0, domino.w, domino.h);
      
      pop();
    }
    
    // Reset domino if it falls off screen
    if (domino.y > height + 50) {
      domino.x = random(width);
      domino.y = random(-50, -10);
      domino.angle = random(TWO_PI);
      domino.active = false;
      domino.fallTime = frameCount + random(50);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
