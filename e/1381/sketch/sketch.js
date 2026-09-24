let sauceClusters = [];
let macaroniPieces = [];
let dragForce = { x: 0, y: 0 };
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create sauce clusters
  for (let i = 0; i < 20; i++) {
    sauceClusters.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      wobble: random(TWO_PI),
      wobbleSpeed: random(0.01, 0.03)
    });
  }

  // Create macaroni pieces
  for (let i = 0; i < 50; i++) {
    macaroniPieces.push({
      x: random(width),
      y: random(height),
      size: random(20, 40),
      angle: random(TWO_PI),
      wobble: random(TWO_PI),
      wobbleSpeed: random(0.02, 0.05),
      stiffness: random(0.1, 0.3)
    });
  }
}

function draw() {
  background(240);

  // Update and display sauce clusters
  for (let cluster of sauceClusters) {
    cluster.wobble += cluster.wobbleSpeed;
    let wobbleOffset = sin(cluster.wobble) * 3;

    fill(255, 200, 100);
    ellipse(cluster.x + wobbleOffset, cluster.y + wobbleOffset, cluster.size);

    // Add a subtle glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 200, 100, 100);
    ellipse(cluster.x + wobbleOffset, cluster.y + wobbleOffset, cluster.size);
    drawingContext.shadowBlur = 0;
  }

  // Update and display macaroni pieces
  for (let piece of macaroniPieces) {
    piece.wobble += piece.wobbleSpeed;
    
    // Apply drag force if active
    if (isDragging) {
      let dx = piece.x - mouseX;
      let dy = piece.y - mouseY;
      let distance = dist(piece.x, piece.y, mouseX, mouseY);
      
      if (distance < 150) {
        let force = map(distance, 0, 150, 1, 0);
        piece.x += dragForce.x * force * piece.stiffness;
        piece.y += dragForce.y * force * piece.stiffness;
      }
    }

    // Apply wobble to position and angle
    let wobbleOffset = sin(piece.wobble) * 5;
    let wobbleAngle = sin(piece.wobble) * 0.1;

    push();
    translate(piece.x + wobbleOffset, piece.y + wobbleOffset);
    rotate(piece.angle + wobbleAngle);

    // Draw macaroni shape
    fill(255, 230, 150);
    noStroke();
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 9, 0, TWO_PI);
      let x = cos(angle) * piece.size;
      let y = sin(angle) * piece.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Add a subtle highlight
    fill(255, 240, 180);
    ellipse(piece.size * 0.3, -piece.size * 0.2, piece.size * 0.4);
    pop();
  }

  // Update drag force for next frame
  if (isDragging) {
    dragForce.x = mouseX - lastMouseX;
    dragForce.y = mouseY - lastMouseY;
  } else {
    dragForce.x *= 0.9;
    dragForce.y *= 0.9;
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
