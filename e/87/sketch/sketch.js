let time = 0;

function setup() {
  createCanvas(720, 480, WEBGL);
  noStroke();
}

function draw() {
  background(0);
  
  // Camera movement to simulate depth
  let camX = sin(time * 0.05) * 100;
  let camY = cos(time * 0.03) * 50;
  camera(0, 0, 200 + camY, 0, 0, 0, 0, 1, 0);
  
  // Ambient sky
  ambientLight(150, 180, 255);
  
  // Water surface with dynamic ripples
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  scale(300);
  
  let waterColor = lerpColor(color(20, 60, 80), color(100, 150, 200), sin(time * 0.02) * 0.5 + 0.5);
  fill(waterColor);
  
  beginShape();
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI);
    let radius = 1 + sin(time * 0.03 + angle) * 0.2;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  pop();
  
  // Light shafts from above
  for (let i = 0; i < 20; i++) {
    let angle = time * 0.01 + i * 0.3;
    let x = sin(angle) * 150;
    let y = cos(angle) * 150;
    
    push();
    translate(x, y, -100);
    rotateZ(angle);
    noStroke();
    fill(255, 255, 255, 30);
    rectMode(CENTER);
    rect(0, 0, 20, 400);
    pop();
  }
  
  // Pool floor
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  scale(300);
  fill(50, 70, 90);
  plane(2, 2);
  pop();
  
  time += 1;
}
