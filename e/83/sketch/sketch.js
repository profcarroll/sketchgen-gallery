let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(30);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -200, 200);
  
  // Pool surface
  push();
  translate(0, 0, -100);
  rotateX(HALF_PI);
  noStroke();
  fill(0, 50, 100, 180);
  plane(600, 600);
  pop();

  // Ripples
  push();
  translate(0, 0, -100);
  rotateX(HALF_PI);
  for (let i = 0; i < 20; i++) {
    let angle = map(i, 0, 20, 0, TWO_PI);
    let radius = 100 + sin(time * 0.5 + angle) * 20;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.3 + angle) * 30;
    
    push();
    translate(x, y, z);
    rotateZ(angle);
    noStroke();
    fill(20, 80, 150, 100);
    ellipse(0, 0, 60 + sin(time + i) * 20, 10);
    pop();
  }
  pop();

  // Water surface displacement
  for (let i = 0; i < 50; i++) {
    let angle = map(i, 0, 50, 0, TWO_PI);
    let radius = 200 + sin(time * 0.3 + angle) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    push();
    translate(x, y, -100);
    rotateX(HALF_PI);
    noStroke();
    fill(0, 100, 200, 80);
    ellipse(0, 0, 30 + sin(time + i) * 10, 5);
    pop();
  }

  time += 0.02;
}
