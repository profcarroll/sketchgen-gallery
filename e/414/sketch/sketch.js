let substrate;
let organisms = [];
let filaments = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  substrate = createGraphics(600, 600);
  substrate.background(30, 40, 50);
  for (let i = 0; i < 200; i++) {
    organisms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(5, 20),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
  for (let i = 0; i < 100; i++) {
    filaments.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      length: random(50, 150),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 15, 25);
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 300);
  pointLight(255, 200, 200, 0, 0, -300);

  time += 0.01;

  // Draw substrate
  texture(substrate);
  plane(width, height);

  // Draw organisms
  beginShape(POINTS);
  for (let organism of organisms) {
    fill(organism.color);
    noStroke();
    vertex(organism.x, organism.y, organism.z);
  }
  endShape();

  // Draw filaments
  stroke(200, 180, 160);
  strokeWeight(1);
  beginShape(LINES);
  for (let filament of filaments) {
    let x1 = filament.x;
    let y1 = filament.y;
    let z1 = filament.z;
    let x2 = x1 + cos(filament.angle) * filament.length;
    let y2 = y1 + sin(filament.angle) * filament.length;
    let z2 = z1;

    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();

  // Update organisms
  for (let organism of organisms) {
    organism.x += sin(time + organism.z * 0.01) * 0.5;
    organism.y += cos(time + organism.z * 0.01) * 0.5;
    organism.z += sin(time * 0.7) * 0.3;
    organism.size += sin(time * 2) * 0.05;
    if (organism.size < 5) organism.size = 5;
    if (organism.size > 20) organism.size = 20;
  }

  // Update filaments
  for (let filament of filaments) {
    filament.angle += random(-0.01, 0.01);
    filament.length += sin(time * 3) * 0.5;
    if (filament.length < 50) filament.length = 50;
    if (filament.length > 150) filament.length = 150;
  }
}
