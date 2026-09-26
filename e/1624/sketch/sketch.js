let pieces = [];
const boardSize = 8;
const squareSize = 60;
const gridSize = boardSize * squareSize;
let time = 0;

class Piece {
  constructor() {
    this.reset();
    this.size = squareSize * 0.7;
    this.speed = random(0.002, 0.008);
    this.angle = random(TWO_PI);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  reset() {
    this.x = random(gridSize);
    this.y = random(gridSize);
    this.targetX = random(gridSize);
    this.targetY = random(gridSize);
    this.transition = 0;
  }

  update() {
    time += this.speed;
    this.transition += 0.01;
    
    // Smoothly transition between targets
    if (this.transition >= 1) {
      this.reset();
    }
    
    const t = easeInOut(this.transition);
    this.x = lerp(this.x, this.targetX, t);
    this.y = lerp(this.y, this.targetY, t);
    
    // Add some gentle floating motion
    this.x += sin(time * 0.5 + this.angle) * 0.8;
    this.y += cos(time * 0.3 + this.angle) * 0.8;
    
    // Keep within bounds
    this.x = constrain(this.x, 0, gridSize - this.size);
    this.y = constrain(this.y, 0, gridSize - this.size);
  }

  display() {
    push();
    translate(this.x + this.size/2, this.y + this.size/2);
    rotate(time * 0.3);
    
    fill(this.color);
    noStroke();
    
    // Draw a simple chess piece shape (king-like)
    ellipse(0, 0, this.size * 0.8, this.size * 0.8);
    ellipse(0, -this.size/4, this.size * 0.3, this.size * 0.3);
    
    pop();
  }
}

function setup() {
  createCanvas(gridSize, gridSize);
  
  // Create pieces
  for (let i = 0; i < 40; i++) {
    pieces.push(new Piece());
  }
}

function draw() {
  background(240);
  
  // Draw chessboard pattern
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if ((x + y) % 2 === 0) {
        fill(200, 220, 255);
      } else {
        fill(100, 140, 200);
      }
      rect(x * squareSize, y * squareSize, squareSize, squareSize);
    }
  }
  
  // Update and display pieces
  for (let piece of pieces) {
    piece.update();
    piece.display();
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
