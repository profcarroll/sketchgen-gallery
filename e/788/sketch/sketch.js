let sandSurface;
let shells = [];
let seed = 12345;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  
  // Set up sand surface with noise
  sandSurface = createGraphics(width, height);
  sandSurface.noiseSeed(seed);
  sandSurface.background(240);
  
  // Draw sand texture
  sandSurface.stroke(230, 215, 160);
  sandSurface.strokeWeight(1);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let nx = sandSurface.noise(x * 0.01, y * 0.01) * 20;
    let ny = sandSurface.noise(x * 0.01 + 1000, y * 0.01 + 1000) * 20;
    sandSurface.point(x + nx, y + ny);
  }
  
  // Generate shells
  randomSeed(seed);
  for (let i = 0; i < 80; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(15, 40);
    let hue = random(30, 50); // pale yellow range
    let saturation = random(20, 40);
    let brightness = random(80, 100);
    let alpha = random(70, 100);
    let rotation = random(TWO_PI);
    shells.push({
      x,
      y,
      size,
      hue,
      saturation,
      brightness,
      alpha,
      rotation
    });
  }
}

function draw() {
  background(245);
  
  // Draw sand surface
  image(sandSurface, 0, 0);
  
  // Draw shells with pearlescent effect
  for (let shell of shells) {
    push();
    translate(shell.x, shell.y);
    rotate(shell.rotation);
    
    // Shell shape (simplified)
    fill(shell.hue, shell.saturation, shell.brightness, shell.alpha);
    noStroke();
    
    beginShape();
    for (let i = 0; i < 12; i++) {
      let angle = map(i, 0, 11, 0, TWO_PI);
      let r = shell.size * 0.5 + sin(angle * 3) * shell.size * 0.1;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Pearlescent highlight
    fill(255, 255, 255, 30);
    ellipse(shell.size * 0.1, -shell.size * 0.2, shell.size * 0.3, shell.size * 0.2);
    
    pop();
  }
}
