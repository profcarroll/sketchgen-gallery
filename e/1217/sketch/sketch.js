let pattern;
let tileSize = 40;
let rows, cols;
let colors;

function setup() {
  createCanvas(600, 600);
  noLoop();
  
  // Define jewel tones
  colors = [
    color(139, 0, 0),     // Dark red
    color(0, 100, 0),     // Dark green
    color(0, 0, 139),     // Dark blue
    color(128, 0, 128),   // Purple
    color(255, 140, 0),   // Dark orange
    color(75, 0, 130),    // Indigo
    color(255, 20, 147),  // Deep pink
    color(0, 139, 139),   // Dark cyan
    color(160, 82, 45),   // Sienna
    color(0, 0, 0)        // Black
  ];
  
  rows = height / tileSize;
  cols = width / tileSize;
  
  pattern = createGraphics(width, height);
  pattern.noStroke();
  
  // Draw the main field with floral motifs
  drawField(pattern);
  
  // Draw the border
  drawBorder(pattern);
}

function draw() {
  background(240);
  image(pattern, 0, 0);
}

function drawField(g) {
  g.push();
  g.translate(tileSize/2, tileSize/2);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      g.push();
      g.translate(x * tileSize, y * tileSize);
      
      // Draw a stylized floral motif
      let c = random(colors);
      g.fill(c);
      
      // Center circle
      g.ellipse(0, 0, tileSize/3, tileSize/3);
      
      // Petals (4 petals)
      for (let i = 0; i < 4; i++) {
        g.push();
        g.rotate(TWO_PI * i / 4);
        g.ellipse(tileSize/4, 0, tileSize/6, tileSize/3);
        g.pop();
      }
      
      // Inner circle
      g.fill(255);
      g.ellipse(0, 0, tileSize/6, tileSize/6);
      
      g.pop();
    }
  }
  
  g.pop();
}

function drawBorder(g) {
  g.push();
  g.strokeWeight(4);
  g.noFill();
  
  // Draw a continuous chain of chevrons and triangles
  let borderSize = 20;
  
  // Top border
  for (let x = 0; x < width; x += borderSize * 2) {
    g.push();
    g.translate(x, 0);
    g.stroke(random(colors));
    g.triangle(0, 0, borderSize, borderSize, 0, borderSize);
    g.pop();
    
    g.push();
    g.translate(x + borderSize, 0);
    g.stroke(random(colors));
    g.triangle(borderSize, 0, 0, borderSize, borderSize, borderSize);
    g.pop();
  }
  
  // Bottom border
  for (let x = 0; x < width; x += borderSize * 2) {
    g.push();
    g.translate(x, height - borderSize);
    g.stroke(random(colors));
    g.triangle(0, 0, borderSize, -borderSize, 0, -borderSize);
    g.pop();
    
    g.push();
    g.translate(x + borderSize, height - borderSize);
    g.stroke(random(random(colors)));
    g.triangle(borderSize, 0, 0, -borderSize, borderSize, -borderSize);
    g.pop();
  }
  
  // Left border
  for (let y = 0; y < height; y += borderSize * 2) {
    g.push();
    g.translate(0, y);
    g.stroke(random(colors));
    g.triangle(0, 0, borderSize, 0, borderSize, borderSize);
    g.pop();
    
    g.push();
    g.translate(0, y + borderSize);
    g.stroke(random(colors));
    g.triangle(0, borderSize, borderSize, borderSize, borderSize, 0);
    g.pop();
  }
  
  // Right border
  for (let y = 0; y < height; y += borderSize * 2) {
    g.push();
    g.translate(width - borderSize, y);
    g.stroke(random(colors));
    g.triangle(0, 0, -borderSize, 0, -borderSize, borderSize);
    g.pop();
    
    g.push();
    g.translate(width - borderSize, y + borderSize);
    g.stroke(random(colors));
    g.triangle(0, borderSize, -borderSize, borderSize, -borderSize, 0);
    g.pop();
  }
  
  g.pop();
}
