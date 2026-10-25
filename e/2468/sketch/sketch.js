function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(245);
  
  // Draw layered geological strata with crystalline veins
  drawGeologicalStrata();
}

function drawGeologicalStrata() {
  const layerCount = 12;
  const layerHeight = height / layerCount;
  
  // Earthen tones for geological layers
  const layerColors = [
    [139, 69, 19],   // Brown
    [101, 67, 33],   // Darker brown
    [128, 128, 128], // Gray
    [75, 0, 130],    // Indigo
    [0, 100, 0],     // Dark green
    [160, 82, 45],   // Sienna
    [139, 0, 0],     // Dark red
    [128, 0, 128],   // Purple
    [255, 215, 0],   // Gold
    [70, 130, 180],  // Steel blue
    [0, 0, 139],     // Dark blue
    [139, 69, 19]    // Brown
  ];
  
  for (let layer = 0; layer < layerCount; layer++) {
    const y = layer * layerHeight;
    
    // Draw base layer with slight variation
    fill(layerColors[layer % layerColors.length][0],
         layerColors[layer % layerColors.length][1],
         layerColors[layer % layerColors.length][2]);
    
    noStroke();
    rect(0, y, width, layerHeight);
    
    // Add crystalline vein patterns
    if (random() > 0.6) {
      const veinCount = floor(random(3, 8));
      for (let v = 0; v < veinCount; v++) {
        const x = random(width);
        const w = random(5, 25);
        const h = random(layerHeight * 0.2, layerHeight * 0.6);
        
        // Create jagged vein shape
        beginShape();
        vertex(x, y + random(h * 0.3, h * 0.7));
        for (let i = 0; i < 5; i++) {
          const offsetX = random(-w * 0.5, w * 0.5);
          const offsetY = random(-h * 0.2, h * 0.2);
          vertex(x + offsetX, y + random(h * 0.3, h * 0.7) + offsetY);
        }
        vertex(x + w, y + random(h * 0.3, h * 0.7));
        endShape(CLOSE);
        
        // Darken vein area slightly
        fill(layerColors[layer % layerColors.length][0] - 20,
             layerColors[layer % layerColors.length][1] - 20,
             layerColors[layer % layerColors.length][2] - 20);
        noStroke();
        rect(x, y + random(h * 0.3, h * 0.7), w, h);
      }
    }
    
    // Add subtle fracture lines
    stroke(0);
    strokeWeight(0.5);
    for (let f = 0; f < 3; f++) {
      const startX = random(width);
      const endX = random(width);
      const startY = y + random(layerHeight * 0.2, layerHeight * 0.8);
      const endY = y + random(layerHeight * 0.2, layerHeight * 0.8);
      
      line(startX, startY, endX, endY);
    }
  }
}
