let grid = [];
let cells = [];
let hiddenTexts = [];
let clickArea;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a strict orthogonal grid
  let gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      cells.push({ x, y, w: gridSize, h: gridSize });
    }
  }

  // Create hidden text blocks
  hiddenTexts = [
    { text: "EXHIBITION", x: width * 0.2, y: height * 0.3, size: 48, opacity: 0 },
    { text: "OPENING", x: width * 0.6, y: height * 0.7, size: 36, opacity: 0 },
    { text: "MAY 15", x: width * 0.8, y: height * 0.2, size: 24, opacity: 0 }
  ];

  // Define a click area in the center
  clickArea = {
    x: width / 2 - 100,
    y: height / 2 - 50,
    w: 200,
    h: 100
  };

  textSize(16);
}

function draw() {
  background(255);
  fill(0);

  // Draw grid lines
  stroke(0);
  strokeWeight(0.5);
  noFill();
  for (let cell of cells) {
    rect(cell.x, cell.y, cell.w, cell.h);
  }

  // Draw main headlines
  textSize(36);
  textAlign(CENTER, TOP);
  text("SWISS SCHOOL", width / 2, 50);

  textSize(24);
  text("MODULAR TYPOGRAPHY", width / 2, 100);

  // Body copy
  textSize(16);
  textAlign(LEFT, TOP);
  text("This composition explores the principles of Swiss design through a structured grid and typographic hierarchy.", 50, 200);

  // Geometric captions
  textSize(14);
  text("GRID", 100, 300);
  text("HIERARCHY", width - 150, 300);
  text("VISUAL RELATIONSHIPS", width / 2 - 100, 350);

  // Draw hidden texts
  for (let t of hiddenTexts) {
    fill(0, t.opacity);
    noStroke();
    textSize(t.size);
    textAlign(CENTER, TOP);
    text(t.text, t.x, t.y);
  }

  // Highlight click area
  noFill();
  stroke(255, 0, 0);
  rect(clickArea.x, clickArea.y, clickArea.w, clickArea.h);
}

function mousePressed() {
  if (
    mouseX > clickArea.x &&
    mouseX < clickArea.x + clickArea.w &&
    mouseY > clickArea.y &&
    mouseY < clickArea.y + clickArea.h
  ) {
    // Animate hidden texts
    for (let t of hiddenTexts) {
      t.opacity = 255;
      t.x += random(-20, 20);
      t.y += random(-20, 20);
    }
  }
}
