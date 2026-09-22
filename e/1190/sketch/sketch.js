let puzzlePieces = [];
let isDragging = false;
let draggedPiece = null;
let offsetX, offsetY;
let backgroundImage;

function preload() {
  // Load a sample background image for the puzzle
  backgroundImage = loadImage('https://picsum.photos/800/600');
}

function setup() {
  createCanvas(800, 600);
  noLoop();

  // Create puzzle pieces with random positions and shapes
  const numPieces = 12;
  for (let i = 0; i < numPieces; i++) {
    let x = random(50, width - 150);
    let y = random(50, height - 150);
    let w = random(60, 120);
    let h = random(60, 120);

    // Create a simple irregular shape (polygon)
    let points = [];
    let numPoints = 5 + floor(random(3));
    for (let j = 0; j < numPoints; j++) {
      let angle = map(j, 0, numPoints, 0, TWO_PI);
      let radius = random(w * 0.4, w * 0.6);
      points.push({
        x: x + cos(angle) * radius,
        y: y + sin(angle) * radius
      });
    }

    puzzlePieces.push({
      id: i,
      x: x,
      y: y,
      w: w,
      h: h,
      points: points,
      originalX: x,
      originalY: y,
      snapped: false,
      snapTarget: null
    });
  }

  // Set up one piece to be a "snap target" for interaction
  puzzlePieces[0].snapped = true;
  puzzlePieces[0].snapTarget = { x: width / 2, y: height / 2 };
}

function draw() {
  background(240);

  // Draw the background image
  image(backgroundImage, 0, 0, width, height);

  // Draw all pieces
  for (let piece of puzzlePieces) {
    if (!piece.snapped) {
      drawPiece(piece);
    }
  }

  // Draw snapped pieces with their visible seam
  for (let piece of puzzlePieces) {
    if (piece.snapped) {
      drawSnappedPiece(piece);
    }
  }
}

function drawPiece(piece) {
  push();
  translate(piece.x, piece.y);

  noStroke();
  fill(200, 220, 255, 180);
  beginShape();
  for (let p of piece.points) {
    vertex(p.x - piece.x, p.y - piece.y);
  }
  endShape(CLOSE);

  stroke(100, 120, 150);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of piece.points) {
    vertex(p.x - piece.x, p.y - piece.y);
  }
  endShape(CLOSE);

  pop();
}

function drawSnappedPiece(piece) {
  push();
  translate(piece.x, piece.y);

  // Draw the background image portion under the piece
  noStroke();
  fill(255);
  rect(0, 0, piece.w, piece.h);

  // Draw visible seam (gap between pieces)
  stroke(180, 200, 230);
  strokeWeight(4);
  noFill();

  beginShape();
  for (let i = 0; i < piece.points.length; i++) {
    let p = piece.points[i];
    vertex(p.x - piece.x, p.y - piece.y);
  }
  endShape(CLOSE);

  pop();
}

function mousePressed() {
  // Try to start dragging a piece
  for (let i = puzzlePieces.length - 1; i >= 0; i--) {
    let piece = puzzlePieces[i];
    if (!piece.snapped && isPointInPolygon(mouseX, mouseY, piece.points)) {
      draggedPiece = piece;
      offsetX = mouseX - piece.x;
      offsetY = mouseY - piece.y;
      isDragging = true;
      break;
    }
  }

  // Resume audio context on first interaction
  userStartAudio();
}

function mouseDragged() {
  if (isDragging && draggedPiece) {
    draggedPiece.x = mouseX - offsetX;
    draggedPiece.y = mouseY - offsetY;
    redraw();
  }
}

function mouseReleased() {
  if (isDragging && draggedPiece) {
    // Check if the piece is close enough to snap into place
    let target = puzzlePieces[0]; // Simple logic: snap to first piece
    let dx = draggedPiece.x - target.x;
    let dy = draggedPiece.y - target.y;
    let distance = sqrt(dx * dx + dy * dy);

    if (distance < 30) {
      draggedPiece.snapped = true;
      draggedPiece.x = target.x;
      draggedPiece.y = target.y;
    }

    isDragging = false;
    draggedPiece = null;
    redraw();
  }
}

function isPointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    if (((points[i].y > y) !== (points[j].y > y)) &&
        (x < (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
      inside = !inside;
    }
  }
  return inside;
}
