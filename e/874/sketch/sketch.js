let steelMesh;
let channels = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();

  // Create a complex steel mesh with curvature
  steelMesh = createSteelMesh();
  
  // Generate mineral runoff channels
  generateChannels();
}

function draw() {
  background(30, 25, 20);
  strokeWeight(1);
  
  // Ambient lighting
  ambientLight(40);
  pointLight(255, 255, 255, 0, 0, 100);
  
  // Draw the steel structure
  push();
  rotateY(frameCount * 0.001);
  drawSteelStructure();
  pop();
  
  // Draw mineral channels
  drawChannels();
}

function createSteelMesh() {
  // Create a complex curved mesh representing the steel structure
  let mesh = [];
  for (let i = 0; i < 200; i++) {
    let x = sin(i * 0.1) * 300;
    let y = cos(i * 0.15) * 200;
    let z = sin(i * 0.2) * 150;
    mesh.push(createVector(x, y, z));
  }
  return mesh;
}

function generateChannels() {
  // Generate mineral runoff channels as streaks
  for (let i = 0; i < 300; i++) {
    let channel = {
      points: [],
      color: color(120 + random(40), 40 + random(30), 10 + random(20), 180)
    };
    
    // Create a winding path
    let start = createVector(random(-400, 400), random(-300, 300), random(-200, 200));
    channel.points.push(start);
    
    for (let j = 0; j < 50; j++) {
      let last = channel.points[channel.points.length - 1];
      let next = p5.Vector.add(last, createVector(random(-30, 30), random(-20, 20), random(-10, 10)));
      channel.points.push(next);
    }
    
    channels.push(channel);
  }
}

function drawSteelStructure() {
  // Draw the main steel structure with curved forms
  stroke(180, 170, 160);
  noFill();
  
  beginShape();
  for (let i = 0; i < steelMesh.length; i++) {
    let v = steelMesh[i];
    vertex(v.x, v.y, v.z);
  }
  endShape(CLOSE);
  
  // Add some structural elements
  stroke(150, 140, 130);
  for (let i = 0; i < steelMesh.length - 1; i++) {
    let a = steelMesh[i];
    let b = steelMesh[i + 1];
    line(a.x, a.y, a.z, b.x, b.y, b.z);
  }
}

function drawChannels() {
  // Draw the mineral runoff channels
  for (let channel of channels) {
    stroke(channel.color);
    noFill();
    
    beginShape();
    for (let point of channel.points) {
      vertex(point.x, point.y, point.z);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
