let steelSheets = [];
let numSheets = 12;
let sheetRadius = 400;
let sheetThickness = 25;
let platformDepth = 120;
let platformHeight = 60;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(RGB);

  // Create curved steel sheets with a dramatic upward arc
  for (let i = 0; i < numSheets; i++) {
    let angle = map(i, 0, numSheets, 0, PI);
    let x = cos(angle) * sheetRadius;
    let z = sin(angle) * sheetRadius;
    
    // Add a more dramatic upward curve
    let y = map(i, 0, numSheets, -sheetRadius/3, sheetRadius/2);
    
    steelSheets.push({
      x: x,
      y: y,
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

  // Draw each steel sheet
  for (let i = 0; i < steelSheets.length; i++) {
    let sheet = steelSheets[i];
    
    push();
    translate(sheet.x, sheet.y, sheet.z);
    rotateY(sheet.angle);
    
    // Create a curved surface using a series of quads
    let segments = 32;
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
  let wideSegmentWidth = sheetRadius * 1.8;
  beginShape(QUADS);
  vertex(-wideSegmentWidth/2, -sheetThickness/2, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2, 0);
  vertex(wideSegmentWidth/2, sheetThickness/2, 0);
  vertex(-wideSegmentWidth/2, sheetThickness/2, 0);
  endShape();
  
  // Add the sharp step down onto tiered platform
  translate(0, 0, -platformDepth);
  beginShape(QUADS);
  vertex(-wideSegmentWidth/2, -sheetThickness/2, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2 + platformHeight, 0);
  vertex(-wideSegmentWidth/2, -sheetThickness/2 + platformHeight, 0);
  endShape();
  
  // Add a second tier
  translate(0, 0, -platformDepth/2);
  beginShape(QUADS);
  vertex(-wideSegmentWidth/2, -sheetThickness/2 + platformHeight, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2 + platformHeight, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2 + platformHeight*1.5, 0);
  vertex(-wideSegmentWidth/2, -sheetThickness/2 + platformHeight*1.5, 0);
  endShape();
  
  // Add the vast horizontal plane that terminates the pathway
  translate(0, 0, -platformDepth/2);
  beginShape(QUADS);
  vertex(-wideSegmentWidth/2, -sheetThickness/2 + platformHeight*1.5, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2 + platformHeight*1.5, 0);
  vertex(wideSegmentWidth/2, -sheetThickness/2 + platformHeight*1.5 + 800, 0);
  vertex(-wideSegmentWidth/2, -sheetThickness/2 + platformHeight*1.5 + 800, 0);
  endShape();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
