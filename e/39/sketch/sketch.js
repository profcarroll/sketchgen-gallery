let time = 0;
let geometry;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a complex geometric structure using multiple layers of curves
  geometry = [];
  for (let i = 0; i < 20; i++) {
    geometry.push({
      radius: 150 + i * 20,
      height: 80 + sin(i) * 30,
      segments: 12 + i % 4
    });
  }
}

function draw() {
  background(0);
  
  // Slowly rotate the entire scene
  rotateY(time * 0.005);
  rotateX(sin(time * 0.001) * 0.1);
  
  // Create dynamic lighting that moves through the space
  pointLight(255, 255, 255, 
    sin(time * 0.002) * 300,
    cos(time * 0.001) * 300,
    sin(time * 0.003) * 300
  );
  
  // Draw the complex architectural forms
  for (let i = 0; i < geometry.length; i++) {
    push();
    
    // Apply time-based deformation to each form
    let g = geometry[i];
    let deform = sin(time * 0.005 + i) * 20;
    
    // Position forms in a spiral pattern
    let angle = i * 0.5;
    translate(cos(angle) * g.radius, sin(angle) * g.radius, 0);
    
    // Create the twisted, folded appearance through multiple rotations and scaling
    rotateZ(time * 0.001 + i * 0.1);
    scale(1 + sin(time * 0.002 + i) * 0.2);
    
    // Draw a complex curved surface using a mesh of polygons
    drawCurvedSurface(g.radius, g.height, g.segments, deform);
    
    pop();
  }
  
  time++;
}

function drawCurvedSurface(radius, height, segments, deform) {
  let h = height;
  let r = radius;
  
  // Create a textured surface that appears to be oxidized metal
  for (let i = 0; i < segments; i++) {
    push();
    
    // Each segment has its own deformation
    let angle1 = map(i, 0, segments, 0, TWO_PI);
    let angle2 = map(i + 1, 0, segments, 0, TWO_PI);
    
    // Apply a complex twisting motion to each segment
    rotateY(angle1 + sin(time * 0.003 + i) * 0.5);
    
    // Create the convex/concave curves
    let curveFactor = sin(time * 0.002 + i) * 0.3;
    
    beginShape(QUAD_STRIP);
    for (let j = 0; j <= 10; j++) {
      let t = map(j, 0, 10, 0, TWO_PI);
      
      // Create the curved profile of the surface
      let y = sin(t + curveFactor) * h;
      let x = cos(t + curveFactor) * (r + deform * sin(time * 0.005 + t));
      let z = sin(t + curveFactor) * (r + deform * cos(time * 0.005 + t));
      
      // Apply a rust-like color pattern
      let hue = (time * 0.5 + i * 10 + j * 20) % 360;
      fill(hue, 70, 40, 0.9);
      
      vertex(x, y, z);
      
      // Create the second layer for depth and complexity
      let x2 = cos(t + curveFactor) * (r + 5 + deform * sin(time * 0.005 + t));
      let y2 = sin(t + curveFactor) * (h - 10);
      let z2 = sin(t + curveFactor) * (r + 5 + deform * cos(time * 0.005 + t));
      
      vertex(x2, y2, z2);
    }
    endShape();
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
