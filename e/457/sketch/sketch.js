let stripes = [];
let crystalPattern = [];
let time = 0;
let pause = false;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize stripes
  for (let i = 0; i < 20; i++) {
    stripes.push({
      y: random(height),
      speed: random(1, 4),
      width: random(50, 200),
      hue: random(360)
    });
  }

  // Initialize crystal pattern
  for (let i = 0; i < 100; i++) {
    crystalPattern.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.02;
  
  // Draw moving stripes
  for (let stripe of stripes) {
    stripe.y += stripe.speed;
    if (stripe.y > height + 50) stripe.y = -50;
    
    fill(stripe.hue, 80, 90, 0.7);
    noStroke();
    rect(0, stripe.y, width, 20);
  }
  
  // Occasionally pause
  if (frameCount % 120 === 0) {
    pause = true;
  } else if (pause && frameCount % 30 === 0) {
    pause = false;
  }

  // Draw crystalline patterns when paused
  if (pause) {
    for (let crystal of crystalPattern) {
      crystal.angle += crystal.speed;
      crystal.size = 10 + sin(time * 2 + crystal.angle) * 5;
      
      push();
      translate(crystal.x, crystal.y);
      rotate(crystal.angle);
      
      fill(200, 100, 100, 0.8);
      noStroke();
      
      // Draw a glowing hexagon
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let x = crystal.size * cos(angle);
        let y = crystal.size * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
      
      pop();
    }
  }
}
