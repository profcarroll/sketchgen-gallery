let layers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create organic, layered structures with deep, saturated colors
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
  
  // Create many organic layers
  for (let i = 0; i < 100; i++) {
    layers.push({
      y: random(-height/2, height/2),
      h: random(5, 30),
      color: random(colors),
      speed: random(-0.05, 0.05),
      sway: random(0.01, 0.03),
      swayOffset: random(TWO_PI),
      rotation: random(TWO_PI),
      scale: random(0.8, 1.2)
    });
  }
  
  // Add some large, bleeding bands
  for (let i = 0; i < 5; i++) {
    layers.push({
      y: random(-height/2, height/2),
      h: random(100, 200),
      color: random(colors),
      speed: random(-0.02, 0.02),
      sway: random(0.005, 0.015),
      swayOffset: random(TWO_PI),
      rotation: random(TWO_PI),
      scale: random(0.6, 1.4)
    });
  }
}

function draw() {
  background(10);
  
  time += 0.005;
  
  // Draw layers
  for (let i = 0; i < layers.length; i++) {
    let l = layers[i];
    
    // Animate the layer
    l.y += l.speed;
    
    // Add gentle swaying motion to simulate slow erosion
    let swayAmount = sin(time * l.sway + l.swayOffset) * 5;
    
    // Wrap around edges
    if (l.y > height/2 + l.h) {
      l.y = -height/2 - l.h;
    } else if (l.y < -height/2 - l.h) {
      l.y = height/2 + l.h;
    }
    
    // Draw the layer with some transparency for depth
    fill(red(l.color), green(l.color), blue(l.color), 150);
    noStroke();
    
    push();
    translate(0, l.y, 0);
    rotateX(l.rotation);
    scale(l.scale);
    rect(-width/2 + swayAmount, -l.h/2, width, l.h);
    pop();
    
    // Add subtle glow for some layers
    if (i % 10 === 0) {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = l.color;
      fill(red(l.color), green(l.color), blue(l.color), 100);
      rect(-width/2 + swayAmount, -l.h/2 + l.y, width, l.h);
      drawingContext.shadowBlur = 0;
    }
  }
  
  // Add some slow color shifts over time
  for (let i = 0; i < layers.length; i++) {
    let l = layers[i];
    let hueShift = sin(time * 0.001 + i) * 5;
    let newColor = color(
      hue(l.color) + hueShift,
      saturation(l.color),
      brightness(l.color)
    );
    l.color = newColor;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
