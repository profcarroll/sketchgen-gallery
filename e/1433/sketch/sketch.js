let facets = [];
let cameraZ;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cameraZ = (height / 2.0) / tan(PI * 30.0 / 180.0);

  // Generate abstract self-portrait facets
  for (let i = 0; i < 20; i++) {
    let x = random(-width/3, width/3);
    let y = random(-height/4, height/4);
    let z = random(-cameraZ * 0.5, cameraZ * 0.5);
    let w = random(30, 100);
    let h = random(30, 100);
    let d = random(20, 60);
    facets.push({ x, y, z, w, h, d });
  }
}

function draw() {
  background(0);
  noStroke();

  // Lighting setup
  pointLight(255, 255, 255, -width/2, -height/2, cameraZ * 2);
  pointLight(200, 200, 200, width/2, height/2, cameraZ * 2);

  // Draw each facet
  for (let f of facets) {
    push();
    translate(f.x, f.y, f.z);
    
    // Apply lighting and material properties
    fill(180, 180, 200);
    shininess(50);
    specularColor(255, 255, 255);
    
    // Draw the box with some texture
    box(f.w, f.h, f.d);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
