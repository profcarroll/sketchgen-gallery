let strata = [];
let fissureWidth = 0;
let crystals = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create geological strata
  for (let y = 0; y < height; y += random(20, 40)) {
    let layer = {
      y: y,
      height: random(15, 30),
      color: color(
        random(80, 150),
        random(60, 120),
        random(40, 90),
        random(180, 220)
      ),
      texture: random(['smooth', 'grainy', 'striped'])
    };
    strata.push(layer);
  }
  
  // Initialize crystals
  for (let i = 0; i < 50; i++) {
    crystals.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(10, 40),
      rotation: random(TWO_PI),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05),
      color: color(
        random(200, 255),
        random(150, 255),
        random(200, 255),
        random(200, 255)
      ),
      revealed: false,
      revealProgress: 0
    });
  }
}

function draw() {
  // Update fissure
  fissureWidth += 0.1;
  
  // Draw background (dark earth)
  background(30);
  
  // Draw strata
  for (let layer of strata) {
    fill(layer.color);
    noStroke();
    
    if (layer.texture === 'striped') {
      // Draw striped pattern
      for (let x = 0; x < width; x += random(20, 50)) {
        rect(x, layer.y, random(10, 20), layer.height);
      }
    } else if (layer.texture === 'grainy') {
      // Draw grainy texture
      for (let i = 0; i < 100; i++) {
        let x = random(width);
        let y = layer.y + random(layer.height);
        rect(x, y, 2, 2);
      }
    } else {
      rect(0, layer.y, width, layer.height);
    }
  }
  
  // Draw fissure
  noFill();
  stroke(255, 100);
  strokeWeight(2);
  line(0, height/2, width, height/2);
  
  // Draw expanding fissure
  if (fissureWidth > 0) {
    let crackOffset = (width - fissureWidth) / 2;
    noStroke();
    
    // Draw fissure sides with glowing edges
    fill(40, 50, 70, 180);
    rect(crackOffset, height/2 - 5, fissureWidth, 10);
    
    // Draw glow effect around fissure
    for (let i = 0; i < 5; i++) {
      let alpha = map(i, 0, 4, 50, 0);
      fill(100, 200, 255, alpha);
      rect(crackOffset - i*2, height/2 - 5 - i*2, fissureWidth + i*4, 10 + i*4);
    }
    
    // Draw revealed crystals
    for (let crystal of crystals) {
      if (!crystal.revealed && abs(crystal.x - width/2) < fissureWidth/2 + 50) {
        crystal.revealProgress += 0.02;
        if (crystal.revealProgress > 1) {
          crystal.revealed = true;
        }
      }
      
      if (crystal.revealed) {
        crystal.pulse += crystal.pulseSpeed;
        
        // Draw crystal
        push();
        translate(crystal.x, crystal.y);
        rotate(crystal.rotation);
        
        let pulseSize = sin(crystal.pulse) * 0.3 + 1;
        let pulseColor = map(sin(crystal.pulse), -1, 1, 150, 255);
        
        fill(crystal.color);
        noStroke();
        
        // Draw multi-faceted crystal
        for (let i = 0; i < 6; i++) {
          let angle = TWO_PI * i / 6;
          let x1 = cos(angle) * crystal.size * pulseSize;
          let y1 = sin(angle) * crystal.size * pulseSize;
          let x2 = cos(angle + PI/3) * crystal.size * pulseSize;
          let y2 = sin(angle + PI/3) * crystal.size * pulseSize;
          
          triangle(0, 0, x1, y1, x2, y2);
        }
        
        // Draw inner core glow
        fill(255, 255, 255, 150);
        ellipse(0, 0, crystal.size * pulseSize * 0.4, crystal.size * pulseSize * 0.4);
        
        pop();
      }
    }
  }
  
  // Draw fissure opening effect
  if (fissureWidth > width/4) {
    noStroke();
    fill(150, 200, 255, 30);
    rect(0, height/2 - 20, width, 40);
    
    // Draw light rays from fissure
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let x1 = width/2 + cos(angle) * 50;
      let y1 = height/2 + sin(angle) * 50;
      let x2 = width/2 + cos(angle) * (fissureWidth/2 + 100);
      let y2 = height/2 + sin(angle) * (fissureWidth/2 + 100);
      
      stroke(180, 220, 255, 80);
      strokeWeight(2);
      line(x1, y1, x2, y2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
