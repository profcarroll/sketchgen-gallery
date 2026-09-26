let facets = [];
let shadowLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Build a complex geometric self-portrait using interlocking planar facets
  for (let i = 0; i < 15; i++) {
    let x = random(-width/4, width/4);
    let y = random(-height/6, height/6);
    let z = random(-height * 0.8, height * 0.8);
    let w = random(30, 100);
    let h = random(30, 100);
    let d = random(20, 60);
    facets.push({ x, y, z, w, h, d });
  }

  // Generate directional shadow lines that traverse the surfaces
  for (let i = 0; i < 80; i++) {
    let start = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-height * 0.9, height * 0.9));
    let end = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-height * 0.9, height * 0.9));
    shadowLines.push({ start, end });
  }
}

function draw() {
  background(0);
  noStroke();

  // Set up dramatic directional lighting
  pointLight(255, 255, 255, -width/2, -height/2, height * 1.5);
  pointLight(200, 200, 200, width/2, height/2, height * 1.5);

  // Draw all facets as one batched shape
  beginShape();
  for (let facet of facets) {
    push();
    translate(facet.x, facet.y, facet.z);
    
    fill(180, 180, 200);
    shininess(50);
    specularColor(255, 255, 255);
    
    // Draw a box with high geometric definition but low vertex count
    box(facet.w, facet.h, facet.d);
    
    pop();
  }
  endShape();

  // Batch shadow lines into one draw call
  stroke(0, 0, 0, 150);
  strokeWeight(1.5);
  beginShape(LINES);
  for (let line of shadowLines) {
    vertex(line.start.x, line.start.y, line.start.z);
    vertex(line.end.x, line.end.y, line.end.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
