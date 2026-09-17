let cornStalks = [];
let ufo;
let beamPulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create corn stalks
  for (let i = 0; i < 300; i++) {
    cornStalks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.8),
      h: random(20, 60),
      w: random(2, 5)
    });
  }
  
  ufo = {
    x: width / 2,
    y: height * 0.6,
    r: 40
  };
}

function draw() {
  // Dark sky background
  background(10, 5, 30);
  
  // Draw stars
  fill(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    if (random() > 0.9) {
      ellipse(random(width), random(height * 0.4), 1, 1);
    }
  }
  
  // Draw corn stalks
  stroke(30, 120, 30);
  strokeWeight(2);
  for (let stalk of cornStalks) {
    line(stalk.x, stalk.y, stalk.x, stalk.y - stalk.h);
  }
  
  // Pulsing beams
  beamPulse = sin(frameCount * 0.05) * 0.5 + 0.5;
  const beamIntensity = 200 + beamPulse * 55;
  
  // Draw beams
  noStroke();
  fill(0, 255, 255, beamIntensity * 0.3);
  rect(ufo.x - 10, ufo.y, 20, height - ufo.y);
  fill(0, 255, 255, beamIntensity * 0.2);
  rect(ufo.x - 8, ufo.y, 16, height - ufo.y);
  
  // Draw UFO disc
  noStroke();
  fill(200, 200, 255, 200);
  ellipse(ufo.x, ufo.y, ufo.r * 2, ufo.r * 0.6);
  
  // Add glow effect to UFO
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(0, 255, 255, 100);
  ellipse(ufo.x, ufo.y, ufo.r * 2, ufo.r * 0.6);
  drawingContext.shadowBlur = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
