let fields = [];
let skyColor;
let groundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create gradient sky colors
  skyColor = color(28, 80, 95); // Warm sunset orange
  groundColor = color(80, 40, 30); // Dark green

  // Generate field details
  for (let i = 0; i < 1000; i++) {
    fields.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(2, 8),
      hue: random(70, 90), // Green range
      sat: random(40, 70),
      bri: random(50, 90)
    });
  }

  noLoop();
}

function draw() {
  // Draw sky gradient
  background(skyColor);

  // Draw distant mountains (simple polygon)
  fill(240, 30, 20);
  noStroke();
  beginShape();
  vertex(0, height * 0.7);
  for (let i = 0; i < width; i += 20) {
    let y = height * 0.7 + sin(i / 100) * 30;
    vertex(i, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);

  // Draw foreground fields with detailed grass
  for (let i = 0; i < fields.length; i++) {
    let f = fields[i];
    fill(f.hue, f.sat, f.bri);
    noStroke();
    ellipse(f.x, f.y, f.size, f.size * 2);
  }

  // Draw long shadows
  stroke(0, 0, 0, 30);
  strokeWeight(1);
  for (let i = 0; i < width; i += 10) {
    let x = i;
    let y = height * 0.7 + sin(i / 50) * 20;
    line(x, y, x, height);
  }

  // Draw sun
  fill(40, 100, 100);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 60, 60);

  // Add glow effect to sun
  drawingContext.shadowColor = color(40, 100, 100);
  drawingContext.shadowBlur = 30;
  ellipse(width * 0.8, height * 0.2, 60, 60);
}
