let img;
let rotX = 0;
let rotY = 0;
let targetRotX = 0;
let targetRotY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let geometry;

function preload() {
  // Using a placeholder image since external URL failed
  img = createImg('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwMCI+UGxhY2Vob2xkPC90ZXh0Pjwvc3ZnPg==', '');
  img.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a low-poly geometric shape (a faceted sphere)
  geometry = createGeometry(150, 8, 6);
  
  // Set up rotation
  rotX = PI / 4;
  rotY = PI / 6;
}

function draw() {
  background(0);
  
  // Apply automatic rotation
  if (!isDragging) {
    targetRotX += 0.002;
    targetRotY += 0.001;
  }
  
  // Smoothly interpolate to target rotation
  rotX = lerp(rotX, targetRotX, 0.03);
  rotY = lerp(rotY, targetRotY, 0.03);
  
  // Apply rotations
  rotateX(rotX);
  rotateY(rotY);
  
  // Draw the geometry with texture
  drawGeometry(geometry);
}

function createGeometry(radius, widthSegments, heightSegments) {
  const vertices = [];
  const indices = [];
  
  for (let i = 0; i <= heightSegments; i++) {
    const v = map(i, 0, heightSegments, 0, PI);
    const sinV = sin(v);
    const cosV = cos(v);
    
    for (let j = 0; j <= widthSegments; j++) {
      const u = map(j, 0, widthSegments, 0, TWO_PI);
      const x = radius * sinV * cos(u);
      const y = radius * cosV;
      const z = radius * sinV * sin(u);
      
      vertices.push(x, y, z);
    }
  }
  
  // Create indices for triangles
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * (widthSegments + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (widthSegments + 1) + j;
      const d = c + 1;
      
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }
  
  return { vertices, indices };
}

function drawGeometry(geo) {
  texture(img);
  
  beginShape(TRIANGLES);
  for (let i = 0; i < geo.indices.length; i += 3) {
    const a = geo.indices[i];
    const b = geo.indices[i + 1];
    const c = geo.indices[i + 2];
    
    const ax = geo.vertices[a * 3];
    const ay = geo.vertices[a * 3 + 1];
    const az = geo.vertices[a * 3 + 2];
    
    const bx = geo.vertices[b * 3];
    const by = geo.vertices[b * 3 + 1];
    const bz = geo.vertices[b * 3 + 2];
    
    const cx = geo.vertices[c * 3];
    const cy = geo.vertices[c * 3 + 1];
    const cz = geo.vertices[c * 3 + 2];
    
    vertex(ax, ay, az);
    vertex(bx, by, bz);
    vertex(cx, cy, cz);
  }
  endShape();
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (isDragging) {
    const deltaX = mouseX - lastMouseX;
    const deltaY = mouseY - lastMouseY;
    
    targetRotY += deltaX * 0.01;
    targetRotX += deltaY * 0.01;
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
