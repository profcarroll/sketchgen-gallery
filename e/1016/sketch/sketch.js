let grass = [];
let mountains = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create foreground grass patches
  for (let i = 0; i < 500; i++) {
    grass.push({
      x: random(width),
      y: random(height * 0.4, height * 0.7),
      h: random(20, 60),
      s: random(70, 90),
      b: random(60, 90)
    });
  }

  // Create distant mountains
  for (let i = 0; i < 15; i++) {
    mountains.push({
      x: i * (width / 15),
      h: random(height * 0.3, height * 0.5),
      s: random(20, 40),
      b: random(30, 60)
    });
  }
}

function draw() {
  // Background sky
  background(210, 20, 90);

  // Draw sun
  fill(60, 100, 100);
  noStroke();
  ellipse(width * 0.8, height * 0.2, 100, 100);

  // Draw foreground grass patches
  for (let g of grass) {
    fill(g.h, g.s, g.b);
    noStroke();
    rect(g.x, g.y, 3, g.h);
  }

  // Draw distant mountains with atmospheric haze
  noStroke();
  for (let m of mountains) {
    // Haze effect - multiple semi-transparent layers
    fill(m.h, m.s, m.b, 0.3);
    beginShape();
    vertex(0, height);
    vertex(m.x, height - m.h);
    vertex(m.x + width/15, height - m.h * 0.8);
    vertex(width, height);
    endShape(CLOSE);
    
    // Add some variation
    fill(m.h, m.s, m.b, 0.2);
    beginShape();
    vertex(0, height);
    vertex(m.x + 10, height - m.h * 0.7);
    vertex(m.x + width/15 - 10, height - m.h * 0.9);
    vertex(width, height);
    endShape(CLOSE);
  }

  // Add subtle atmospheric haze to entire background
  for (let i = 0; i < 3; i++) {
    fill(210, 10, 80, 0.05);
    noStroke();
    rect(0, 0, width, height);
  }

  noLoop(); // Static composition
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
