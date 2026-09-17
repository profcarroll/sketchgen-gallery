let lines = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize nodes in a grid
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 15; j++) {
      nodes.push({
        x: map(i, 0, 19, -width/2 + 50, width/2 - 50),
        y: map(j, 0, 14, -height/2 + 50, height/2 - 50),
        z: 0,
        age: 0
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Update nodes with dynamic movement
  for (let node of nodes) {
    node.age += 0.02;
    node.z = sin(node.age * 2 + time) * 50;
  }
  
  // Draw all lines in one batch
  beginShape(LINES);
  strokeWeight(1);
  
  let count = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (count > 500) break; // Limit connections per frame
      
      let a = nodes[i];
      let b = nodes[j];
      
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let dz = a.z - b.z;
      let dist = sqrt(dx*dx + dy*dy + dz*dz);
      
      if (dist < 150) {
        stroke((time * 20 + i * 10) % 360, 100, 100, 0.8);
        vertex(a.x, a.y, a.z);
        vertex(b.x, b.y, b.z);
        count++;
      }
    }
    if (count > 500) break;
  }
  
  endShape();
  
  // Draw nodes as points
  beginShape(POINTS);
  strokeWeight(3);
  for (let node of nodes) {
    let h = (time * 20 + node.age * 10) % 360;
    fill(h, 100, 100, 1);
    vertex(node.x, node.y, node.z);
  }
  endShape();
}
