let layers = [];
let gears = [];
let tideOffset = 0;
let mouseSpeed = 0;

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
      color: sedimentColor,
      alpha: random(30, 80)
    });
  }
  
  // Create initial gears
  for (let i = 0; i < 15; i++) {
    gears.push({
      x: random(-250, 250),
      y: random(-250, 250),
      z: random(-100, 100),
      size: random(15, 35),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      rotationSpeed: random(0.002, 0.01),
      gearAngle: random(TWO_PI),
      phase: random(TWO_PI)
    });
  }
  
  frameRate(30);
}

function draw() {
  background(30, 40, 60); // Deep slate background
  
  // Update tide effect
  tideOffset += 0.01;
  
  // Auto-rotate scene
  rotateY(frameCount * 0.002 + mouseSpeed * 0.5);
  
  // Draw sediment layers as translucent planes to stay within budget
  noStroke();
  for (let layer of layers) {
    fill(red(layer.color), green(layer.color), blue(layer.color), layer.alpha);
    push();
    translate(0, layer.y, 0);
    box(500, layer.thickness, 10);
    pop();
  }
  
  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    
    // Apply tide wave effect to position
    const tideEffect = sin(tideOffset + gear.x * 0.01) * 5;
    translate(0, tideEffect, 0);
    
    // Rotate gear
    rotateZ(gear.gearAngle);
    
    // Draw gear pattern as shell-like spiral
    stroke(200, 180, 160);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < 200; i++) {
      const angle = i * 0.1 + gear.angle;
      const radius = gear.size * 0.5 * (1 + sin(angle * 0.3)) * (i / 200);
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Draw inner spiral
    stroke(180, 160, 140);
    strokeWeight(0.5);
    beginShape();
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.2 + gear.angle;
      const radius = gear.size * 0.3 * (1 + sin(angle * 0.4)) * (i / 100);
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

function mouseDragged() {
  // Change rotational speed and depth based on drag
  mouseSpeed = (mouseX - pmouseX) * 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
