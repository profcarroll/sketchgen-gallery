let hexGrid = [];
let crystals = [];
let palette = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create hexagonal grid for intersection points
  let hexRadius = 60;
  let spacing = hexRadius * sqrt(3);
  let cols = ceil(width / spacing) + 4;
  let rows = ceil(height / spacing) + 4;
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * spacing + (j % 2) * spacing/2 - width/2;
      let y = j * spacing * 0.75 - height/2;
      hexGrid.push({x, y, radius: hexRadius});
    }
  }
  
  // Generate crystal deposits
  for (let i = 0; i < 1500; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(1, 4),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(80, 100)
    });
  }
  
  // Create vibrant palette
  for (let i = 0; i < 6; i++) {
    palette.push(color((i * 60) % 360, 90, 90));
  }
}

function draw() {
  background(0);
  
  // Center the view and zoom in
  translate(0, 0, -800);
  
  // Rotate slowly for dynamic effect
  rotateY(frameCount * 0.0015);
  rotateX(frameCount * 0.001);
  
  // Draw hexagonal grid intersection points as crystalline structures
  noStroke();
  for (let hex of hexGrid) {
    push();
    translate(hex.x, hex.y, 0);
    
    // Draw a small hexagon to simulate crystal structure
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = hex.radius * 0.5 * cos(angle);
      let y = hex.radius * 0.5 * sin(angle);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw crystalline deposits as point cloud
  strokeWeight(1);
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    let c = color(crystal.hue, crystal.saturation, crystal.brightness);
    stroke(c);
    noFill();
    
    // Draw tiny geometric structures
    beginShape(POINTS);
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      let x = crystal.size * cos(angle);
      let y = crystal.size * sin(angle);
      vertex(x, y, 0);
    }
    endShape();
    
    pop();
  }
  
  // Draw sharp geometric lines to emphasize structure
  stroke(255, 100);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < 300; i++) {
    let x1 = random(-width/2, width/2);
    let y1 = random(-height/2, height/2);
    let z1 = random(-300, 300);
    
    let x2 = random(-width/2, width/2);
    let y2 = random(-height/2, height/2);
    let z2 = random(-300, 300);
    
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
