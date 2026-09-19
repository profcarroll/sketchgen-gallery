let structures = [];
let cameraOffset = 0;
let audioContextStarted = false;

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();
  
  // Generate brutalist concrete structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-1000, 1000),
      y: random(-200, 200),
      z: -i * 100,
      w: random(50, 150),
      h: random(100, 300),
      d: random(50, 150),
      rot: random(TWO_PI)
    });
  }
}

function draw() {
  background(40);
  
  // Camera movement
  cameraOffset -= 2;
  
  // Set up lighting
  ambientLight(60);
  directionalLight(200, 200, 200, 1, 1, -1);
  pointLight(150, 150, 150, 0, 0, 0);
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z + cameraOffset);
    rotateY(s.rot);
    
    // Draw concrete block with depth and shadow
    fill(100);
    box(s.w, s.h, s.d);
    
    // Add some window-like details
    fill(30);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (random() > 0.7) {
          push();
          translate(
            -s.w/2 + i * s.w/4,
            -s.h/2 + j * s.h/3,
            s.d/2 + 1
          );
          box(10, 20, 5);
          pop();
        }
      }
    }
    
    pop();
  }
}

function mousePressed() {
  if (!audioContextStarted) {
    userStartAudio();
    audioContextStarted = true;
  }
}
