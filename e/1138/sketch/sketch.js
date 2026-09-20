function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  // Sky background
  background(200, 50, 90);

  // Draw distant mountains with atmospheric haze
  drawMountains();

  // Draw rolling green fields in foreground
  drawFields();

  // Draw sky and clouds
  drawSky();

  // Add subtle sun
  drawSun();
}

function drawMountains() {
  const mountainColors = [200, 180, 160]; // HSB hues for mountains
  const numMountains = 5;
  const baseY = height * 0.4;

  for (let i = 0; i < numMountains; i++) {
    const x = map(i, 0, numMountains - 1, 0, width);
    const w = random(300, 500);
    const h = random(100, 200);
    const hue = mountainColors[i % mountainColors.length];
    
    fill(hue, 20, 40);
    noStroke();
    beginShape();
    vertex(x, baseY);
    vertex(x + w * 0.5, baseY - h);
    vertex(x + w, baseY);
    endShape(CLOSE);
    
    // Add atmospheric haze effect
    fill(hue, 10, 30, 0.2);
    beginShape();
    vertex(x, baseY);
    vertex(x + w * 0.5, baseY - h * 0.8);
    vertex(x + w, baseY);
    endShape(CLOSE);
  }
}

function drawFields() {
  const fieldColors = [120, 130, 140]; // Saturated greens
  const numRows = 10;
  const baseY = height * 0.5;
  
  for (let row = 0; row < numRows; row++) {
    const y = baseY + row * 20;
    const hue = fieldColors[row % fieldColors.length];
    
    fill(hue, 80, 60);
    noStroke();
    
    // Draw a rolling field
    beginShape();
    for (let x = -50; x < width + 50; x += 20) {
      const waveHeight = sin(x * 0.01 + row * 0.5) * 30;
      vertex(x, y + waveHeight);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Add shadows
    fill(hue, 70, 20, 0.3);
    beginShape();
    for (let x = -50; x < width + 50; x += 20) {
      const waveHeight = sin(x * 0.01 + row * 0.5) * 30;
      vertex(x, y + waveHeight + 10);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function drawSky() {
  // Draw gradient sky
  for (let y = 0; y < height * 0.4; y++) {
    const inter = map(y, 0, height * 0.4, 0, 1);
    const c = lerpColor(color(200, 50, 90), color(220, 30, 80), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw clouds
  fill(240, 10, 100);
  noStroke();
  for (let i = 0; i < 20; i++) {
    const x = random(width);
    const y = random(height * 0.2);
    const w = random(50, 100);
    const h = random(20, 40);
    ellipse(x, y, w, h);
  }
}

function drawSun() {
  fill(60, 100, 100); // Yellow
  noStroke();
  ellipse(width * 0.8, height * 0.15, 60, 60);
  
  // Add glow
  for (let i = 0; i < 5; i++) {
    const r = 70 + i * 10;
    fill(60, 100, 100, 0.2 - i * 0.03);
    ellipse(width * 0.8, height * 0.15, r, r);
  }
}
