let particles = [];
const numParticles = 1000;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-50, 50)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(2, 6),
      hue: random(20, 40),
      saturation: random(70, 90),
      brightness: random(60, 90),
      age: 0,
      maxAge: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 5);
  time += 0.01;

  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 200);

  translate(0, 0, -100);
  rotateX(time * 0.05);
  rotateY(time * 0.03);

  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    p.pos.add(p.vel);
    p.age++;
    
    if (p.age > p.maxAge) {
      p.pos = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-50, 50));
      p.age = 0;
      p.hue = random(20, 40);
    }

    // Slowly grow and change color
    p.size += 0.01;
    if (p.size > 10) p.size = 10;

    fill(p.hue, p.saturation, p.brightness, 0.8);
    
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Add some expanding structures
  for (let i = 0; i < 5; i++) {
    let angle = time * 0.2 + i * TWO_PI / 5;
    let radius = 100 + sin(time + i) * 30;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    
    push();
    translate(x, y, 0);
    rotateZ(time * 0.1 + i);
    noStroke();
    fill(255, 50, 80, 0.3);
    sphere(20 + sin(time * 2 + i) * 5);
    pop();
  }
}
