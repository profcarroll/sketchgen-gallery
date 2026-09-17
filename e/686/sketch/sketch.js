let facets = [];

function setup() {
  createCanvas(800, 800, WEBGL);
  noStroke();

  // Create a set of interlocking geometric facets
  for (let i = 0; i < 20; i++) {
    facets.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-300, 300),
      w: random(50, 150),
      h: random(50, 150),
      d: random(50, 150),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
}

function draw() {
  background(20);
  
  // Fixed camera position
  camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);

  // Ambient light to simulate depth
  ambientLight(80);
  pointLight(255, 255, 255, 0, -300, 0);
  pointLight(255, 255, 255, 0, 300, 0);

  for (let facet of facets) {
    push();
    translate(facet.x, facet.y, facet.z);
    rotateX(facet.rotX);
    rotateY(facet.rotY);
    rotateZ(facet.rotZ);
    fill(facet.color);
    box(facet.w, facet.h, facet.d);
    pop();
  }
}
