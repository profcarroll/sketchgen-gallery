let panels = [];
const numPanels = 12;
const panelSize = 100;
const pulseSpeed = 0.02;
const rotationSpeed = 0.003;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize panels in a grid pattern
  for (let i = 0; i < numPanels; i++) {
    for (let j = 0; j < numPanels; j++) {
      panels.push({
        x: (i - numPanels/2) * panelSize,
        y: (j - numPanels/2) * panelSize,
        z: 0,
        hue: (i * 30 + j * 15) % 360,
        phase: random(TWO_PI),
        scale: 1
      });
    }
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Center the scene
  translate(-width/2, -height/2, 0);
  
  // Add subtle camera rotation for dynamic view
  rotateY(frameCount * 0.001);
  
  // Batch all lines into one shape for performance
  beginShape(LINES);
  
  // Draw each panel
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    
    // Calculate pulsing scale effect
    const pulse = sin(frameCount * pulseSpeed + panel.phase) * 0.15;
    panel.scale = 1 + pulse;
    
    // Set color with hue cycling
    const hue = (frameCount * 0.4 + panel.hue) % 360;
    
    push();
    translate(panel.x, panel.y, panel.z);
    rotateX(frameCount * rotationSpeed);
    rotateY(frameCount * rotationSpeed * 0.7);
    rotateZ(frameCount * rotationSpeed * 0.3);
    
    // Draw intricate panel structure using lines
    stroke(hue, 90, 95, 0.8);
    noFill();
    
    const segments = 16;
    const innerRadius = 15;
    const outerRadius = 40;
    
    // Draw multiple intersecting circles to create ornate pattern
    for (let k = 0; k < 3; k++) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / segments) {
        const radius = innerRadius + (outerRadius - innerRadius) * (k / 2.0);
        const x = cos(a) * radius;
        const y = sin(a) * radius;
        vertex(x, y, 0);
      }
      endShape(CLOSE);
    }
    
    // Draw connecting lines to create grid effect
    for (let k = 0; k < segments; k++) {
      const a1 = k * TWO_PI / segments;
      const a2 = ((k + 1) % segments) * TWO_PI / segments;
      
      const x1 = cos(a1) * outerRadius;
      const y1 = sin(a1) * outerRadius;
      const x2 = cos(a2) * outerRadius;
      const y2 = sin(a2) * outerRadius;
      
      // Add to batched lines
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    
    pop();
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
