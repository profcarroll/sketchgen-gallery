let facets = [];
let lightPosition;
let audioContext;

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();
  
  // Create abstract planar facets
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    let size = random(20, 60);
    let rotX = random(TWO_PI);
    let rotY = random(TWO_PI);
    let rotZ = random(TWO_PI);
    facets.push({
      x: x,
      y: y,
      z: z,
      size: size,
      rotX: rotX,
      rotY: rotY,
      rotZ: rotZ,
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
  
  lightPosition = createVector(0, -100, 200);
}

function draw() {
  background(0);
  
  // Ambient lighting
  ambientLight(60);
  
  // Directional light
  directionalLight(255, 255, 255, lightPosition);
  
  // Draw facets
  for (let facet of facets) {
    push();
    translate(facet.x, facet.y, facet.z);
    rotateX(facet.rotX);
    rotateY(facet.rotY);
    rotateZ(facet.rotZ);
    
    fill(facet.color);
    
    // Draw a planar polygon (like a diamond or crystal face)
    beginShape();
    vertex(-facet.size/2, -facet.size/2, 0);
    vertex(facet.size/2, -facet.size/2, 0);
    vertex(facet.size/2, facet.size/2, 0);
    vertex(-facet.size/2, facet.size/2, 0);
    endShape(CLOSE);
    
    pop();
  }
  
  // Prevent animation
  noLoop();
}
