let pieces = [];
let selectedPiece = null;
let offsetX, offsetY;
let gridWidth = 4;
let gridHeight = 4;
let pieceSize;
let img;

function preload() {
  img = loadImage('https://picsum.photos/400/400');
}

function setup() {
  createCanvas(400, 400);
  pieceSize = width / gridWidth;

  // Create puzzle pieces
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let piece = {
        x: x * pieceSize,
        y: y * pieceSize,
        originalX: x * pieceSize,
        originalY: y * pieceSize,
        snapped: false,
        img: createGraphics(pieceSize, pieceSize),
        id: y * gridWidth + x
      };

      // Draw a fragment of the image onto the piece's graphics
      piece.img.image(img, 0, 0, pieceSize, pieceSize, x * pieceSize, y * pieceSize, pieceSize, pieceSize);
      pieces.push(piece);
    }
  }
}

function draw() {
  background(240);

  // Draw all pieces
  for (let piece of pieces) {
    image(piece.img, piece.x, piece.y);
    
    // Draw a border around selected piece
    if (piece === selectedPiece) {
      stroke(0, 100, 255);
      noFill();
      rect(piece.x, piece.y, pieceSize, pieceSize);
    }
  }

  // Snap pieces to grid when released
  if (selectedPiece && !mouseIsPressed) {
    let snapX = round(selectedPiece.x / pieceSize) * pieceSize;
    let snapY = round(selectedPiece.y / pieceSize) * pieceSize;

    // Only snap if the piece is close enough to a grid line
    if (abs(selectedPiece.x - snapX) < 20 && abs(selectedPiece.y - snapY) < 20) {
      selectedPiece.x = snapX;
      selectedPiece.y = snapY;
      selectedPiece.snapped = true;
    } else {
      selectedPiece.snapped = false;
    }
    selectedPiece = null;
  }
}

function mousePressed() {
  // Check if clicked on a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    let piece = pieces[i];
    if (mouseX > piece.x && mouseX < piece.x + pieceSize &&
        mouseY > piece.y && mouseY < piece.y + pieceSize) {
      selectedPiece = piece;
      offsetX = mouseX - piece.x;
      offsetY = mouseY - piece.y;
      break;
    }
  }
}

function mouseDragged() {
  if (selectedPiece) {
    selectedPiece.x = mouseX - offsetX;
    selectedPiece.y = mouseY - offsetY;
  }
}
