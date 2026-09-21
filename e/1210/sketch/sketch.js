let puzzlePieces = [];
let loosePieces = [];
let draggedPiece = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a landscape scene with jigsaw pieces
  const numPieces = 120;
  const pieceSize = 80;
  
  for (let i = 0; i < numPieces; i++) {
    let x, y;
    let connected = false;
    
    // Place most pieces in a grid pattern
    if (i < numPieces * 0.8) {
      x = (i % 12) * pieceSize + random(-5, 5);
      y = floor(i / 12) * pieceSize + random(-5, 5);
      
      // Occasionally make some pieces loose
      if (random() < 0.3) {
        connected = false;
        loosePieces.push(i);
      } else {
        connected = true;
      }
    } else {
      // Place remaining pieces randomly at edges
      x = random(width * 0.1, width * 0.9);
      y = random(height * 0.1, height * 0.9);
      connected = false;
      loosePieces.push(i);
    }
    
    puzzlePieces.push({
      id: i,
      x: x,
      y: y,
      size: pieceSize,
      connected: connected,
      originalX: x,
      originalY: y
    });
  }
}

function draw() {
  background(180, 200, 220); // Sky blue background
  
  // Draw the landscape scene (simplified with rectangles and shapes)
  fill(34, 139, 34); // Green for grass
  rect(0, height * 0.7, width, height * 0.3);
  
  fill(101, 67, 33); // Brown for dirt path
  rect(width * 0.2, height * 0.75, width * 0.6, 20);
  
  // Draw some trees
  fill(139, 69, 19); // Brown for tree trunks
  for (let i = 0; i < 8; i++) {
    rect(width * 0.1 + i * 0.1 * width, height * 0.65, 10, 30);
  }
  
  fill(0, 100, 0); // Green for tree tops
  for (let i = 0; i < 8; i++) {
    ellipse(width * 0.1 + i * 0.1 * width + 5, height * 0.6, 30, 30);
  }
  
  // Draw puzzle pieces
  for (let piece of puzzlePieces) {
    stroke(0);
    strokeWeight(1);
    
    if (piece.connected) {
      fill(240, 240, 240);
    } else {
      fill(255, 255, 200);
    }
    
    // Draw jigsaw piece shape
    rect(piece.x, piece.y, piece.size, piece.size);
    
    // Add some details to show interlocking
    if (piece.connected) {
      noFill();
      stroke(100);
      strokeWeight(2);
      rect(piece.x + 5, piece.y + 5, piece.size - 10, piece.size - 10);
      
      // Draw interlocking tabs
      fill(200);
      rect(piece.x + 20, piece.y - 3, 10, 6);
      rect(piece.x + 40, piece.y - 3, 10, 6);
      rect(piece.x - 3, piece.y + 20, 6, 10);
      rect(piece.x - 3, piece.y + 40, 6, 10);
    }
  }
}

function mousePressed() {
  // Check if we clicked on a loose piece
  for (let i = puzzlePieces.length - 1; i >= 0; i--) {
    let piece = puzzlePieces[i];
    
    if (!piece.connected && 
        mouseX > piece.x && 
        mouseX < piece.x + piece.size &&
        mouseY > piece.y && 
        mouseY < piece.y + piece.size) {
      
      draggedPiece = piece;
      dragOffsetX = piece.x - mouseX;
      dragOffsetY = piece.y - mouseY;
      return false; // Prevent default behavior
    }
  }
}

function mouseDragged() {
  if (draggedPiece) {
    draggedPiece.x = mouseX + dragOffsetX;
    draggedPiece.y = mouseY + dragOffsetY;
    
    // Ensure the piece stays within canvas bounds
    draggedPiece.x = constrain(draggedPiece.x, 0, width - draggedPiece.size);
    draggedPiece.y = constrain(draggedPiece.y, 0, height - draggedPiece.size);
  }
}

function mouseReleased() {
  draggedPiece = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
