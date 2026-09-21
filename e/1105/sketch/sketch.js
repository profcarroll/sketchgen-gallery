let stitches = [];
let stitchCount = 0;
let colors = [
  [255, 230, 230], // light pink
  [230, 255, 255], // light cyan
  [255, 255, 230], // light yellow
  [230, 230, 255], // light blue
  [255, 230, 255], // light magenta
];

function setup() {
  createCanvas(400, 600);
  noStroke();
  colorMode(RGB);
  // Initialize first row of stitches
  for (let i = 0; i < 20; i++) {
    stitches.push({
      x: i * 30 + 15,
      y: 0,
      color: colors[i % colors.length],
      size: 12,
      angle: 0
    });
  }
  stitchCount = 20;
}

function draw() {
  background(240);
  
  // Draw existing stitches
  for (let i = 0; i < stitches.length; i++) {
    let s = stitches[i];
    fill(s.color[0], s.color[1], s.color[2]);
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    drawStitch(s.size);
    pop();
  }

  // Add new stitch at the top
  if (frameCount % 5 === 0) {
    let x = random(15, width - 15);
    let y = 0;
    let color = colors[int(random(colors.length))];
    let size = random(8, 16);
    let angle = random(TWO_PI);
    
    stitches.push({
      x: x,
      y: y,
      color: color,
      size: size,
      angle: angle
    });
    
    // Move all stitches down
    for (let i = 0; i < stitches.length; i++) {
      stitches[i].y += 10;
    }
  }

  // Remove old stitches that are off-screen
  while (stitches.length > 0 && stitches[0].y > height) {
    stitches.shift();
  }
}

function drawStitch(size) {
  // Draw a hexagonal stitch shape
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = cos(angle) * size/2;
    let y = sin(angle) * size/2;
    vertex(x, y);
  }
  endShape(CLOSE);
}
