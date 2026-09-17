let grassParticles = [];
let skyColor;
let groundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a sky gradient from light blue to pale blue
  skyColor = color(200, 50, 90);
  groundColor = color(100, 70, 40);
  
  // Generate grass particles with varying heights and hues
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let h = random(10, 40); // Height of grass blade
    let s = random(30, 80); // Saturation
    let b = random(50, 90); // Brightness
    let hue = random(80, 120); // Green range
    
    grassParticles.push({
      x: x,
      y: y,
      h: h,
      s: s,
      b: b,
      hue: hue,
      swayPhase: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  // Draw sky
  background(skyColor);
  
  // Draw distant mountains (hazy and blue)
  noStroke();
  fill(200, 40, 60, 0.5);
  for (let i = 0; i < 10; i++) {
    let x = map(i, 0, 9, 0, width);
    let h = random(80, 150);
    triangle(x, height * 0.6, x + 50, height * 0.6 - h, x + 100, height * 0.6);
  }
  
  // Draw ground
  fill(groundColor);
  rect(0, height * 0.6, width, height * 0.4);
  
  // Draw grass particles with swaying animation
  strokeWeight(1);
  for (let i = 0; i < grassParticles.length; i++) {
    let p = grassParticles[i];
    
    // Animate sway
    p.swayPhase += p.swaySpeed;
    let sway = sin(p.swayPhase) * 2;
    
    // Draw grass blade
    stroke(p.hue, p.s, p.b);
    line(p.x + sway, p.y, p.x + sway, p.y - p.h);
  }
  
  // Add some sun with subtle glow effect
  fill(60, 100, 100, 0.3);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 150, 150);
  fill(60, 100, 100, 0.6);
  ellipse(width * 0.8, height * 0.2, 100, 100);
}
