function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  textFont('Arial');
  
  // Initialize grid elements
  elements = [];
  const cols = 12;
  const rows = 8;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (i === 0 && j === 0) continue;
      if (i === cols - 1 && j === rows - 1) continue;
      
      const x = i * cellWidth;
      const y = j * cellHeight;
      
      elements.push({
        x: x + cellWidth/2,
        y: y + cellHeight/2,
        originalX: x + cellWidth/2,
        originalY: y + cellHeight/2,
        size: random(12, 36),
        text: (i + j) % 2 === 0 ? 'TYPE' : 'GRID',
        rotation: 0,
        phase: random(TWO_PI),
        speed: random(0.005, 0.02)
      });
    }
  }
  
  // Title elements
  titleElements = [
    { x: width/2, y: cellHeight, text: "EXHIBITION", size: 36 },
    { x: width/2, y: cellHeight * 1.5, text: "POSTER", size: 24 }
  ];
  
  // Footer elements
  footerElements = [
    { x: width/2, y: height - cellHeight, text: "SWISS STYLE", size: 14 }
  ];
}

function draw() {
  background(255);
  
  // Apply organic motion to elements
  for (let element of elements) {
    // Create flowing movement with sine wave
    const time = frameCount * element.speed;
    element.x = element.originalX + sin(time) * 30;
    element.y = element.originalY + cos(time) * 30;
    element.rotation = sin(time * 0.5) * 0.3;
    
    // Draw the element
    fill(0);
    textSize(element.size);
    push();
    translate(element.x, element.y);
    rotate(element.rotation);
    text(element.text, 0, 0);
    pop();
  }
  
  // Draw title elements
  for (let element of titleElements) {
    fill(0);
    textSize(element.size);
    text(element.text, element.x, element.y);
  }
  
  // Draw footer elements
  for (let element of footerElements) {
    fill(0);
    textSize(element.size);
    text(element.text, element.x, element.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
