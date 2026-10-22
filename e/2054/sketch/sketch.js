let panels = [];
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a deep, resonant color palette inspired by 60s pen plotter aesthetics
  colorPalette = [
    color(255, 0, 100),   // Bright magenta
    color(0, 200, 255),   // Bright cyan
    color(255, 200, 0),   // Vibrant yellow
    color(0, 255, 100),   // Electric green
    color(150, 0, 255),   // Deep purple
    color(255, 100, 0),   // Orange-red
    color(0, 150, 255),   // Sky blue
    color(255, 0, 200),   // Hot pink
    color(0, 255, 255),   // Cyan
    color(255, 150, 0),   // Amber
    color(100, 0, 255),   // Indigo
    color(255, 255, 0)    // Bright yellow
  ];
  
  // Create massive overlapping geometric panels
  for (let i = 0; i < 8; i++) {
    panels.push({
      x: random(width),
      y: random(height),
      w: random(400, 1000),
      h: random(300, 800),
      speedX: random(-0.15, 0.15),
      speedY: random(-0.1, 0.1),
      color: random(colorPalette),
      alpha: random(180, 255),
      // For bleeding effect
      bleedAmount: random(0.2, 0.7),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.001, 0.001)
    });
  }
  
  // Ensure at least one panel has high saturation and glow
  panels[0].color = color(255, 0, 100);
  panels[1].color = color(0, 200, 255);
}

function draw() {
  background(10);
  
  // Update and draw panels
  for (let i = 0; i < panels.length; i++) {
    let panel = panels[i];
    
    // Update position with slow floating motion
    panel.x += panel.speedX;
    panel.y += panel.speedY;
    panel.rotation += panel.rotationSpeed;
    
    // Bounce off edges
    if (panel.x < -panel.w || panel.x > width) panel.speedX *= -1;
    if (panel.y < -panel.h || panel.y > height) panel.speedY *= -1;
    
    // Apply a subtle breathing effect to size
    let scale = 1 + sin(frameCount * 0.002 + i) * 0.03;
    let w = panel.w * scale;
    let h = panel.h * scale;
    
    // Draw the main panel with blend mode for bleeding effect
    fill(red(panel.color), green(panel.color), blue(panel.color), panel.alpha);
    noStroke();
    
    // Create soft edges by drawing multiple layers
    push();
    translate(panel.x + w/2, panel.y + h/2);
    rotate(panel.rotation);
    for (let j = 0; j < 3; j++) {
      let alpha = map(j, 0, 2, panel.alpha * 0.2, panel.alpha);
      fill(red(panel.color), green(panel.color), blue(panel.color), alpha);
      rect(-w/2 + j * 2, -h/2 + j * 2, w, h, 30);
    }
    pop();
    
    // Draw a subtle glow effect
    drawingContext.shadowBlur = 40;
    drawingContext.shadowColor = panel.color;
    fill(red(panel.color), green(panel.color), blue(panel.color), panel.alpha * 0.4);
    push();
    translate(panel.x + w/2, panel.y + h/2);
    rotate(panel.rotation);
    rect(-w/2, -h/2, w, h, 30);
    pop();
    drawingContext.shadowBlur = 0;
    
    // Draw a secondary soft panel that bleeds into others
    if (i > 0) {
      let prevPanel = panels[i - 1];
      fill(red(prevPanel.color), green(prevPanel.color), blue(prevPanel.color), panel.alpha * 0.2);
      push();
      translate(panel.x + w/2, panel.y + h/2);
      rotate(panel.rotation);
      rect(-w/2 * 0.9, -h/2 * 0.9, w * 0.9, h * 0.9, 25);
      pop();
    }
  }
  
  // Add a subtle color shift over time
  for (let i = 0; i < panels.length; i++) {
    let hueShift = sin(frameCount * 0.0003 + i) * 10;
    panels[i].color = lerpColor(panels[i].color, color(hueShift, 200, 150), 0.0005);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
