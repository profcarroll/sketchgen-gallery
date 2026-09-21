let pieces = [];
let dragging = false;
let dragIndex = -1;
let dragOffset = { x: 0, y: 0 };
let bgColor, pieceColors;

function setup() {
  createCanvas(400, 400);
  bgColor = color(20, 15, 25);
  pieceColors = [
    color(220, 210, 190),
    color(200, 190, 170),
    color(180, 170, 150),
    color(160, 150, 130),
    color(140, 130, 110),
    color(120, 110, 90),
    color(100, 90, 70)
  ];
  
  // Create floating pieces
  for (let i = 0; i < 7; i++) {
    pieces.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      w: random(40, 80),
      h: random(40, 80),
      color: pieceColors[i],
      originalColor: pieceColors[i],
      rotation: random(TWO_PI),
      isDragging: false
    });
  }
}

function draw() {
  background(bgColor);
  
  // Draw pieces
  for (let i = 0; i < pieces.length; i++) {
    push();
    translate(pieces[i].x, pieces[i].y);
    rotate(pieces[i].rotation);
    fill(pieces[i].color);
    noStroke();
    
    // Draw different shapes for each piece
    switch(i % 4) {
      case 0: // Rectangle
        rectMode(CENTER);
        rect(0, 0, pieces[i].w, pieces[i].h);
        break;
      case 1: // Triangle
        triangle(-pieces[i].w/2, pieces[i].h/2, 
                 pieces[i].w/2, pieces[i].h/2, 
                 0, -pieces[i].h/2);
        break;
      case 2: // Diamond
        rectMode(CENTER);
        rect(0, 0, pieces[i].w, pieces[i].h, 45);
        break;
      case 3: // Circle
        ellipse(0, 0, pieces[i].w, pieces[i].h);
        break;
    }
    
    pop();
  }
  
  // Simulate slight movement over time for idle motion
  if (!dragging) {
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].rotation += random(-0.001, 0.001);
    }
  }
}

function mousePressed() {
  // Check if we clicked on a piece
  for (let i = pieces.length - 1; i >= 0; i--) {
    let p = pieces[i];
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < max(p.w, p.h) / 2) {
      dragging = true;
      dragIndex = i;
      dragOffset.x = p.x - mouseX;
      dragOffset.y = p.y - mouseY;
      pieces[i].isDragging = true;
      break;
    }
  }
}

function mouseDragged() {
  if (dragging && dragIndex >= 0) {
    pieces[dragIndex].x = mouseX + dragOffset.x;
    pieces[dragIndex].y = mouseY + dragOffset.y;
    
    // Add some rotation while dragging
    pieces[dragIndex].rotation += (mouseX - pmouseX) * 0.01;
  }
}

function mouseReleased() {
  if (dragging) {
    dragging = false;
    dragIndex = -1;
    
    // Snap back to original position with slight rotation
    for (let i = 0; i < pieces.length; i++) {
      pieces[i].isDragging = false;
      if (pieces[i].rotation > TWO_PI) pieces[i].rotation -= TWO_PI;
      if (pieces[i].rotation < 0) pieces[i].rotation += TWO_PI;
    }
  }
}
