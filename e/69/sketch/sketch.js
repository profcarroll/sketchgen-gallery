function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  // Background gradient
  for (let y = 0; y < height; y += 2) {
    let hue = (y * 0.5) % 360;
    let sat = 10;
    let bright = 80 + sin(y * 0.02) * 10;
    fill(hue, sat, bright);
    rect(0, y, width, 2);
  }

  // Repeating pattern of rectangles
  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      let hue = (x + y) * 0.2 % 360;
      let sat = 15;
      let bright = 60 + sin((x + y) * 0.05) * 10;
      
      // Draw a rectangle with gradient fill
      push();
      translate(x, y);
      for (let i = 0; i < 5; i++) {
        let alpha = map(i, 0, 4, 0.3, 0);
        fill(hue, sat, bright, alpha);
        rect(0, 0, 30 - i * 2, 30 - i * 2);
      }
      pop();
    }
  }

  // Add some grid lines for more retro feel
  stroke(0, 0, 50, 0.1);
  strokeWeight(1);
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }

  noLoop(); // Ensure the sketch does not animate
}
