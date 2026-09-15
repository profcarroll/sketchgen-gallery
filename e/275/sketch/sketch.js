function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(300);
  textAlign(CENTER, CENTER);
  textFont('Arial');
}

function draw() {
  background(255);
  
  // Create a grid of letterforms
  const spacing = 120;
  const offsetX = (width - 4 * spacing) / 2;
  const offsetY = (height - 4 * spacing) / 2;
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      // Calculate drift based on time and position
      const drift = sin(frameCount * 0.01 + i * 0.5) * 10;
      const x = offsetX + i * spacing + drift;
      const y = offsetY + j * spacing + sin(frameCount * 0.02 + j * 0.3) * 8;
      
      // Draw letterforms with slight variation
      fill(0);
      noStroke();
      text('A', x, y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
