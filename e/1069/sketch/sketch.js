let heartbeats = [];
let isRed = false;
let dragHeight = 100;

function setup() {
  createCanvas(800, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Initialize heartbeats
  for (let i = 0; i < 200; i++) {
    heartbeats.push({
      x: width + i * 4,
      y: height / 2,
      size: random(10, 50),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(0);

  // Draw glowing line
  for (let i = 0; i < heartbeats.length; i++) {
    let h = heartbeats[i];
    h.x -= h.speed;
    
    if (h.x < -50) {
      h.x = width + 20;
      h.y = height / 2 + random(-50, 50);
      h.size = random(10, 50);
    }

    let c = isRed ? color(0, 100, 100) : color(120, 100, 100);
    fill(c);
    ellipse(h.x, h.y, h.size, h.size * 0.4);
    
    // Add glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = c;
    ellipse(h.x, h.y, h.size, h.size * 0.4);
    drawingContext.shadowBlur = 0;
  }
}

function mousePressed() {
  isRed = !isRed;
}

function mouseDragged() {
  dragHeight = map(mouseY, 0, height, 20, 200);
}
