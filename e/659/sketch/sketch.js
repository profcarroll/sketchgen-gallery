let shells = [];
let sandTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create a subtle sand texture
  sandTexture = createGraphics(width, height);
  sandTexture.noiseSeed(42);
  sandTexture.background(250, 240, 220); // Pale yellow base
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let sz = random(0.5, 2);
    sandTexture.noStroke();
    sandTexture.fill(240, 230, 210); // Slightly darker for texture
    sandTexture.ellipse(x, y, sz, sz);
  }

  // Generate shells with natural variation
  for (let i = 0; i < 150; i++) {
    let x = random(width * 0.2, width * 0.8);
    let y = random(height * 0.3, height * 0.7);
    let size = random(8, 25);
    let hue = random(30, 60); // Yellow-orange range
    let saturation = random(40, 80);
    let brightness = random(70, 90);
    let rotation = random(TWO_PI);
    shells.push({
      x,
      y,
      size,
      hue,
      saturation,
      brightness,
      rotation
    });
  }
}

function draw() {
  background(245, 235, 215); // Soft pale yellow background

  // Draw the textured sand base
  image(sandTexture, 0, 0);

  // Draw the mound shape using a gradient
  noStroke();
  for (let y = height * 0.3; y < height * 0.7; y += 2) {
    let alpha = map(y, height * 0.3, height * 0.7, 50, 150);
    fill(248, 238, 210, alpha);
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let offset = sin(x * 0.01 + frameCount * 0.005) * 20;
      vertex(x, y + offset);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }

  // Draw shells
  for (let shell of shells) {
    push();
    translate(shell.x, shell.y);
    rotate(shell.rotation);
    fill(shell.hue, shell.saturation, shell.brightness);
    noStroke();

    // Draw a simple shell shape using ellipse and arc
    let w = shell.size;
    let h = shell.size * 0.6;

    // Main shell body
    ellipse(0, 0, w, h);

    // Add some texture with small arcs
    fill(shell.hue + 5, shell.saturation - 10, shell.brightness - 10);
    arc(0, -h/2, w * 0.8, h * 0.6, 0, PI);
    arc(0, h/2, w * 0.7, h * 0.5, PI, TWO_PI);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
