let pieces = [];
let grabbedPiece = null;
let offsetX, offsetY;
let puzzleImage;

function preload() {
  // Load a sample image to use as puzzle background
  puzzleImage = loadImage('https://picsum.photos/800/600');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create puzzle pieces with random shapes and positions
  const numPieces = 12;
  for (let i = 0; i < numPieces; i++) {
    const w = random(80, 150);
    const h = random(80, 150);
    const x = random(width - w);
    const y = random(height - h);
    pieces.push({
      id: i,
      x,
      y,
      w,
      h,
      originalX: x,
      originalY: y,
      shape: createRandomShape(w, h),
      imageSlice: null,
      isLocked: false
    });
  }

  // Slice the puzzle image into pieces
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    piece.imageSlice = createGraphics(piece.w, piece.h);
    piece.imageSlice.image(puzzleImage, -piece.x, -piece.y, width, height);
  }
}

function draw() {
  background(240);

  // Draw all puzzle pieces
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    push();
    translate(piece.x, piece.y);
    if (piece.isLocked) {
      fill(255);
      stroke(100);
    } else {
      fill(255, 200);
      stroke(0);
    }
    beginShape();
    for (let j = 0; j < piece.shape.length; j++) {
      const v = piece.shape[j];
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    image(piece.imageSlice, 0, 0);
    pop();
  }

  // Draw connections between adjacent pieces
  stroke(150);
  strokeWeight(1);
  noFill();
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (piece.isLocked) {
      for (let j = i + 1; j < pieces.length; j++) {
        const other = pieces[j];
        if (other.isLocked && isAdjacent(piece, other)) {
          line(piece.x + piece.w/2, piece.y + piece.h/2,
               other.x + other.w/2, other.y + other.h/2);
        }
      }
    }
  }
}

function mousePressed() {
  // Check if we clicked on a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    const piece = pieces[i];
    if (!piece.isLocked && isPointInShape(mouseX, mouseY, piece.shape, piece.x, piece.y)) {
      grabbedPiece = piece;
      offsetX = mouseX - piece.x;
      offsetY = mouseY - piece.y;
      return true;
    }
  }
  return false;
}

function mouseDragged() {
  if (grabbedPiece) {
    grabbedPiece.x = mouseX - offsetX;
    grabbedPiece.y = mouseY - offsetY;
    redraw();
  }
}

function mouseReleased() {
  if (grabbedPiece) {
    // Try to snap the piece into place
    let closestPiece = null;
    let minDistance = Infinity;

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (piece !== grabbedPiece && piece.isLocked) {
        const distance = dist(
          grabbedPiece.x + grabbedPiece.w/2,
          grabbedPiece.y + grabbedPiece.h/2,
          piece.x + piece.w/2,
          piece.y + piece.h/2
        );
        if (distance < minDistance && distance < 100) {
          minDistance = distance;
          closestPiece = piece;
        }
      }
    }

    // If we found a close piece, try to snap
    if (closestPiece && minDistance < 50) {
      const dx = closestPiece.x - grabbedPiece.x;
      const dy = closestPiece.y - grabbedPiece.y;
      grabbedPiece.x += dx;
      grabbedPiece.y += dy;
      grabbedPiece.isLocked = true;
    }

    grabbedPiece = null;
    redraw();
  }
}

function createRandomShape(w, h) {
  const points = [];
  const numPoints = floor(random(4, 8));
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: random(w),
      y: random(h)
    });
  }
  return points;
}

function isPointInShape(px, py, shape, offsetX, offsetY) {
  const x = px - offsetX;
  const y = py - offsetY;

  let inside = false;
  for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
    if (((shape[i].y > y) !== (shape[j].y > y)) &&
        (x < (shape[j].x - shape[i].x) * (y - shape[i].y) / (shape[j].y - shape[i].y) + shape[i].x)) {
      inside = !inside;
    }
  }
  return inside;
}

function isAdjacent(piece1, piece2) {
  const dx = abs((piece1.x + piece1.w/2) - (piece2.x + piece2.w/2));
  const dy = abs((piece1.y + piece1.h/2) - (piece2.y + piece2.h/2));
  return dx < piece1.w && dy < piece1.h;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
