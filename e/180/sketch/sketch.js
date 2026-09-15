let bears = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create multiple bear figures with different positions and sizes
  for (let i = 0; i < 8; i++) {
    bears.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      angle: random(TWO_PI),
      sway: random(1000),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(50, 120, 50); // Earthy green background
  time += 0.02;

  for (let bear of bears) {
    // Update bear position and angle with rhythmic motion
    bear.x += sin(time * bear.speed + bear.sway) * 0.5;
    bear.y += cos(time * bear.speed + bear.sway) * 0.5;
    bear.angle = sin(time * bear.speed + bear.sway) * 0.3;

    // Keep bears within canvas bounds
    if (bear.x < 0 || bear.x > width) bear.x = random(width);
    if (bear.y < 0 || bear.y > height) bear.y = random(height);

    push();
    translate(bear.x, bear.y);
    rotate(bear.angle);

    // Draw bear silhouette using a combination of ellipses and arcs
    fill(139, 69, 19); // Brown body
    noStroke();

    // Bear body
    ellipse(0, 0, bear.size * 0.8, bear.size * 1.2);

    // Bear head
    ellipse(0, -bear.size * 0.4, bear.size * 0.6, bear.size * 0.6);

    // Bear ears
    fill(139, 69, 19);
    ellipse(-bear.size * 0.25, -bear.size * 0.7, bear.size * 0.2, bear.size * 0.2);
    ellipse(bear.size * 0.25, -bear.size * 0.7, bear.size * 0.2, bear.size * 0.2);

    // Bear eyes
    fill(255);
    ellipse(-bear.size * 0.15, -bear.size * 0.5, bear.size * 0.1, bear.size * 0.1);
    ellipse(bear.size * 0.15, -bear.size * 0.5, bear.size * 0.1, bear.size * 0.1);

    // Bear nose
    fill(0);
    ellipse(0, -bear.size * 0.3, bear.size * 0.15, bear.size * 0.1);

    // Add vibrant colors to make it lively
    fill(255, 200, 0); // Vibrant yellow for nose highlight
    ellipse(0, -bear.size * 0.3, bear.size * 0.05, bear.size * 0.05);

    fill(255, 0, 0); // Red for cheek blush
    ellipse(-bear.size * 0.15, -bear.size * 0.4, bear.size * 0.1, bear.size * 0.05);
    ellipse(bear.size * 0.15, -bear.size * 0.4, bear.size * 0.1, bear.size * 0.05);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
