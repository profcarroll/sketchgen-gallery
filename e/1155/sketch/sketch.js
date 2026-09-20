let pieces = [];
let selectedPiece = null;
let isDragging = false;
let offsetX, offsetY;
let glowIntensity = 0;
let completed = false;

class PuzzlePiece {
  constructor(x, y, w, h, shapeType) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.shapeType = shapeType;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.connections = [];
    this.isPlaced = false;
    this.targetX = x;
    this.targetY = y;
    this.snapThreshold = 30;
  }

  draw() {
    push();
    translate(this.x, this.y);
    
    // Draw piece with slight glow when selected or connected
    if (this === selectedPiece || this.connections.length > 0) {
      fill(red(this.color), green(this.color), blue(this.color), 150);
      noStroke();
      ellipse(0, 0, this.w + 10, this.h + 10);
    }
    
    fill(this.color);
    stroke(0);
    strokeWeight(1);
    
    switch (this.shapeType) {
      case 'rect':
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        break;
      case 'circle':
        ellipse(0, 0, this.w, this.h);
        break;
      case 'triangle':
        triangle(-this.w/2, this.h/2, this.w/2, this.h/2, 0, -this.h/2);
        break;
    }
    
    pop();
  }

  contains(mx, my) {
    return dist(mx, my, this.x, this.y) < max(this.w, this.h) / 2;
  }

  connectTo(otherPiece) {
    if (!this.connections.includes(otherPiece)) {
      this.connections.push(otherPiece);
    }
    if (!otherPiece.connections.includes(this)) {
      otherPiece.connections.push(this);
    }
  }

  isNear(targetX, targetY) {
    return dist(this.x, this.y, targetX, targetY) < this.snapThreshold;
  }

  update() {
    // Animate to target position
    if (!this.isPlaced) {
      this.x += (this.targetX - this.x) * 0.1;
      this.y += (this.targetY - this.y) * 0.1;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create puzzle pieces
  for (let i = 0; i < 20; i++) {
    let x = random(50, width - 150);
    let y = random(50, height - 150);
    let w = random(40, 80);
    let h = random(40, 80);
    let shapeTypes = ['rect', 'circle', 'triangle'];
    let shapeType = random(shapeTypes);
    
    pieces.push(new PuzzlePiece(x, y, w, h, shapeType));
  }

  // Create connections between some pieces
  for (let i = 0; i < pieces.length - 1; i++) {
    if (random() > 0.7) {
      let j = floor(random(i + 1, pieces.length));
      pieces[i].connectTo(pieces[j]);
    }
  }

  // Set some pieces to be placed
  for (let i = 0; i < 5; i++) {
    let piece = random(pieces);
    piece.isPlaced = true;
    piece.targetX = piece.x;
    piece.targetY = piece.y;
  }

  // Set up glow effect
  glowIntensity = 0;
}

function draw() {
  background(240);
  
  // Update and draw pieces
  for (let piece of pieces) {
    piece.update();
    piece.draw();
  }
  
  // Draw connections
  stroke(100, 150, 255);
  strokeWeight(2);
  noFill();
  
  for (let piece of pieces) {
    for (let connectedPiece of piece.connections) {
      line(piece.x, piece.y, connectedPiece.x, connectedPiece.y);
    }
  }
  
  // Draw glow effect
  if (glowIntensity > 0) {
    drawingContext.shadowBlur = glowIntensity;
    drawingContext.shadowColor = color(255, 255, 255, 100);
  } else {
    drawingContext.shadowBlur = 0;
  }
}

function mousePressed() {
  // Check if we clicked on a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].contains(mouseX, mouseY)) {
      selectedPiece = pieces[i];
      isDragging = true;
      offsetX = mouseX - selectedPiece.x;
      offsetY = mouseY - selectedPiece.y;
      break;
    }
  }
  
  // Start animation
  loop();
  redraw();
}

function mouseDragged() {
  if (isDragging && selectedPiece) {
    selectedPiece.x = mouseX - offsetX;
    selectedPiece.y = mouseY - offsetY;
    
    // Check for snapping to nearby pieces
    let snapTarget = null;
    let minDist = Infinity;
    
    for (let piece of pieces) {
      if (piece !== selectedPiece && !piece.isPlaced) {
        let dist = dist(selectedPiece.x, selectedPiece.y, piece.x, piece.y);
        if (dist < 50 && dist < minDist) {
          minDist = dist;
          snapTarget = piece;
        }
      }
    }
    
    // Snap to target if close enough
    if (snapTarget && minDist < 30) {
      selectedPiece.x = snapTarget.x;
      selectedPiece.y = snapTarget.y;
      selectedPiece.isPlaced = true;
      
      // Connect pieces
      selectedPiece.connectTo(snapTarget);
      
      // Increase glow intensity slightly
      glowIntensity = 10;
    }
    
    redraw();
  }
}

function mouseReleased() {
  isDragging = false;
  selectedPiece = null;
  
  // Reset glow
  glowIntensity = 0;
  
  // Check if puzzle is complete
  let placedCount = pieces.filter(p => p.isPlaced).length;
  if (placedCount === pieces.length) {
    completed = true;
    glowIntensity = 20; // Full glow when complete
  }
  
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
