let cells = [];

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Start with a few cells
  for (let i = 0; i < 5; i++) {
    cells.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      hue: random(360),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      age: 0,
      maxAge: random(200, 400)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Update and display cells
  for (let i = cells.length - 1; i >= 0; i--) {
    let cell = cells[i];
    
    // Move the cell
    cell.x += cell.speedX;
    cell.y += cell.speedY;
    
    // Bounce off edges
    if (cell.x < 0 || cell.x > width) cell.speedX *= -1;
    if (cell.y < 0 || cell.y > height) cell.speedY *= -1;
    
    // Age the cell
    cell.age++;
    
    // Grow the cell
    cell.size += 0.05;
    
    // Split when mature
    if (cell.age > cell.maxAge && cell.size > 30) {
      splitCell(cell);
      cells.splice(i, 1); // Remove original cell
    } else {
      // Draw the cell
      fill(cell.hue, 80, 90, 0.8);
      ellipse(cell.x, cell.y, cell.size);
    }
  }
}

function splitCell(parent) {
  // Create two new cells
  for (let i = 0; i < 2; i++) {
    cells.push({
      x: parent.x,
      y: parent.y,
      size: parent.size * 0.6,
      hue: (parent.hue + random(-30, 30)) % 360,
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      age: 0,
      maxAge: parent.maxAge
    });
  }
}
