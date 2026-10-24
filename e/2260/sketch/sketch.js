let strata = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create rusted steel strata
  for (let i = 0; i < 50; i++) {
    strata.push({
      x: random(width),
      y: random(height),
      size: random(200, 600),
      color: color(random(100, 200), random(20, 60), random(0, 30), random(150, 255)),
      speed: random(0.001, 0.003),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(50, 40, 30);
  
  time += 0.01;
  
  // Draw strata with diffusion effect
  for (let i = 0; i < strata.length; i++) {
    const s = strata[i];
    
    // Animate the diffusion
    const ripple = sin(time * s.speed + s.angle) * 0.5 + 0.5;
    const size = s.size * (1 + ripple * 0.3);
    
    noStroke();
    fill(s.color);
    
    // Draw multiple concentric circles to simulate diffusion
    for (let j = 0; j < 5; j++) {
      const alpha = map(j, 0, 4, 200, 30);
      const radius = size * (1 - j * 0.2) * 0.8;
      
      if (radius > 0) {
        fill(red(s.color), green(s.color), blue(s.color), alpha);
        ellipse(s.x, s.y, radius * 2, radius * 2);
      }
    }
    
    // Add some texture to the strata
    stroke(0, 0, 0, 50);
    noFill();
    for (let j = 0; j < 3; j++) {
      const r = size * (1 - j * 0.2) * 0.9;
      if (r > 0) {
        ellipse(s.x, s.y, r * 2, r * 2);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
