let stars = [];
let nebula;
let supernovas = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a nebula background using gradient and noise
  nebula = createGraphics(width, height);
  nebula.colorMode(HSB, 360, 100, 100, 1);
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      let n = noise(x * 0.001, y * 0.001, frameCount * 0.0005);
      let c = color(240 + n * 30, 60 + n * 20, 10 + n * 10, n * 0.2);
      nebula.set(x, y, c);
    }
  }
  nebula.loadPixels();

  // Create thousands of stars
  for (let i = 0; i < 3000; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(0.5, 1),
      twinkleSpeed: random(0.02, 0.05),
      twinklePhase: random(TWO_PI)
    });
  }
}

function draw() {
  // Draw nebula background
  image(nebula, 0, 0);
  
  // Draw and animate stars
  for (let star of stars) {
    let twinkle = sin(frameCount * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
    fill(240, 50, 100, star.brightness * twinkle);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }

  // Occasionally create a supernova
  if (frameCount % 300 === 0) {
    supernovas.push({
      x: random(width),
      y: random(height),
      size: 0,
      maxsize: random(50, 100),
      opacity: 1
    });
  }

  // Update and draw supernovas
  for (let i = supernovas.length - 1; i >= 0; i--) {
    let s = supernovas[i];
    s.size += 2;
    s.opacity -= 0.02;

    if (s.opacity <= 0) {
      supernovas.splice(i, 1);
      continue;
    }

    // Draw the supernova
    fill(30, 100, 100, s.opacity);
    noStroke();
    ellipse(s.x, s.y, s.size);

    // Add a glow effect
    fill(60, 100, 100, s.opacity * 0.5);
    ellipse(s.x, s.y, s.size * 2);
  }

  // Slowly shift the nebula for motion effect
  translate(0, sin(frameCount * 0.001) * 0.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
