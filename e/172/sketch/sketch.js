function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(140);
  textFont('Arial');
  noLoop();
}

function draw() {
  background(255);
  fill(0);
  
  // Create a rigid, geometric composition with precise alignment
  const baseY = height / 2;
  const spacing = 160;
  const chars = "TYPOGRAPHY";
  
  // Render each character along the horizontal axis with strict spacing
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const x = width / 2 - (chars.length * spacing) / 2 + i * spacing;
    text(char, x, baseY);
  }
  
  // Add subtle variation in character widths to create visual rhythm
  const variations = [0, 0, 5, 0, 3, 0, 2];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const x = width / 2 - (chars.length * spacing) / 2 + i * spacing;
    const adjustedX = x + variations[i];
    text(char, adjustedX, baseY);
  }
}
