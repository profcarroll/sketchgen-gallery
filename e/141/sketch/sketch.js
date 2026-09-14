let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);
  time += 0.01;

  for (let i = 0; i < 200; i++) {
    push();
    let x = sin(time + i * 0.1) * 200;
    let y = cos(time + i * 0.1) * 200;
    let z = sin(time * 0.5 + i * 0.05) * 100;

    translate(x, y, z);
    rotateX(time * 0.2 + i * 0.02);
    rotateY(time * 0.3 + i * 0.03);

    let size = 20 + sin(time + i) * 10;
    let hue = (time * 20 + i * 2) % 360;

    fill(hue, 80, 90, 150);
    noStroke();

    if (i % 3 === 0) {
      sphere(size);
    } else if (i % 3 === 1) {
      box(size, size * 0.5, size * 0.5);
    } else {
      torus(size * 0.7, size * 0.2);
    }

    pop();
  }
}
