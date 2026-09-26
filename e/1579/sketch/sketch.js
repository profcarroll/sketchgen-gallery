let shapes = [];
let connections = [];
let time = 0;
const numShapes = 150;
const maxConnections = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize shapes with random properties
  for (let i = 0; i < numShapes; i++) {
    shapes.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      size: random(20, 60),
      rot: random(TWO_PI),
      rotSpeed: random(-0.01, 0.01),
      color: color(random(360), 80, 90),
      distortion: 0,
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  time += 0.02;
  
  // Update and display shapes
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    
    // Apply distortion based on time
    shape.distortion = sin(time + i * 0.1) * 0.5 + 0.5;
    
    // Update rotation
    shape.rot += shape.rotSpeed;
    
    // Add current position to trail
    shape.trail.push(shape.pos.copy());
    if (shape.trail.length > 20) {
      shape.trail.shift();
    }
    
    push();
    translate(shape.pos.x, shape.pos.y, shape.pos.z);
    rotateX(shape.rot);
    rotateY(shape.rot * 0.7);
    rotateZ(shape.rot * 1.3);
    
    // Draw distorted shape
    fill(shape.color);
    noStroke();
    drawDistortedShape(shape.size, shape.distortion);
    pop();
    
    // Draw trail
    if (shape.trail.length > 1) {
      stroke(shape.color);
      strokeWeight(0.5);
      noFill();
      beginShape(LINES);
      for (let j = 0; j < shape.trail.length - 1; j++) {
        let alpha = map(j, 0, shape.trail.length - 1, 0, 0.5);
        stroke(hue(shape.color), saturation(shape.color), brightness(shape.color), alpha);
        vertex(shape.trail[j].x, shape.trail[j].y, shape.trail[j].z);
        vertex(shape.trail[j + 1].x, shape.trail[j + 1].y, shape.trail[j + 1].z);
      }
      endShape();
    }
  }
  
  // Connect nearby shapes with lines
  connections = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      let d = p5.Vector.dist(shapes[i].pos, shapes[j].pos);
      if (d < 200) {
        connections.push({
          a: shapes[i],
          b: shapes[j],
          distance: d
        });
      }
    }
  }
  
  // Draw connections
  stroke(255, 0.3);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < min(connections.length, maxConnections); i++) {
    let c = connections[i];
    vertex(c.a.pos.x, c.a.pos.y, c.a.pos.z);
    vertex(c.b.pos.x, c.b.pos.y, c.b.pos.z);
  }
  endShape();
  
  // Occasionally separate some connections
  if (frameCount % 120 === 0) {
    for (let i = 0; i < min(3, connections.length); i++) {
      let c = connections[i];
      
      // Create separation vector
      let separationVector = p5.Vector.sub(c.b.pos, c.a.pos).normalize().mult(random(10, 20));
      
      // Apply separation to both shapes
      c.a.pos.add(separationVector);
      c.b.pos.sub(separationVector);
    }
  }
}

function drawDistortedShape(size, distortion) {
  // Create a tessellated shape with distortion
  const detail = 6;
  const radius = size * (0.8 + 0.2 * distortion);
  
  beginShape();
  for (let i = 0; i < detail; i++) {
    let angle = map(i, 0, detail, 0, TWO_PI);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    // Add some warping
    let warp = distortion * 10 * sin(time + i * 0.5);
    x += warp * cos(angle * 2);
    y += warp * sin(angle * 2);
    
    vertex(x, y, 0);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
