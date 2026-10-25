let blooms = [];
let water;
let rippleEffect = 0;
let isRippleActive = false;
let reflectionPattern;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  pixelDensity(1);
  
  // Create rhododendron blooms
  for (let i = 0; i < 80; i++) {
    blooms.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-50, 50),
      size: random(30, 70),
      hue: random(10, 30), // Reddish hues
      saturation: random(180, 255),
      brightness: random(180, 255),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03),
      petalCount: floor(random(5, 9)),
      twist: random(TWO_PI)
    });
  }
  
  // Create water surface with reflection pattern
  water = createGraphics(width, height);
  water.colorMode(HSB, 255);
  water.background(200, 10, 95); // Deep blue-green
  
  // Generate reflection pattern on water surface
  water.loadPixels();
  for (let x = 0; x < width; x += 4) {
    for (let y = 0; y < height; y += 4) {
      let index = (y * width + x) * 4;
      // Create subtle pattern that reflects bloom colors
      let r = 200 + sin(x * 0.01) * 20;
      let g = 10 + cos(y * 0.01) * 10;
      let b = 95 + sin((x + y) * 0.005) * 15;
      water.pixels[index] = r;
      water.pixels[index + 1] = g;
      water.pixels[index + 2] = b;
      water.pixels[index + 3] = 255;
    }
  }
  water.updatePixels();
}

function draw() {
  background(20, 10, 95); // Dark background
  
  // Draw water surface with reflection pattern
  push();
  translate(0, 0, -100);
  rotateX(PI);
  texture(water);
  plane(width, height);
  pop();
  
  // Update ripple effect
  if (isRippleActive) {
    rippleEffect += 0.1;
    if (rippleEffect > TWO_PI) isRippleActive = false;
  }
  
  // Draw blooms with reflection effect
  for (let bloom of blooms) {
    push();
    
    // Position in 3D space
    translate(bloom.x, bloom.y, bloom.z);
    
    // Sway animation
    let swayOffset = sin(frameCount * bloom.swaySpeed + bloom.sway) * 5;
    rotateY(swayOffset * 0.1);
    
    // Draw bloom petals
    fill(bloom.hue, bloom.saturation, bloom.brightness);
    noStroke();
    
    beginShape();
    for (let i = 0; i < bloom.petalCount; i++) {
      let angle = map(i, 0, bloom.petalCount, 0, TWO_PI);
      let x1 = cos(angle) * bloom.size;
      let y1 = sin(angle) * bloom.size;
      let x2 = cos(angle + PI / bloom.petalCount) * (bloom.size * 0.7);
      let y2 = sin(angle + PI / bloom.petalCount) * (bloom.size * 0.7);
      
      vertex(x1, y1);
      vertex(x2, y2);
    }
    endShape(CLOSE);
    
    // Add some green foliage
    fill(40, 150, 80);
    beginShape();
    for (let i = 0; i < 3; i++) {
      let angle = map(i, 0, 3, 0, TWO_PI);
      let x = cos(angle) * (bloom.size * 0.6);
      let y = sin(angle) * (bloom.size * 0.6);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Apply ripple distortion to water surface
  if (isRippleActive) {
    water.loadPixels();
    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        let index = (y * width + x) * 4;
        let distortion = sin(x * 0.01 + rippleEffect) * cos(y * 0.01 + rippleEffect) * 20;
        
        // Modify pixel color to create ripple effect
        let r = water.pixels[index];
        let g = water.pixels[index + 1];
        let b = water.pixels[index + 2];
        
        // Add some color variation to the ripple
        water.pixels[index] = r + distortion * 0.5;
        water.pixels[index + 1] = g + distortion * 0.3;
        water.pixels[index + 2] = b + distortion * 0.1;
      }
    }
    water.updatePixels();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  isRippleActive = true;
  rippleEffect = 0;
}
