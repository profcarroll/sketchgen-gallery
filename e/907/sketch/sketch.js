let facets = [];
const NUM_FACETS = 150;
const MAX_DEPTH = 200;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Generate facets
  for (let i = 0; i < NUM_FACETS; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-MAX_DEPTH, MAX_DEPTH);
    const size = random(30, 100);
    const rotX = random(TWO_PI);
    const rotY = random(TWO_PI);
    const rotZ = random(TWO_PI);
    facets.push({
      x, y, z, size, rotX, rotY, rotZ
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Light source
  pointLight(255, 255, 255, 0, 0, 300);

  for (let facet of facets) {
    push();
    translate(facet.x, facet.y, facet.z);
    rotateX(facet.rotX);
    rotateY(facet.rotY);
    rotateZ(facet.rotZ);

    // Create a crystalline surface with subtle texture
    const h = map(facet.z, -MAX_DEPTH, MAX_DEPTH, 200, 300);
    const s = 50;
    const b = 80;
    const a = 0.9;

    fill(h, s, b, a);

    // Draw the facet
    beginShape();
    vertex(-facet.size/2, -facet.size/2, 0);
    vertex(facet.size/2, -facet.size/2, 0);
    vertex(facet.size/2, facet.size/2, 0);
    vertex(-facet.size/2, facet.size/2, 0);
    endShape(CLOSE);

    // Add a subtle texture
    stroke(0, 0, 100, 0.3);
    for (let i = 0; i < 5; i++) {
      const x1 = random(-facet.size/2, facet.size/2);
      const y1 = random(-facet.size/2, facet.size/2);
      const x2 = random(-facet.size/2, facet.size/2);
      const y2 = random(-facet.size/2, facet.size/2);
      line(x1, y1, 0, x2, y2, 0);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
