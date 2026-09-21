let pieces = [];
let isDragging = false;
let draggedPiece = null;
let snapDistance = 50;
let targetImage;

function setup() {
  createCanvas(800, 600);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create polygonal pieces
  for (let i = 0; i < 12; i++) {
    let x = random(width);
    let y = random(height);
    let sides = floor(random(3, 8));
    let radius = random(30, 70);
    let angle = random(TWO_PI);
    let piece = {
      x: x,
      y: y,
      sides: sides,
      radius: radius,
      angle: angle,
      rotation: random(TWO_PI),
      color: color(random(360), 80, 90),
      targetX: x,
      targetY: y,
      targetAngle: angle,
      isSnapped: false,
      velocity: { x: random(-1, 1), y: random(-1, 1) }
    };
    pieces.push(piece);
  }

  // Draw a background image
  targetImage = createGraphics(width, height);
  targetImage.background(200);
  targetImage.fill(0, 50);
  targetImage.noStroke();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(10, 30);
    targetImage.ellipse(x, y, s, s);
  }
}

function draw() {
  background(220);

  // Draw the hidden image
  image(targetImage, 0, 0);

  // Update and draw pieces
  for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i];
    
    if (!piece.isSnapped) {
      // Gentle wandering motion
      piece.x += piece.velocity.x;
      piece.y += piece.velocity.y;

      // Keep pieces within canvas bounds
      if (piece.x < 0 || piece.x > width) piece.velocity.x *= -1;
      if (piece.y < 0 || piece.y > height) piece.velocity.y *= -1;

      // Slow down over time
      piece.velocity.x *= 0.99;
      piece.velocity.y *= 0.99;
    }

    // Draw the polygonal piece
    push();
    translate(piece.x, piece.y);
    rotate(piece.rotation);

    fill(piece.color);
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / piece.sides) {
      let px = cos(a + piece.angle) * piece.radius;
      let py = sin(a + piece.angle) * piece.radius;
      vertex(px, py);
    }
    endShape(CLOSE);

    pop();
  }

  // Check for snapping
  if (!isDragging && !mouseIsPressed) {
    for (let i = 0; i < pieces.length; i++) {
      let piece = pieces[i];
      if (!piece.isSnapped) {
        for (let j = 0; j < pieces.length; j++) {
          if (i !== j) {
            let other = pieces[j];
            if (!other.isSnapped) {
              let d = dist(piece.x, piece.y, other.x, other.y);
              if (d < snapDistance) {
                // Snap to the other piece
                piece.targetX = other.x;
                piece.targetY = other.y;
                piece.isSnapped = true;
              }
            }
          }
        }
      }
    }
  }

  // Animate snapping
  for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i];
    if (!piece.isSnapped) {
      piece.x += (piece.targetX - piece.x) * 0.05;
      piece.y += (piece.targetY - piece.y) * 0.05;
    }
  }
}

function mousePressed() {
  // Try to drag a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    let piece = pieces[i];
    let d = dist(mouseX, mouseY, piece.x, piece.y);
    if (d < piece.radius) {
      isDragging = true;
      draggedPiece = piece;
      return;
    }
  }

  // If no piece was clicked, start audio
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }
}

function mouseDragged() {
  if (draggedPiece && isDragging) {
    draggedPiece.x = mouseX;
    draggedPiece.y = mouseY;
    draggedPiece.isSnapped = false;
  }
}

function mouseReleased() {
  isDragging = false;
  draggedPiece = null;
}
