let pieces = [];
let pieceSize = 60;
let cols, rows;
let grabbedPiece = null;
let grabOffsetX = 0;
let grabOffsetY = 0;

function setup() {
  createCanvas(480, 480);
  cols = width / pieceSize;
  rows = height / pieceSize;

  // Create puzzle pieces
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let piece = {
        x: x * pieceSize,
        y: y * pieceSize,
        originalX: x * pieceSize,
        originalY: y * pieceSize,
        isPlaced: false,
        color: color(random(100, 255), random(100, 255), random(100, 255)),
        id: x + y * cols
      };
      pieces.push(piece);
    }
  }

  // Add some randomness to positions
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].x += random(-10, 10);
    pieces[i].y += random(-10, 10);
  }
}

function draw() {
  background(240);

  // Draw all puzzle pieces
  for (let piece of pieces) {
    push();
    translate(piece.x, piece.y);
    fill(piece.color);
    noStroke();
    rect(0, 0, pieceSize, pieceSize);
    
    // Add a border to make it look like a jigsaw piece
    stroke(0);
    strokeWeight(1);
    rect(0, 0, pieceSize, pieceSize);
    
    pop();
  }
}

function mousePressed() {
  // Try to grab a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    let piece = pieces[i];
    if (mouseX > piece.x && mouseX < piece.x + pieceSize &&
        mouseY > piece.y && mouseY < piece.y + pieceSize) {
      grabbedPiece = piece;
      grabOffsetX = piece.x - mouseX;
      grabOffsetY = piece.y - mouseY;
      return;
    }
  }
}

function mouseDragged() {
  if (grabbedPiece) {
    grabbedPiece.x = mouseX + grabOffsetX;
    grabbedPiece.y = mouseY + grabOffsetY;
  }
}

function mouseReleased() {
  grabbedPiece = null;
}
