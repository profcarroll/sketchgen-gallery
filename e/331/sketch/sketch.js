let particles = [];
let connections = [];
let time = 0;
let crystalNetwork;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(2, 6),
      hue: random(360)
    });
  }
  
  // Precompute crystal network
  crystalNetwork = createGraphics(800, 600);
  crystalNetwork.colorMode(HSB, 360, 100, 100, 1);
  crystalNetwork.background(0, 0, 0, 0);
  crystalNetwork.stroke(200, 50, 100, 0.8);
  crystalNetwork.strokeWeight(1);
  
  for (let i = 0; i < 500; i++) {
    let x = random(crystalNetwork.width);
    let y = random(crystalNetwork.height);
    let size = random(20, 80);
    crystalNetwork.push();
    crystalNetwork.translate(x, y);
    crystalNetwork.rotate(random(TWO_PI));
    crystalNetwork.triangle(-size/2, -size/2, size/2, -size/2, 0, size/2);
    crystalNetwork.pop();
  }
}

function draw() {
  background(0, 0, 0);
  
  // Camera movement
  let rx = sin(time * 0.0005) * 0.1;
  let ry = cos(time * 0.0003) * 0.1;
  let rz = sin(time * 0.0002) * 0.1;
  
  // Rotate the scene
  rotateX(rx);
  rotateY(ry);
  rotateZ(rz);
  
  // Draw particles
  stroke(200, 80, 100, 0.8);
  strokeWeight(2);
  noFill();
  
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();
  
  // Update and draw connections
  stroke(200, 50, 100, 0.3);
  strokeWeight(0.5);
  beginShape(LINES);
  
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let d = dist(p1.pos.x, p1.pos.y, p1.pos.z, p2.pos.x, p2.pos.y, p2.pos.z);
      
      if (d < 150) {
        vertex(p1.pos.x, p1.pos.y, p1.pos.z);
        vertex(p2.pos.x, p2.pos.y, p2.pos.z);
      }
    }
  }
  
  endShape();
  
  // Draw crystalline network
  image(crystalNetwork, -width/2, -height/2);
  
  time++;
}
