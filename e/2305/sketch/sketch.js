let strata = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create geological strata with rich, saturated colors
  let colors = [
    color(139, 69, 19),   // Brown
    color(205, 92, 92),   // Indian red
    color(160, 82, 45),   // Sienna
    color(128, 0, 128),   // Purple
    color(0, 100, 0),     // Dark green
    color(34, 139, 34),   // Forest green
    color(0, 0, 139),     // Dark blue
    color(75, 0, 130),    // Indigo
    color(255, 69, 0),    // Red-orange
    color(255, 140, 0),   // Dark orange
    color(255, 215, 0),   // Gold
    color(139, 0, 0)      // Dark red
  ];
  
  // Create many strata layers
  for (let i = 0; i < 200; i++) {
    strata.push({
      y: random(height),
      h: random(5, 30),
      color: random(colors),
      speed: random(-0.05, 0.05),
      sway: random(0.01, 0.03),
      swayOffset: random(TWO_PI)
    });
  }
  
  // Add some large, bleeding bands
  for (let i = 0; i < 10; i++) {
    strata.push({
      y: random(height),
      h: random(100, 200),
      color: random(colors),
      speed: random(-0.02, 0.02),
      sway: random(0.005, 0.015),
      swayOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.005;
  
  // Draw strata layers
  for (let i = 0; i < strata.length; i++) {
    let s = strata[i];
    
    // Animate the layer
    s.y += s.speed;
    
    // Add gentle swaying motion to simulate slow erosion
    let swayAmount = sin(time * s.sway + s.swayOffset) * 5;
    
    // Wrap around edges
    if (s.y > height + s.h) {
      s.y = -s.h;
    } else if (s.y < -s.h) {
      s.y = height + s.h;
    }
    
    // Draw the stratum with some transparency for depth
    fill(red(s.color), green(s.color), blue(s.color), 200);
    noStroke();
    
    // Draw a slightly skewed rectangle to simulate rock layers
    push();
    translate(width/2 + swayAmount, s.y);
    rect(-width/2, -s.h/2, width, s.h);
    pop();
    
    // Add subtle glow for some layers
    if (i % 10 === 0) {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = s.color;
      fill(red(s.color), green(s.color), blue(s.color), 100);
      rect(-width/2, -s.h/2 + s.y, width, s.h);
      drawingContext.shadowBlur = 0;
    }
  }
  
  // Add some slow color shifts over time
  for (let i = 0; i < strata.length; i++) {
    let s = strata[i];
    let hueShift = sin(time * 0.001 + i) * 5;
    let newColor = color(
      hue(s.color) + hueShift,
      saturation(s.color),
      brightness(s.color)
    );
    s.color = newColor;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
