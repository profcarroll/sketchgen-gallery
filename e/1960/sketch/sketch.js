let channels = [];
let pigments = [
  [139, 69, 19],   // Brown
  [101, 67, 33],   // Dark Brown
  [128, 128, 128], // Gray
  [160, 82, 45],   // Sienna
  [139, 115, 85],  // Dark Tan
];

function setup() {
  createCanvas(800, 600, WEBGL);
  noLoop();
  generateChannels();
}

function draw() {
  background(240);
  
  // Draw channels with Victorian botanical style
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    push();
    strokeWeight(1.5);
    
    // Use muted pigment colors
    const colorIndex = i % pigments.length;
    stroke(pigments[colorIndex][0], pigments[colorIndex][1], pigments[colorIndex][2]);
    
    noFill();
    beginShape();
    for (let j = 0; j < channel.length; j++) {
      const point = channel[j];
      vertex(point.x, point.y, point.z);
    }
    endShape();
    pop();
  }
  
  // Add subtle texture to simulate dried pigment
  drawPigmentTexture();
}

function generateChannels() {
  channels = [];
  
  // Create multiple branching pathways
  for (let c = 0; c < 8; c++) {
    const channel = [];
    let x = random(-200, 200);
    let y = -250;
    let z = random(-200, 200);
    
    // Create a curved path
    for (let i = 0; i < 100; i++) {
      x += random(-5, 5);
      y += random(1, 3);
      z += random(-5, 5);
      
      // Add some branching
      if (i % 20 === 0 && random() > 0.7) {
        const branch = createBranch(x, y, z, i);
        channels.push(branch);
      }
      
      channel.push({x, y, z});
    }
    
    channels.push(channel);
  }
}

function createBranch(x, y, z, depth) {
  const branch = [];
  let bx = x + random(-30, 30);
  let by = y + random(10, 30);
  let bz = z + random(-30, 30);
  
  for (let i = 0; i < 30; i++) {
    bx += random(-3, 3);
    by += random(1, 2);
    bz += random(-3, 3);
    branch.push({x: bx, y: by, z: bz});
  }
  
  return branch;
}

function drawPigmentTexture() {
  // Add subtle texture to simulate dried pigment
  strokeWeight(0.5);
  for (let i = 0; i < 1000; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const colorIndex = floor(random(pigments.length));
    stroke(pigments[colorIndex][0], pigments[colorIndex][1], pigments[colorIndex][2], 30);
    point(x, y, 0);
  }
}
