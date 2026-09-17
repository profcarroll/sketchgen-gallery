let planes = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create intersecting geometric planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      angle: i * TWO_PI / 8,
      offset: random(200, 400),
      size: random(300, 600)
    });
  }

  // Create energy nodes at intersections
  for (let i = 0; i < 20; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      pulse: random(100, 200),
      size: random(20, 60)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement for immersive effect
  let cx = sin(time * 0.3) * 500;
  let cy = cos(time * 0.2) * 300;
  let cz = sin(time * 0.1) * 400;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);

  // Draw planes
  for (let plane of planes) {
    push();
    rotateY(plane.angle);
    translate(0, 0, plane.offset);
    scale(plane.size);
    
    // Create tessellated grid
    stroke(0, 0, 100, 0.3);
    noFill();
    
    for (let i = -1; i <= 1; i += 0.2) {
      for (let j = -1; j <= 1; j += 0.2) {
        let x = i;
        let y = j;
        
        // Distort based on pulse
        let distortion = sin(time * 3 + i * 5 + j * 5) * 0.3;
        let z = distortion * 50;
        
        translate(x, y, z);
        sphere(2, 4, 4);
        translate(-x, -y, -z);
      }
    }
    
    pop();
  }

  // Draw energy nodes
  for (let node of nodes) {
    push();
    translate(node.x, node.y, node.z);
    
    let pulse = sin(time * 5 + node.pulse) * 0.5 + 0.5;
    let size = node.size * (1 + pulse * 0.5);
    
    // Pulsing emerald green glow
    fill(120, 100, 80, 0.8);
    noStroke();
    sphere(size, 8, 6);
    
    // Outer ring effect
    stroke(120, 100, 100, 0.5);
    noFill();
    sphere(size * 1.5, 8, 6);
    
    pop();
  }

  // Draw connecting lines between nodes
  stroke(120, 100, 100, 0.2);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].x, nodes[i].y, nodes[i].z,
                   nodes[j].x, nodes[j].y, nodes[j].z);
      
      if (d < 300) {
        vertex(nodes[i].x, nodes[i].y, nodes[i].z);
        vertex(nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
