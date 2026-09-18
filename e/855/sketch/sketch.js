function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
}

function draw() {
  background(0);
  
  // Camera position to emphasize depth and facets
  camera(0, -200, 600, 0, 0, 0, 0, 1, 0);
  
  // Ambient light for overall illumination
  ambientLight(80);
  
  // Directional light to create sharp shadows and highlights
  directionalLight(255, 255, 255, -1, -1, -1);
  
  // Specular highlight material properties
  specularMaterial(255);
  shininess(100);
  
  // Create a faceted geometric structure using multiple shapes
  push();
  translate(0, 0, -100);
  rotateX(PI/4);
  rotateY(PI/6);
  drawFacetedStructure();
  pop();
}

function drawFacetedStructure() {
  // Build the abstract self-portrait using interlocking planar facets
  const segments = 8;
  const radius = 150;
  
  for (let i = 0; i < segments; i++) {
    push();
    
    // Position each facet around a circle
    const angle = TWO_PI * i / segments;
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    
    translate(x, y, 0);
    rotateZ(angle);
    
    // Draw individual planar facets
    drawFacet();
    pop();
  }
}

function drawFacet() {
  // Each facet is a polygon with defined vertices to create angular geometry
  const sides = 6;
  const facetSize = 80;
  
  beginShape();
  for (let i = 0; i < sides; i++) {
    const angle = TWO_PI * i / sides;
    const x = cos(angle) * facetSize;
    const y = sin(angle) * facetSize;
    vertex(x, y, 0);
  }
  endShape(CLOSE);
  
  // Add internal facets to enhance geometric complexity
  fill(30);
  stroke(255);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < sides; i++) {
    const angle = TWO_PI * i / sides;
    const x = cos(angle) * facetSize * 0.6;
    const y = sin(angle) * facetSize * 0.6;
    vertex(x, y, 0);
  }
  endShape(CLOSE);
}
