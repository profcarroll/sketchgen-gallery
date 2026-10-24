let panels = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create interlocking geometric panels
  for (let i = 0; i < 15; i++) {
    panels.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-500, 500),
      size: random(80, 150),
      hue: random(360),
      speed: random(0.02, 0.05),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05),
      phase: random(TWO_PI),
      snap: random() > 0.7,
      snapped: false,
      targetX: 0,
      targetY: 0,
      targetZ: 0
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.02;
  
  // Draw panels with snapping and interlocking
  for (let i = 0; i < panels.length; i++) {
    let panel = panels[i];
    
    push();
    
    // Update position with helical motion
    panel.x += sin(time * panel.speed) * 2;
    panel.y += cos(time * panel.speed * 0.7) * 1.5;
    panel.z += sin(time * panel.speed * 0.5) * 1;
    
    // Apply rotation
    panel.angle += panel.rotationSpeed;
    
    // Handle snapping behavior
    if (panel.snap && !panel.snapped) {
      let targetX = cos(time * panel.speed * 3 + panel.phase) * 200;
      let targetY = sin(time * panel.speed * 2 + panel.phase) * 150;
      let targetZ = sin(time * panel.speed * 1.5 + panel.phase) * 100;
      
      // Snap to target position
      panel.x += (targetX - panel.x) * 0.1;
      panel.y += (targetY - panel.y) * 0.1;
      panel.z += (targetZ - panel.z) * 0.1;
      
      if (abs(targetX - panel.x) < 5 && abs(targetY - panel.y) < 5 && abs(targetZ - panel.z) < 5) {
        panel.snapped = true;
      }
    }
    
    translate(panel.x, panel.y, panel.z);
    rotateX(panel.angle);
    rotateY(panel.angle * 0.7);
    rotateZ(panel.angle * 0.3);
    
    // Panel shape - interlocking hexagonal structure
    let size = panel.size * (sin(time * 2 + panel.phase) * 0.3 + 0.7);
    
    // Draw the panel with bright neon colors
    noStroke();
    fill(panel.hue, 100, 100, 0.9);
    
    // Create a cut-paper effect with geometric panels
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x = cos(angle) * size/2;
      let y = sin(angle) * size/2;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Add inner geometric pattern
    fill(panel.hue + 180, 100, 100, 0.5);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x = cos(angle) * size/4;
      let y = sin(angle) * size/4;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
    
    // Update hue for color shift
    panel.hue += 0.5;
    if (panel.hue > 360) panel.hue -= 360;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
