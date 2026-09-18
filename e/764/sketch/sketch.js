function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Background gradient from deep blue to warm orange
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(20, 10, 40), color(255, 120, 30), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Rolling hills with varying green tones
  drawHills();

  // Foreground shadows cast by the hills
  drawShadows();

  // Sun as a glowing orb
  drawSun();
}

function drawHills() {
  noStroke();
  for (let i = 0; i < 15; i++) {
    let x = map(i, 0, 14, 0, width);
    let h = map(noise(i * 0.2), 0, 1, height * 0.3, height * 0.7);
    let w = width / 15;
    
    // Create a hill with color variation
    let hue = map(noise(i * 0.5), 0, 1, 80, 120); // Green range
    let sat = map(noise(i * 0.3 + 100), 0, 1, 40, 70);
    let lit = map(noise(i * 0.4 + 200), 0, 1, 30, 60);
    
    fill(hue, sat, lit);
    
    // Draw a smooth hill shape
    beginShape();
    for (let j = 0; j < 100; j++) {
      let angle = map(j, 0, 99, 0, TWO_PI);
      let r = w * 0.5 + noise(j * 0.1) * w * 0.2;
      let xoff = cos(angle) * r;
      let yoff = sin(angle) * r;
      vertex(x + xoff, h - yoff);
    }
    endShape(CLOSE);
  }
}

function drawShadows() {
  // Cast long exaggerated shadows
  stroke(0, 20);
  strokeWeight(3);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let len = random(50, 150);
    let angle = random(PI/4, PI/2); // Shadows at an acute angle
    line(x, y, x + cos(angle) * len, y + sin(angle) * len);
  }
}

function drawSun() {
  // Sun with warm glow
  noStroke();
  fill(255, 200, 50);
  ellipse(width * 0.8, height * 0.2, 100, 100);
  
  // Sun rays
  strokeWeight(3);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 11, 0, TWO_PI);
    let x1 = width * 0.8 + cos(angle) * 50;
    let y1 = height * 0.2 + sin(angle) * 50;
    let x2 = width * 0.8 + cos(angle) * 120;
    let y2 = height * 0.2 + sin(angle) * 120;
    stroke(255, 180, 30);
    line(x1, y1, x2, y2);
  }
}
