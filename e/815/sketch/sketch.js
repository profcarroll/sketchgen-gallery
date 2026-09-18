let nodes = [];
let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  
  // Create nodes at random positions
  for (let i = 0; i < 20; i++) {
    nodes.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-200, 200)
      ),
      pulse: random(1),
      hue: random(0.3, 0.4) // Emerald green hue range
    });
  }

  // Create planes that intersect at nodes
  for (let i = 0; i < 15; i++) {
    planes.push({
      normal: p5.Vector.random3D(),
      distance: random(-200, 200),
      pulse: random(1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.2) * 300;
  let cy = cos(time * 0.3) * 200;
  let cz = sin(time * 0.1) * 100 + 500;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Draw planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Calculate pulse effect
    let pulse = sin(time + p.pulse) * 0.5 + 0.5;
    
    push();
    rotateX(p.normal.x * pulse);
    rotateY(p.normal.y * pulse);
    rotateZ(p.normal.z * pulse);
    
    // Draw the plane as a large quad with pulsing color
    fill(pulse * 0.1, 0.8, 0.9, 0.2);
    noStroke();
    plane(1000, 1000);
    pop();
  }
  
  // Draw nodes and connections
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Pulse effect
    let pulse = sin(time + n.pulse) * 0.5 + 0.5;
    let size = 20 + pulse * 30;
    
    push();
    translate(n.pos.x, n.pos.y, n.pos.z);
    
    // Glow effect using emissive color
    fill(n.hue, 1, 1, 0.8);
    noStroke();
    sphere(size * 0.5);
    
    // Energy waves
    for (let j = 0; j < 3; j++) {
      let waveSize = size + j * 20;
      let alpha = 0.2 - j * 0.05;
      fill(n.hue, 1, 1, alpha);
      sphere(waveSize * 0.5);
    }
    
    pop();
  }
  
  // Connect nearby nodes with energy lines
  beginShape(LINES);
  stroke(0.3, 1, 1, 0.6);
  strokeWeight(1);
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(
        nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z,
        nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z
      );
      
      if (d < 300) {
        // Animate the line to show energy flow
        let alpha = map(d, 0, 300, 1, 0.2);
        stroke(0.3, 1, 1, alpha);
        
        vertex(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z);
        vertex(nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
