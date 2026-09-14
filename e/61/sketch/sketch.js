let stars = [];
let milkyWay;
let supernovas = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create Milky Way pattern
  milkyWay = createGraphics(width, height);
  milkyWay.colorMode(HSB, 360, 100, 100, 1);
  milkyWay.noiseSeed(12345);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    let alpha = random(20, 60);
    milkyWay.noStroke();
    milkyWay.fill(240, 50, 30, alpha/100);
    milkyWay.ellipse(x, y, size, size);
  }
  
  // Create stars
  for (let i = 0; i < 1000; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(30, 100),
      twinkleSpeed: random(0.01, 0.05),
      twinklePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(230, 80, 10); // Deep indigo background
  
  // Draw Milky Way
  image(milkyWay, 0, 0);
  
  // Draw and animate stars
  for (let star of stars) {
    let brightness = star.brightness + sin(frameCount * star.twinkleSpeed + star.twinklePhase) * 20;
    fill(360, 100, brightness, 1);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }
  
  // Occasionally create supernova
  if (frameCount % 300 === 0 && random() > 0.7) {
    let x = random(width);
    let y = random(height);
    let size = random(50, 150);
    let maxBrightness = random(80, 100);
    supernovas.push({x, y, size, maxBrightness, age: 0});
  }
  
  // Update and draw supernovas
  for (let i = supernovas.length - 1; i >= 0; i--) {
    let sn = supernovas[i];
    sn.age++;
    
    if (sn.age > 30) {
      supernovas.splice(i, 1);
      continue;
    }
    
    let opacity = map(sn.age, 0, 30, 1, 0);
    let currentSize = sn.size * (1 + sn.age * 0.05);
    let brightness = map(sn.age, 0, 30, sn.maxBrightness, 0);
    
    fill(60, 100, brightness, opacity);
    noStroke();
    ellipse(sn.x, sn.y, currentSize);
  }
  
  // Subtle background shift for cosmic motion
  translate(sin(frameCount * 0.001) * 2, cos(frameCount * 0.001) * 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
