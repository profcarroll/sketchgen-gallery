let pieces = [];
let gears = [];
let assembled = false;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create cardboard pieces with corrugated pattern
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * TWO_PI;
    const x = cos(angle) * 150;
    const y = sin(angle) * 150;
    const z = random(-50, 50);
    
    pieces.push({
      id: i,
      x,
      y,
      z,
      angle,
      originalX: x,
      originalY: y,
      originalZ: z,
      rotation: 0,
      targetRotation: random(PI * 2),
      connected: false,
      connections: []
    });
  }

  // Create gear patterns
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TWO_PI;
    const x = cos(angle) * 100;
    const y = sin(angle) * 100;
    
    gears.push({
      id: i,
      x,
      y,
      z: 0,
      rotation: 0,
      radius: random(20, 40),
      teeth: floor(random(8, 16)),
      spinSpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera rotation
  rotateY(time * 0.1);
  rotateX(sin(time * 0.2) * 0.1);
  
  if (assembled) {
    // Spin gears
    for (let gear of gears) {
      gear.rotation += gear.spinSpeed;
    }
    
    // Draw gears
    for (let gear of gears) {
      push();
      translate(gear.x, gear.y, gear.z);
      
      // Draw gear teeth
      stroke(200, 100, 80);
      noFill();
      strokeWeight(2);
      beginShape();
      for (let i = 0; i < gear.teeth; i++) {
        const angle = (i / gear.teeth) * TWO_PI + gear.rotation;
        const x = cos(angle) * gear.radius;
        const y = sin(angle) * gear.radius;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw gear center
      fill(100, 100, 50);
      noStroke();
      ellipse(0, 0, gear.radius * 0.3);
      
      pop();
    }
    
    // Draw connections between pieces and gears
    stroke(200, 100, 80);
    strokeWeight(1);
    for (let piece of pieces) {
      if (piece.connected) {
        for (let gear of gears) {
          line(piece.x, piece.y, piece.z, gear.x, gear.y, gear.z);
        }
      }
    }
    
    // Draw assembled pieces
    for (let piece of pieces) {
      if (piece.connected) {
        push();
        translate(piece.x, piece.y, piece.z);
        rotateZ(piece.rotation);
        
        // Draw corrugated cardboard pattern
        fill(60, 30, 90);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, 40, 20);
        
        // Draw corrugation lines
        stroke(50, 20, 70);
        strokeWeight(1);
        for (let i = -18; i < 18; i += 4) {
          line(i, -10, i, 10);
        }
        
        pop();
      }
    }
  } else {
    // Animate pieces towards center and connect
    for (let piece of pieces) {
      if (!piece.connected) {
        // Move piece towards center with some randomness
        const targetX = 0;
        const targetY = 0;
        const targetZ = 0;
        
        piece.x += (targetX - piece.x) * 0.02;
        piece.y += (targetY - piece.y) * 0.02;
        piece.z += (targetZ - piece.z) * 0.02;
        
        // Add some wobble
        piece.x += sin(time + piece.id) * 2;
        piece.y += cos(time + piece.id) * 2;
        
        // Rotate towards target orientation
        const targetRotation = piece.angle;
        piece.rotation += (targetRotation - piece.rotation) * 0.05;
        
        // Draw piece
        push();
        translate(piece.x, piece.y, piece.z);
        rotateZ(piece.rotation);
        
        // Draw corrugated cardboard pattern
        fill(60, 30, 90);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, 40, 20);
        
        // Draw corrugation lines
        stroke(50, 20, 70);
        strokeWeight(1);
        for (let i = -18; i < 18; i += 4) {
          line(i, -10, i, 10);
        }
        
        pop();
      } else {
        // Draw connected pieces with rotation
        push();
        translate(piece.x, piece.y, piece.z);
        rotateZ(piece.rotation);
        
        // Draw corrugated cardboard pattern
        fill(60, 30, 90);
        noStroke();
        rectMode(CENTER);
        rect(0, 0, 40, 20);
        
        // Draw corrugation lines
        stroke(50, 20, 70);
        strokeWeight(1);
        for (let i = -18; i < 18; i += 4) {
          line(i, -10, i, 10);
        }
        
        pop();
      }
    }
    
    // Connect pieces when they get close
    for (let i = 0; i < pieces.length; i++) {
      if (!pieces[i].connected) {
        for (let j = i + 1; j < pieces.length; j++) {
          if (!pieces[j].connected) {
            const dx = pieces[i].x - pieces[j].x;
            const dy = pieces[i].y - pieces[j].y;
            const dz = pieces[i].z - pieces[j].z;
            const distance = sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < 60) {
              // Connect these pieces
              pieces[i].connected = true;
              pieces[j].connected = true;
              
              // Add connections to gear system
              for (let gear of gears) {
                if (random() > 0.5) {
                  pieces[i].connections.push(gear.id);
                  pieces[j].connections.push(gear.id);
                }
              }
            }
          }
        }
      }
    }
    
    // Check if all pieces are connected
    let allConnected = true;
    for (let piece of pieces) {
      if (!piece.connected) {
        allConnected = false;
        break;
      }
    }
    
    if (allConnected) {
      assembled = true;
    }
  }
}

function mousePressed() {
  // Start assembly process on click
  if (!assembled) {
    for (let piece of pieces) {
      piece.connected = false;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
