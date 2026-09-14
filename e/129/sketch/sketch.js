let waveOffset = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(200, 5, 10);
  
  // Create a large water surface
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  noStroke();
  fill(180, 30, 70, 0.7);
  plane(width * 2, height * 2);
  pop();
  
  // Draw waves
  for (let i = 0; i < 50; i++) {
    let x = map(i, 0, 50, -width/2, width/2);
    let y = sin(frameCount * 0.01 + i * 0.2) * 30;
    let z = sin(frameCount * 0.005 + i * 0.3) * 20;
    
    push();
    translate(x, y, z);
    rotateX(PI / 2);
    noStroke();
    fill(190, 40, 80, 0.5);
    ellipse(0, 0, 80, 30);
    pop();
  }
  
  // Draw shadow patterns
  for (let i = 0; i < 100; i++) {
    let x = map(i, 0, 100, -width/2, width/2);
    let y = sin(frameCount * 0.02 + i * 0.1) * 50;
    let size = map(sin(frameCount * 0.01 + i * 0.05), -1, 1, 30, 80);
    
    push();
    translate(x, y, -100);
    noStroke();
    fill(0, 0, 0, 0.2);
    ellipse(0, 0, size, size * 0.5);
    pop();
  }
  
  waveOffset += 0.02;
}
