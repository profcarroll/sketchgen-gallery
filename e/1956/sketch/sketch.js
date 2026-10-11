let folds = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a complex folded structure using planes
  for (let i = 0; i < 15; i++) {
    let layer = [];
    let numPlanes = 8 + i * 2;
    for (let j = 0; j < numPlanes; j++) {
      let angle = map(j, 0, numPlanes - 1, 0, TWO_PI);
      let x = cos(angle) * 150;
      let y = sin(angle) * 150;
      let z = (i - 7) * 20;
      let size = 300 - i * 10;
      
      layer.push({
        x: x,
        y: y,
        z: z,
        size: size,
        angle: angle,
        originalAngle: angle
      });
    }
    folds.push(layer);
  }
}

function draw() {
  background(20);
  
  // Slowly rotate the entire structure
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);
  
  // Update time for animation
  time++;
  
  // Draw each layer of folds
  for (let i = 0; i < folds.length; i++) {
    let layer = folds[i];
    
    for (let j = 0; j < layer.length; j++) {
      let fold = layer[j];
      
      push();
      
      // Apply decay to the fold - slowly distorting its position and angle
      let decayFactor = map(i, 0, folds.length - 1, 0, 1);
      let distortion = sin(time * 0.002 + i) * 0.3 * decayFactor;
      
      translate(fold.x, fold.y, fold.z);
      
      // Apply slight rotation that changes over time
      rotateZ(fold.originalAngle + distortion);
      
      // Create a subtle warping effect using a different variable name
      let scaleValue = 1 + sin(time * 0.001 + i) * 0.05;
      scale(scaleValue, scaleValue, scaleValue);
      
      // Draw the folded plane with monochromatic tones
      fill(200 - i * 5);
      plane(fold.size, fold.size * 0.3);
      
      pop();
    }
  }
  
  // Add subtle floating particles that represent decay
  for (let i = 0; i < 50; i++) {
    let x = sin(time * 0.001 + i) * 200;
    let y = cos(time * 0.001 + i) * 200;
    let z = sin(time * 0.0005 + i) * 100;
    
    push();
    translate(x, y, z);
    fill(255, 100);
    sphere(2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
