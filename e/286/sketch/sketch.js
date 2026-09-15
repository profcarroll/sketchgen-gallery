let pyramids = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pyramidal structures
  for (let i = 0; i < 50; i++) {
    pyramids.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-height/2, height/2),
      size: random(30, 80),
      rot: random(TWO_PI),
      decay: random(0.5, 1)
    });
  }
}

function draw() {
  background(200, 10, 10); // Deep ocean blue
  time += 0.005;

  // Camera movement for immersion
  let cx = sin(time * 0.3) * width/4;
  let cy = cos(time * 0.2) * height/6;
  camera(0, -height/4, height, cx, cy, 0, 0, 1, 0);

  // Water surface wave effect
  stroke(180, 20, 50);
  noFill();
  for (let i = 0; i < 20; i++) {
    let y = map(i, 0, 19, -height/2, height/2);
    beginShape();
    for (let x = -width/2; x <= width/2; x += 10) {
      let wave = sin(x * 0.01 + time + i * 0.3) * 5;
      vertex(x, y + wave, 0);
    }
    endShape();
  }

  // Draw pyramids
  for (let p of pyramids) {
    push();
    translate(p.x, p.y, p.z);
    rotateY(p.rot);
    
    // Erosion effect using decay factor
    let erosion = p.decay;
    
    // Base sediment accumulation
    fill(200, 5, 30);
    stroke(180, 10, 40);
    beginShape();
    vertex(-p.size/2, 0, -p.size/2);
    vertex(p.size/2, 0, -p.size/2);
    vertex(p.size/2, 0, p.size/2);
    vertex(-p.size/2, 0, p.size/2);
    endShape(CLOSE);

    // Pyramid structure
    fill(200, 15, 70);
    stroke(180, 20, 60);
    beginShape();
    vertex(0, -p.size * erosion, 0);
    vertex(-p.size/2, 0, -p.size/2);
    vertex(p.size/2, 0, -p.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -p.size * erosion, 0);
    vertex(p.size/2, 0, -p.size/2);
    vertex(p.size/2, 0, p.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -p.size * erosion, 0);
    vertex(p.size/2, 0, p.size/2);
    vertex(-p.size/2, 0, p.size/2);
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -p.size * erosion, 0);
    vertex(-p.size/2, 0, p.size/2);
    vertex(-p.size/2, 0, -p.size/2);
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
