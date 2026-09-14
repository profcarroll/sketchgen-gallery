let plates = [];
let rotation = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);

  // Create a series of steel plate shapes
  for (let i = 0; i < 20; i++) {
    plates.push({
      x: 0,
      y: 0,
      z: -i * 150,
      width: 300 + i * 10,
      height: 20 + i * 2,
      depth: 10 + i * 3,
      rotation: i * 0.1
    });
  }
}

function draw() {
  background(40, 30, 25); // Dark ochre background

  // Static camera view
  noStroke();
  
  // Draw each plate with varying colors representing rust and age
  for (let i = 0; i < plates.length; i++) {
    push();
    
    // Position each plate along the arc
    let plate = plates[i];
    translate(plate.x, plate.y, plate.z);
    
    // Apply rotation to simulate curvature
    rotateY(plate.rotation + rotation);
    
    // Color scheme: ochre, charcoal, burnt sienna
    let r = map(i, 0, plates.length, 139, 20);
    let g = map(i, 0, plates.length, 69, 15);
    let b = map(i, 0, plates.length, 19, 10);
    
    fill(r, g, b);
    
    // Draw a rectangular plate with depth
    box(plate.width, plate.height, plate.depth);
    
    pop();
  }

  // Simulate slow rotation for visual interest without motion
  rotation += 0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
