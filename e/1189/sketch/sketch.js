let pieces = [];
let draggingPiece = null;
let snapDistance = 50;
let targetPositions = [];

class JigsawPiece {
  constructor(id, x, y, w, h, img) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.targetX = x;
    this.targetY = y;
    this.isSnapped = false;
  }

  display() {
    if (this.img) {
      image(this.img, this.x, this.y, this.w, this.h);
    } else {
      fill(100 + this.id * 30, 150, 200);
      noStroke();
      rect(this.x, this.y, this.w, this.h);
    }
    
    // Draw piece border
    stroke(0);
    strokeWeight(1);
    noFill();
    rect(this.x, this.y, this.w, this.h);
  }

  contains(x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
  }

  update() {
    if (!this.isSnapped) {
      // Move towards target position
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      
      if (abs(dx) > 1 || abs(dy) > 1) {
        this.x += dx * 0.1;
        this.y += dy * 0.1;
      } else {
        this.x = this.targetX;
        this.y = this.targetY;
      }
    }
  }

  snap() {
    if (!this.isSnapped) {
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      if (sqrt(dx * dx + dy * dy) < snapDistance) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isSnapped = true;
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create a simple test image for each piece
  let imgSize = 100;
  for (let i = 0; i < 9; i++) {
    let canvas = createGraphics(imgSize, imgSize);
    canvas.background(255);
    canvas.fill(100 + i * 30, 150, 200);
    canvas.noStroke();
    canvas.rect(0, 0, imgSize, imgSize);
    canvas.fill(255);
    canvas.textAlign(CENTER, CENTER);
    canvas.text(i + 1, imgSize/2, imgSize/2);
    
    let x = (i % 3) * (width / 3) + random(-20, 20);
    let y = floor(i / 3) * (height / 3) + random(-20, 20);
    pieces.push(new JigsawPiece(i, x, y, width/3, height/3, canvas));
    targetPositions.push({x: (i % 3) * (width / 3), y: floor(i / 3) * (height / 3)});
  }

  // Set initial target positions
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].targetX = targetPositions[i].x;
    pieces[i].targetY = targetPositions[i].y;
  }
}

function draw() {
  background(240);
  
  // Update and display pieces
  for (let piece of pieces) {
    piece.update();
    piece.snap();
    piece.display();
  }
}

function mousePressed() {
  // Check if any piece was clicked
  for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].contains(mouseX, mouseY)) {
      draggingPiece = pieces[i];
      break;
    }
  }
  
  redraw();
}

function mouseDragged() {
  if (draggingPiece) {
    draggingPiece.x = mouseX - draggingPiece.w / 2;
    draggingPiece.y = mouseY - draggingPiece.h / 2;
    draggingPiece.isSnapped = false;
  }
  redraw();
}

function mouseReleased() {
  draggingPiece = null;
}
