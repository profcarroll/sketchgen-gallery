let gears = [];
let dustParticles = [];
let steamPlumes = [];
let splinters = [];
let bookStack;
let shredder;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create book stack
  bookStack = {
    x: 0,
    y: -150,
    z: 0,
    width: 200,
    height: 300,
    depth: 30,
    books: []
  };

  for (let i = 0; i < 15; i++) {
    bookStack.books.push({
      x: 0,
      y: -150 + i * 20,
      z: 0,
      width: 200,
      height: 18,
      depth: 30,
      color: color(139, 69, 19 + i * 2)
    });
  }

  // Create shredder
  shredder = {
    x: 0,
    y: -50,
    z: 0,
    width: 150,
    height: 100,
    depth: 100,
    rotation: 0
  };

  // Initialize components
  for (let i = 0; i < 8; i++) {
    gears.push({
      x: random(-200, 200),
      y: random(-100, 100),
      z: random(-50, 50),
      radius: random(20, 50),
      rotation: random(TWO_PI),
      teeth: floor(random(8, 16)),
      speed: random(0.02, 0.05)
    });
  }

  // Initialize dust particles
  for (let i = 0; i < 300; i++) {
    dustParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 5),
      speed: random(0.5, 2),
      angle: random(TWO_PI)
    });
  }

  // Initialize steam plumes
  for (let i = 0; i < 20; i++) {
    steamPlumes.push({
      x: random(-width/4, width/4),
      y: random(-height/4, height/4),
      z: random(-100, 100),
      size: random(5, 20),
      speed: random(0.5, 1.5),
      opacity: random(100, 200)
    });
  }

  // Initialize splinters
  for (let i = 0; i < 200; i++) {
    splinters.push({
      x: 0,
      y: -50,
      z: 0,
      size: random(2, 8),
      speedX: random(-2, 2),
      speedY: random(-3, -1),
      speedZ: random(-2, 2),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);

  // Update shredder rotation
  shredder.rotation += 0.05;

  // Update gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
  }

  // Update dust particles
  for (let particle of dustParticles) {
    particle.x += cos(particle.angle) * particle.speed;
    particle.y += sin(particle.angle) * particle.speed;
    particle.z += random(-0.5, 0.5);
    particle.angle += random(-0.1, 0.1);
    
    // Reset particles that go off screen
    if (abs(particle.x) > width/2 || abs(particle.y) > height/2) {
      particle.x = random(-width/2, width/2);
      particle.y = random(-height/2, height/2);
      particle.z = random(-100, 100);
    }
  }

  // Update steam plumes
  for (let plume of steamPlumes) {
    plume.y -= plume.speed;
    plume.size += 0.1;
    plume.opacity -= 1;
    
    // Reset plumes that go off screen or fade out
    if (plume.y < -height/2 || plume.opacity <= 0) {
      plume.x = random(-width/4, width/4);
      plume.y = random(height/4, height/2);
      plume.z = random(-100, 100);
      plume.size = random(5, 20);
      plume.opacity = random(100, 200);
    }
  }

  // Update splinters
  for (let splinter of splinters) {
    splinter.x += splinter.speedX;
    splinter.y += splinter.speedY;
    splinter.z += splinter.speedZ;
    
    // Reset splinters that go off screen
    if (abs(splinter.x) > width/2 || abs(splinter.y) > height/2 || splinter.y > height/2) {
      splinter.x = 0;
      splinter.y = -50;
      splinter.z = 0;
      splinter.speedX = random(-2, 2);
      splinter.speedY = random(-3, -1);
      splinter.speedZ = random(-2, 2);
    }
  }

  // Draw book stack
  push();
  translate(bookStack.x, bookStack.y, bookStack.z);
  for (let book of bookStack.books) {
    fill(book.color);
    noStroke();
    box(book.width, book.height, book.depth);
  }
  pop();

  // Draw shredder
  push();
  translate(shredder.x, shredder.y, shredder.z);
  rotateY(shredder.rotation);
  
  // Main frame
  fill(100, 100, 100);
  box(shredder.width, shredder.height, shredder.depth);
  
  // Rotating blades
  for (let i = 0; i < 8; i++) {
    push();
    rotateZ(i * TWO_PI / 8);
    fill(150, 150, 150);
    box(20, 100, 10);
    pop();
  }
  
  // Gears inside
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    fill(180, 180, 180);
    gearShape(gear.radius, gear.teeth);
    pop();
  }
  
  pop();

  // Draw dust particles
  push();
  noStroke();
  for (let particle of dustParticles) {
    fill(200, 200, 200, 150);
    translate(particle.x, particle.y, particle.z);
    sphere(particle.size);
    translate(-particle.x, -particle.y, -particle.z);
  }
  pop();

  // Draw steam plumes
  push();
  noStroke();
  for (let plume of steamPlumes) {
    fill(255, 255, 255, plume.opacity);
    translate(plume.x, plume.y, plume.z);
    sphere(plume.size);
    translate(-plume.x, -plume.y, -plume.z);
  }
  pop();

  // Draw splinters
  push();
  noStroke();
  for (let splinter of splinters) {
    fill(150, 100, 50);
    translate(splinter.x, splinter.y, splinter.z);
    box(splinter.size, splinter.size * 2, splinter.size);
    translate(-splinter.x, -splinter.y, -splinter.z);
  }
  pop();
}

function gearShape(radius, teeth) {
  let points = [];
  for (let i = 0; i < teeth; i++) {
    let angle = map(i, 0, teeth, 0, TWO_PI);
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    points.push(createVector(x, y));
  }
  
  beginShape();
  for (let point of points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
