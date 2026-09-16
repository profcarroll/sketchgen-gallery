let arcs = [];
let flares = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  noStroke();
  
  // Initialize arcs
  for (let i = 0; i < 20; i++) {
    arcs.push({
      radius: random(50, width/2),
      speed: random(0.001, 0.005),
      thickness: random(2, 8),
      hue: random(1)
    });
  }
}

function draw() {
  background(0);
  
  // Center of the canvas
  let centerX = 0;
  let centerY = 0;
  
  // Update time
  time += 0.01;
  
  // Draw pulsating field
  push();
  rotate(time * 0.2);
  for (let i = 0; i < arcs.length; i++) {
    let arc = arcs[i];
    let angle = time * arc.speed;
    
    // Create the sweeping arc effect
    fill(arc.hue, 0.8, 0.9, 0.3);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = centerX + cos(a + angle) * arc.radius;
      let y = centerY + sin(a + angle) * arc.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add a subtle glow
    fill(arc.hue, 0.8, 1, 0.1);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = centerX + cos(a + angle) * (arc.radius + arc.thickness);
      let y = centerY + sin(a + angle) * (arc.radius + arc.thickness);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Update radius to simulate pulsation
    arc.radius += sin(time * 0.5 + i) * 0.5;
    if (arc.radius < 50) arc.radius = 50;
    if (arc.radius > width/2) arc.radius = width/2;
  }
  pop();
  
  // Draw flares
  for (let i = flares.length - 1; i >= 0; i--) {
    let flare = flares[i];
    fill(flare.hue, 1, 1, flare.alpha);
    ellipse(flare.x, flare.y, flare.size);
    
    // Update flare
    flare.alpha -= 0.02;
    flare.size += 0.5;
    
    if (flare.alpha <= 0) {
      flares.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Start the field
  time = 0;
}

function mouseDragged() {
  // Add a flare at mouse position
  flares.push({
    x: mouseX - width/2,
    y: mouseY - height/2,
    size: random(10, 30),
    alpha: 1,
    hue: random(1)
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
