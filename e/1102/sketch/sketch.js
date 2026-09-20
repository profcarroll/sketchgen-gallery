let pieces = [];
let selectedPiece = null;
let snapDistance = 30;
let totalPieces = 12;
let img;

function preload() {
  // Load a sample image for the puzzle
  img = loadImage('https://picsum.photos/600/400');
}

function setup() {
  createCanvas(600, 400);
  noLoop();

  // Create puzzle pieces
  let pieceWidth = width / 3;
  let pieceHeight = height / 4;

  for (let i = 0; i < totalPieces; i++) {
    let row = floor(i / 3);
    let col = i % 3;
    let x = random(width - pieceWidth);
    let y = random(height - pieceHeight);

    // Create a piece with a cropped portion of the image
    let pieceImg = createGraphics(pieceWidth, pieceHeight);
    pieceImg.image(img, 0, 0, pieceWidth, pieceHeight, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);

    pieces.push({
      x: x,
      y: y,
      width: pieceWidth,
      height: pieceHeight,
      img: pieceImg,
      originalX: col * pieceWidth,
      originalY: row * pieceHeight,
      snapped: false
    });
  }
}

function draw() {
  background(240);

  // Draw all pieces
  for (let piece of pieces) {
    image(piece.img, piece.x, piece.y);
    
    // Draw border around selected piece
    if (piece === selectedPiece) {
      stroke(0);
      noFill();
      rect(piece.x, piece.y, piece.width, piece.height);
    }
  }
}

function mousePressed() {
  // Check if clicked on a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    let piece = pieces[i];
    if (mouseX > piece.x && mouseX < piece.x + piece.width &&
        mouseY > piece.y && mouseY < piece.y + piece.height) {
      selectedPiece = piece;
      break;
    }
  }
}

function mouseDragged() {
  if (selectedPiece) {
    selectedPiece.x = mouseX - selectedPiece.width / 2;
    selectedPiece.y = mouseY - selectedPiece.height / 2;

    // Check for snap
    let dx = selectedPiece.originalX - selectedPiece.x;
    let dy = selectedPiece.originalY - selectedPiece.y;
    let distance = sqrt(dx * dx + dy * dy);

    if (distance < snapDistance) {
      selectedPiece.x = selectedPiece.originalX;
      selectedPiece.y = selectedPiece.originalY;
      selectedPiece.snapped = true;
    }

    redraw();
  }
}

function mouseReleased() {
  selectedPiece = null;
}
