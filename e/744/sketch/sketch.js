let sheets = [];
let sheetCount = 150;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < sheetCount; i++) {
    sheets.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(100, 300),
      speed: random(0.5, 2),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05),
      colorHue: random(120, 180), // emerald to cyan range
      solid: false,
      solidTimer: 0
    });
  }
}

function draw() {
  background(0);
  
  for (let sheet of sheets) {
    // Update position
    sheet.y += sheet.speed;
    
    // Reset if sheet goes off screen
    if (sheet.y > height/2 + 200) {
      sheet.y = -200;
      sheet.x = random(-width/2, width/2);
      sheet.z = random(-500, 500);
    }
    
    // Update pulse
    sheet.pulse += sheet.pulseSpeed;
    
    // Check for solidification
    let pulseVal = sin(sheet.pulse);
    if (pulseVal > 0.9 && !sheet.solid) {
      sheet.solid = true;
      sheet.solidTimer = 0;
    } else if (sheet.solid) {
      sheet.solidTimer++;
      if (sheet.solidTimer > 60) { // Stay solid for 60 frames
        sheet.solid = false;
      }
    }
    
    push();
    translate(sheet.x, sheet.y, sheet.z);
    
    // Apply rotation for visual effect
    rotateX(frameCount * 0.001);
    rotateY(frameCount * 0.002);
    
    if (sheet.solid) {
      // Draw crystalline array
      fill(sheet.colorHue, 80, 90, 0.8);
      noStroke();
      
      let gridSize = 10;
      let gridRows = 8;
      let gridCols = 8;
      
      for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
          let x = map(i, 0, gridRows - 1, -sheet.size/2, sheet.size/2);
          let y = map(j, 0, gridCols - 1, -sheet.size/2, sheet.size/2);
          
          // Create a slight offset for each cube
          let offsetX = sin(frameCount * 0.01 + i) * 5;
          let offsetY = cos(frameCount * 0.01 + j) * 5;
          
          push();
          translate(x + offsetX, y + offsetY, 0);
          box(20, 20, 10); // Small cube
          pop();
        }
      }
    } else {
      // Draw liquid light sheet with pulsating effect
      let pulseVal = sin(sheet.pulse) * 0.5 + 0.5;
      let scale = 1 + pulseVal * 0.3;
      
      fill(sheet.colorHue, 80, 90, 0.4);
      noStroke();
      
      beginShape();
      for (let i = 0; i < 20; i++) {
        let angle = map(i, 0, 19, 0, TWO_PI);
        let radius = sheet.size * scale;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y, 0);
      }
      endShape(CLOSE);
      
      // Draw ripples
      stroke(sheet.colorHue, 80, 90, 0.6);
      noFill();
      for (let i = 0; i < 3; i++) {
        let rippleRadius = sheet.size * scale + i * 20;
        beginShape();
        for (let j = 0; j < 20; j++) {
          let angle = map(j, 0, 19, 0, TWO_PI);
          let x = cos(angle) * rippleRadius;
          let y = sin(angle) * rippleRadius;
          vertex(x, y, 0);
        }
        endShape(CLOSE);
      }
    }
    
    pop();
  }
}
