function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(120);
  textFont('Helvetica');
  noLoop();
}

function draw() {
  background(255);
  fill(0);
  
  // Create a grid of letterforms with precise positioning
  const letters = 'SWISS';
  const spacing = width / (letters.length + 1);
  const baseline = height / 2;
  
  // Draw each letter with careful alignment and overlap
  for (let i = 0; i < letters.length; i++) {
    const x = spacing * (i + 1);
    
    // Main letterform
    text(letters[i], x, baseline);
    
    // Overlapping elements for visual tension
    if (i > 0) {
      // Slight overlap with previous letter
      fill(255);
      text(letters[i-1], x - 20, baseline);
    }
    
    // Structural connection lines
    if (i < letters.length - 1) {
      stroke(0);
      strokeWeight(2);
      line(x + 30, baseline - 40, x + 80, baseline + 40);
    }
  }
  
  // Add geometric framing elements
  noStroke();
  fill(0);
  rect(0, 0, width, 10); // Top bar
  rect(0, height - 10, width, 10); // Bottom bar
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
