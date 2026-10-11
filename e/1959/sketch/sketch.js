let veins = [];
let time = 0;
let bgPixels;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize data veins
  for (let i = 0; i < 50; i++) {
    veins.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      segments: [],
      hue: random(10, 30), // Rusty orange to brown
      saturation: random(40, 70),
      brightness: random(20, 60)
    });
  }
  
  // Pre-compute background pixels for performance
  bgPixels = new Array(width * height);
  for (let i = 0; i < bgPixels.length; i++) {
    let x = i % width;
    let y = floor(i / width);
    let r = 30 + noise(x * 0.001, y * 0.001, time * 0.001) * 20;
    let g = 15 + noise(x * 0.001 + 1000, y * 0.001 + 1000, time * 0.001) * 10;
    let b = 5 + noise(x * 0.001 + 2000, y * 0.001 + 2000, time * 0.001) * 10;
    bgPixels[i] = color(r, g, b);
  }
}

function draw() {
  // Draw rusted steel background
  for (let i = 0; i < bgPixels.length; i++) {
    let x = i % width;
    let y = floor(i / width);
    set(x, y, bgPixels[i]);
  }
  updatePixels();
  
  time += 1;
  
  // Draw data veins
  drawingContext.shadowBlur = 10;
  
  for (let vein of veins) {
    // Update position
    vein.x += cos(vein.angle) * vein.speed * 100;
    vein.y += sin(vein.angle) * vein.speed * 100;
    
    // Wrap around screen
    if (vein.x < -50) vein.x = width + 50;
    if (vein.x > width + 50) vein.x = -50;
    if (vein.y < -50) vein.y = height + 50;
    if (vein.y > height + 50) vein.y = -50;
    
    // Add new segment
    vein.segments.push({x: vein.x, y: vein.y});
    if (vein.segments.length > 100) {
      vein.segments.shift();
    }
    
    // Draw the vein
    if (vein.segments.length > 1) {
      let alpha = map(vein.segments.length, 1, 100, 50, 200);
      
      // Glow effect
      drawingContext.shadowColor = color(vein.hue, vein.saturation, vein.brightness, alpha * 0.7);
      
      stroke(vein.hue, vein.saturation, vein.brightness, alpha);
      strokeWeight(1.5);
      noFill();
      
      beginShape();
      for (let i = 0; i < vein.segments.length; i++) {
        let p = vein.segments[i];
        vertex(p.x, p.y);
      }
      endShape();
    }
  }
  
  // Reset shadow
  drawingContext.shadowBlur = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
