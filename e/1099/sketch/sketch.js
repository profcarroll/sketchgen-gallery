let pieces = [];
let canvas;
let bgCol;
let puzzleImage;
let draggingPiece = null;
let snapDistance = 50;

function preload() {
  // Load a sample image for the puzzle
  puzzleImage = loadImage('https://picsum.photos/800/600');
}

function setup() {
  canvas = createCanvas(800, 600);
  bgCol = color(40, 40, 60);
  generatePuzzle();
}

function generatePuzzle() {
  const pieceCount = 12;
  const imgW = puzzleImage.width;
  const imgH = puzzleImage.height;

  for (let i = 0; i < pieceCount; i++) {
    const x = random(0, width - 100);
    const y = random(0, height - 100);
    const w = random(80, 120);
    const h = random(80, 120);

    // Create a piece with a fragment of the image
    const piece = {
      x: x,
      y: y,
      w: w,
      h: h,
      imgX: map(i % 4, 0, 3, 0, imgW),
      imgY: map(floor(i / 4), 0, 2, 0, imgH),
      targetX: x + random(-50, 50),
      targetY: y + random(-50, 50),
      snapped: false,
      color: color(random(100, 255), random(100, 255), random(100, 255))
    };

    pieces.push(piece);
  }
}

function draw() {
  background(bgCol);

  // Draw each puzzle piece
  for (let piece of pieces) {
    push();
    translate(piece.x, piece.y);
    fill(piece.color);
    noStroke();

    // Draw the puzzle piece as a simple rectangle with an image fragment
    rect(0, 0, piece.w, piece.h);

    // Draw a fragment of the original image
    const imgPiece = puzzleImage.get(piece.imgX, piece.imgY, piece.w, piece.h);
    image(imgPiece, 0, 0, piece.w, piece.h);

    pop();
  }

  // Check for snapping
  if (draggingPiece) {
    let closestPiece = null;
    let minDist = Infinity;

    for (let piece of pieces) {
      if (piece === draggingPiece || piece.snapped) continue;

      let d = dist(piece.x, piece.y, piece.targetX, piece.targetY);
      if (d < minDist) {
        minDist = d;
        closestPiece = piece;
      }
    }

    if (closestPiece && minDist < snapDistance) {
      draggingPiece.snapped = true;
      draggingPiece.x = closestPiece.targetX;
      draggingPiece.y = closestPiece.targetY;
    }
  }
}

function mousePressed() {
  for (let i = pieces.length - 1; i >= 0; i--) {
    let piece = pieces[i];
    if (mouseX > piece.x && mouseX < piece.x + piece.w &&
        mouseY > piece.y && mouseY < piece.y + piece.h) {
      draggingPiece = piece;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingPiece) {
    draggingPiece.x = mouseX - draggingPiece.w / 2;
    draggingPiece.y = mouseY - draggingPiece.h / 2;
  }
}

function mouseReleased() {
  draggingPiece = null;
}
