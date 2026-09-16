let time = 0;
let facets = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create architectural facets
  for (let i = 0; i < 12; i++) {
    facets.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-200, 200),
      w: random(50, 150),
      h: random(50, 200),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;
  
  // Ambient lighting
  ambientLight(30);
  
  // Dynamic directional light (simulating sun movement)
  let sunX = sin(time) * width/2;
  let sunY = cos(time * 0.7) * height/4;
  pointLight(255, 255, 255, sunX, sunY, 300);
  
  // Draw architectural facets
  for (let i = 0; i < facets.length; i++) {
    push();
    
    let f = facets[i];
    
    // Animate position and rotation
    let offset = sin(time * 0.5 + i) * 20;
    translate(f.x, f.y + offset, f.z);
    rotateY(f.angle + time * 0.1);
    
    // Create a faceted structure with varying heights
    let segments = 3;
    for (let j = 0; j < segments; j++) {
      let h = map(j, 0, segments-1, f.h, f.h * 0.6);
      let w = map(j, 0, segments-1, f.w, f.w * 0.8);
      
      // Alternate between light and shadow areas
      fill(j % 2 === 0 ? 200 : 50);
      
      // Create a stepped faceted look
      box(w, h, 10);
      translate(0, -h/2, 0);
    }
    
    pop();
  }
  
  // Add dynamic light beams that shift and warp
  push();
  noStroke();
  for (let i = 0; i < 8; i++) {
    let angle = time + i * 0.5;
    let x = sin(angle) * width/2;
    let y = cos(angle * 1.3) * height/4;
    
    // Create a light beam with color variation
    let hue = (time * 20 + i * 30) % 360;
    fill(hue, 100, 100, 50);
    
    // Warp the beam shape over time
    beginShape();
    for (let j = 0; j < 10; j++) {
      let a = angle + j * 0.2;
      let r = 20 + sin(time * 3 + j) * 10;
      vertex(x + cos(a) * r, y + sin(a) * r);
    }
    endShape(CLOSE);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
