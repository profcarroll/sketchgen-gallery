let pieces = [];
let selectedPiece = null;
let offsetX, offsetY;
let puzzleImage;

function preload() {
  // Load a placeholder image for the puzzle
  puzzleImage = loadImage('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%233498db"/><circle cx="150" cy="100" r="50" fill="%23e74c3c"/><rect x="300" y="150" width="100" height="100" fill="%23f1c40f"/></svg>');
}

function setup() {
  createCanvas(600, 400);
  noLoop(); // Start with noLoop and enable it after initial setup

  const numPieces = 9;
  const pieceWidth = width / 3;
  const pieceHeight = height / 3;

  for (let i = 0; i < numPieces; i++) {
    const row = floor(i / 3);
    const col = i % 3;
    
    // Create a piece with a fragment of the image
    const x = col * pieceWidth;
    const y = row * pieceHeight;

    pieces.push({
      id: i,
      x: x + random(-20, 20),
      y: y + random(-20, 20),
      width: pieceWidth,
      height: pieceHeight,
      originalX: x,
      originalY: y,
      isSnapped: false,
      dragOffsetX: 0,
      dragOffsetY: 0
    });
  }

  // Draw initial state once
  redraw();
}

function draw() {
  background(240);

  // Draw the puzzle pieces
  for (let piece of pieces) {
    if (piece.isSnapped) {
      fill(255);
      stroke(100);
    } else {
      fill(255, 200);
      stroke(150);
    }

    rect(piece.x, piece.y, piece.width, piece.height);

    // Draw a simple image fragment inside each piece
    noStroke();
    fill(100, 100, 200, 150);
    ellipse(piece.x + piece.width/2, piece.y + piece.height/2, piece.width/3, piece.height/3);

    // Draw a small circle to simulate a snap point
    if (piece.isSnapped) {
      fill(0, 200, 0);
      ellipse(piece.x + piece.width/2, piece.y + piece.height/2, 10, 10);
    }
  }

  // Draw grid lines for reference
  stroke(200);
  for (let i = 1; i < 3; i++) {
    line(i * width / 3, 0, i * width / 3, height);
    line(0, i * height / 3, width, i * height / 3);
  }
}

function mousePressed() {
  for (let i = pieces.length - 1; i >= 0; i--) {
    let piece = pieces[i];
    if (mouseX > piece.x && mouseX < piece.x + piece.width &&
        mouseY > piece.y && mouseY < piece.y + piece.height) {
      selectedPiece = piece;
      piece.dragOffsetX = piece.x - mouseX;
      piece.dragOffsetY = piece.y - mouseY;
      return;
    }
  }
}

function mouseDragged() {
  if (selectedPiece) {
    selectedPiece.x = mouseX + selectedPiece.dragOffsetX;
    selectedPiece.y = mouseY + selectedPiece.dragOffsetY;
    redraw();
  }
}

function mouseReleased() {
  if (selectedPiece) {
    // Snap to grid
    const gridSize = width / 3;
    const col = floor(selectedPiece.x / gridSize);
    const row = floor(selectedPiece.y / gridSize);

    const targetX = col * gridSize;
    const targetY = row * gridSize;

    // Calculate distance from original position
    const dx = selectedPiece.originalX - targetX;
    const dy = selectedPiece.originalY - targetY;

    // If close enough, snap into place
    if (abs(dx) < 30 && abs(dy) < 30) {
      selectedPiece.x = targetX;
      selectedPiece.y = targetY;
      selectedPiece.isSnapped = true;
    }

    selectedPiece = null;
    redraw();
  }
}
