let steelSheets = [];
let numSheets = 8;
let sheetRadius = 300;
let sheetThickness = 20;
let rotationSpeed = 0.001;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(RGB);

  // Create curved steel sheets
  for (let i = 0; i < numSheets; i++) {
    let angle = map(i, 0, numSheets, 0, TWO_PI);
    let x = cos(angle) * sheetRadius;
    let z = sin(angle) * sheetRadius;
    steelSheets.push({
      x: x,
      y: 0,
      z: z,
      angle: angle,
      radius: sheetRadius,
      thickness: sheetThickness
    });
  }
}

function draw() {
  background(10, 15, 25);
  ambientLight(40);
  pointLight(255, 255, 255, 0, -300, 500);

  // Rotate the entire scene slowly
  rotateY(frameCount * rotationSpeed);

  // Draw each steel sheet
  for (let i = 0; i < steelSheets.length; i++) {
    let sheet = steelSheets[i];
    
    push();
    translate(sheet.x, sheet.y, sheet.z);
    rotateY(sheet.angle);
    
    // Create a curved surface using a series of quads
    let segments = 24;
    beginShape(QUADS);
    for (let j = 0; j < segments; j++) {
      let angle1 = map(j, 0, segments, 0, PI);
      let angle2 = map(j + 1, 0, segments, 0, PI);
      
      let x1 = cos(angle1) * sheet.radius;
      let z1 = sin(angle1) * sheet.radius;
      let x2 = cos(angle2) * sheet.radius;
      let z2 = sin(angle2) * sheet.radius;
      
      // Create a curved surface
      vertex(x1, -sheet.thickness/2, z1);
      vertex(x2, -sheet.thickness/2, z2);
      vertex(x2, sheet.thickness/2, z2);
      vertex(x1, sheet.thickness/2, z1);
    }
    endShape();
    
    pop();
  }

  // Add a sharp perpendicular shift at the center
  push();
  translate(0, 0, -sheetRadius - 50);
  rotateX(HALF_PI);
  
  // Widen the perpendicular segment to maximize visual weight
  let wideSegmentWidth = sheetRadius * 2;
  beginShape(QUADS);
  vertex(-wideSegmentWidth/2, -sheetThickness/2, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2, 0);
  vertex(wideSegmentWidth/2, sheetThickness/2, 0);
  vertex(-wideSegmentWidth/2, sheetThickness/2, 0);
  endShape();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
