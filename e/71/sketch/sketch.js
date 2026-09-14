let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(0);
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 100);

  time += 0.01;

  push();
  rotateX(time * 0.2);
  rotateY(time * 0.3);
  for (let i = 0; i < 100; i++) {
    let angle = i * 0.2;
    let x = sin(angle + time) * 150;
    let y = cos(angle + time * 1.3) * 150;
    let z = sin(angle * 0.7 + time * 0.5) * 100;
    
    push();
    translate(x, y, z);
    rotateZ(time + i * 0.1);
    
    let hue = (i * 3 + time * 20) % 360;
    fill(hue, 255, 255, 180);
    noStroke();
    
    let size = 10 + sin(time + i) * 5;
    sphere(size);
    pop();
  }
  pop();

  push();
  rotateX(-time * 0.1);
  rotateY(time * 0.2);
  for (let j = 0; j < 50; j++) {
    let angle = j * 0.3;
    let x = cos(angle + time * 1.2) * 180;
    let y = sin(angle + time * 0.8) * 180;
    let z = cos(angle * 0.5 + time * 0.6) * 120;
    
    push();
    translate(x, y, z);
    rotateZ(time * 0.5 + j * 0.2);
    
    let hue = (j * 5 + time * 30) % 360;
    fill(hue, 255, 255, 150);
    noStroke();
    
    let size = 8 + cos(time + j) * 4;
    box(size);
    pop();
  }
  pop();

  push();
  rotateY(time * 0.15);
  for (let k = 0; k < 200; k++) {
    let angle = k * 0.1;
    let x = cos(angle + time) * 200;
    let y = sin(angle + time * 1.5) * 200;
    
    push();
    translate(x, y, 0);
    rotateZ(time * 0.3 + k * 0.05);
    
    let hue = (k * 2 + time * 25) % 360;
    fill(hue, 255, 255, 100);
    noStroke();
    
    let size = 5 + sin(time * 0.5 + k) * 3;
    ellipse(0, 0, size, size);
    pop();
  }
  pop();
}
