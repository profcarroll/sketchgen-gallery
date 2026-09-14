function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(200, 10, 95); // muted sky

  // Draw ground
  fill(80, 20, 70);
  rect(0, height * 0.7, width, height * 0.3);

  // Draw evolving vegetables
  for (let i = 0; i < 15; i++) {
    let x = (i * 100 + frameCount * 0.5) % (width + 200) - 100;
    let y = height * 0.75 + sin(frameCount * 0.01 + i) * 20;
    let size = 20 + sin(frameCount * 0.02 + i) * 10;
    let hue = (frameCount * 0.3 + i * 10) % 360;

    // Vegetable shape - growing and morphing
    fill(hue, 80, 60 + sin(frameCount * 0.03 + i) * 20, 0.8);
    push();
    translate(x, y);
    rotate(frameCount * 0.01 + i);
    if (i % 3 === 0) {
      ellipse(0, 0, size, size * 0.6); // carrot-like
    } else if (i % 3 === 1) {
      rectMode(CENTER);
      rect(0, 0, size, size * 0.8); // potato-like
    } else {
      ellipse(0, 0, size * 0.7, size); // tomato-like
    }
    pop();
  }

  // Subtle sun movement
  fill(50, 100, 90);
  ellipse(width * 0.8, height * 0.2, 60 + sin(frameCount * 0.02) * 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
