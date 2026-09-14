let stars = [];
let mw;
let supernovas = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create Milky Way background
  mw = createGraphics(width, height);
  mw.colorMode(HSB, 360, 100, 100, 1);
  mw.noiseSeed(42);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let a = map(noise(x * 0.001, y * 0.001), 0, 1, 0, 1);
    mw.fill(240, 50, 100, a * 0.3);
    mw.noStroke();
    mw.ellipse(x, y, 200 * a, 50 * a);
  }
  
  // Create stars
  for (let i = 0; i < 1000; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(0.5, 1),
      twinkleSpeed: random(0.01, 0.03),
      twinklePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Draw Milky Way
  image(mw, 0, 0);
  
  // Draw stars
  for (let star of stars) {
    let twinkle = sin(frameCount * star.twinkleSpeed + star.twinklePhase);
    let brightness = star.brightness + twinkle * 0.3;
    fill(60, 50, 100, brightness);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }
  
  // Occasionally create a supernova
  if (frameCount % 200 === 0 && random() > 0.7) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 30);
    let life = 30;
    supernovas.push({x, y, size, life});
  }
  
  // Update and draw supernovas
  for (let i = supernovas.length - 1; i >= 0; i--) {
    let sn = supernovas[i];
    sn.life--;
    let alpha = map(sn.life, 0, 30, 0, 1);
    fill(0, 100, 100, alpha * 0.8);
    noStroke();
    ellipse(sn.x, sn.y, sn.size * (30 - sn.life) / 30);
    
    if (sn.life <= 0) {
      supernovas.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
