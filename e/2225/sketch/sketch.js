let layers = [];
let shells = [];
let tideOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create stratified sediment layers
  for (let i = 0; i < 15; i++) {
    const y = map(i, 0, 15, -300, 300);
    const thickness = random(20, 40);
    const sedimentColor = color(
      map(i, 0, 15, 139, 70),   // tan to ochre
      map(i, 0, 15, 69, 40),    // tan to ochre
      map(i, 0, 15, 19, 20)     // tan to ochre
    );
    
    layers.push({
      y: y,
      thickness: thickness,
      color: sedimentColor
    });
  }
  
  // Create initial shell patterns
  for (let i = 0; i < 20; i++) {
    shells.push({
      x: random(-250, 250),
      y: random(-250, 250),
      size: random(10, 30),
      angle: random(TWO_PI),
      speed: random(0.005, 0.01),
      pulseSpeed: random(0.02, 0.04),
      pulsePhase: random(TWO_PI)
    });
  }
  
  frameRate(30);
}

function draw() {
  background(30, 40, 60); // Deep slate background
  
  // Update tide effect
  tideOffset += 0.01;
  
  // Auto-rotate scene
  rotateY(frameCount * 0.002);
  
  // Draw sediment layers as a single mesh to stay within budget
  noStroke();
  for (let layer of layers) {
    fill(layer.color);
    push();
    translate(0, layer.y, 0);
    box(500, layer.thickness, 10);
    pop();
  }
  
  // Draw shell patterns
  for (let shell of shells) {
    push();
    translate(shell.x, shell.y, 0);
    
    // Apply tide wave effect to position
    const tideEffect = sin(tideOffset + shell.x * 0.01) * 5;
    translate(0, tideEffect, 0);
    
    // Pulse shell size
    const pulse = sin(frameCount * shell.pulseSpeed + shell.pulsePhase) * 0.5 + 1;
    const currentSize = shell.size * pulse;
    
    // Draw spiral shell pattern
    stroke(200, 180, 160);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.2 + shell.angle;
      const radius = currentSize * 0.5 * (1 + sin(angle * 0.5)) * (i / 100);
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Draw inner spiral
    stroke(180, 160, 140);
    strokeWeight(0.5);
    beginShape();
    for (let i = 0; i < 50; i++) {
      const angle = i * 0.3 + shell.angle;
      const radius = currentSize * 0.3 * (1 + sin(angle * 0.7)) * (i / 50);
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw undulating wave effect
  stroke(100, 120, 180, 50);
  noFill();
  beginShape();
  for (let x = -250; x <= 250; x += 10) {
    const y = sin(x * 0.02 + tideOffset) * 30;
    vertex(x, y, 0);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
