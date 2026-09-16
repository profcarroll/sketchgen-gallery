let stars = [];
let monoliths = [];
let nebulae = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create starfield
  for (let i = 0; i < 2000; i++) {
    stars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      speed: random(0.1, 0.5)
    });
  }

  // Create monoliths
  for (let i = 0; i < 8; i++) {
    monoliths.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(20, 60),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }

  // Create nebulae
  for (let i = 0; i < 5; i++) {
    nebulae.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(100, 300),
      color: [random(180, 240), random(50, 80), random(40, 70)],
      speed: random(0.0005, 0.001)
    });
  }
}

function draw() {
  background(0);
  
  // Move and draw stars
  for (let star of stars) {
    star.z -= star.speed;
    if (star.z < -1000) {
      star.z = 1000;
      star.x = random(-width * 2, width * 2);
      star.y = random(-height * 2, height * 2);
    }
    
    let x = map(star.x / star.z, 0, 1, 0, width);
    let y = map(star.y / star.z, 0, 1, 0, height);
    let size = map(star.z, -1000, 1000, star.size * 2, star.size);
    
    noStroke();
    fill(255, 255, 255, 0.8);
    ellipse(x, y, size);
  }

  // Draw monoliths
  for (let monolith of monoliths) {
    monolith.rotation += monolith.speed;
    
    push();
    translate(monolith.x, monolith.y, monolith.z);
    rotateZ(monolith.rotation);
    rotateX(sin(millis() * 0.0005) * 0.1);
    
    noStroke();
    fill(200, 30, 20);
    box(monolith.size);
    
    pop();
  }

  // Draw nebulae
  for (let neb of nebulae) {
    neb.x += sin(millis() * neb.speed) * 0.1;
    neb.y += cos(millis() * neb.speed) * 0.1;
    
    push();
    translate(neb.x, neb.y, neb.z);
    
    noStroke();
    fill(neb.color[0], neb.color[1], neb.color[2], 0.1);
    sphere(neb.size);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
