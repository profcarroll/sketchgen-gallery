function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(10);
}

function draw() {
  // Create a gradient sky
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(30, 50, 90), color(40, 60, 95), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw distant hills
  fill(20, 40, 50);
  noStroke();
  beginShape();
  for (let x = 0; x < width + 100; x += 100) {
    let y = height * 0.7 + sin(x * 0.01 + frameCount * 0.005) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Draw acacia trees
  for (let i = 0; i < 20; i++) {
    let x = map(i, 0, 20, 0, width);
    let h = random(80, 150);
    let w = random(10, 25);
    
    // Tree trunk
    fill(10, 40, 30);
    rect(x - w/2, height - h, w, h);
    
    // Tree canopy
    fill(15, 50, 40);
    ellipse(x, height - h, w * 2, w * 1.5);
  }

  // Draw heat haze
  blendMode(LIGHTEST);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = height * 0.8 + random(30);
    let size = random(10, 30);
    let alpha = map(y, height * 0.8, height, 20, 50);
    
    fill(40, 20, 90, alpha/255);
    ellipse(x, y, size, size * 0.6);
  }
  blendMode(BLEND);

  // Subtle color shifts
  let hueShift = (sin(frameCount * 0.01) + 1) * 0.5;
  let satShift = (cos(frameCount * 0.008) + 1) * 0.5;
  
  // Apply subtle color variations to sky
  for (let y = 0; y < height * 0.3; y++) {
    let inter = map(y, 0, height * 0.3, 0, 1);
    let c = lerpColor(color(25 + hueShift * 5, 40 + satShift * 10, 80), 
                      color(35 + hueShift * 5, 50 + satShift * 10, 90), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
