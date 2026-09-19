let books = [];
let shredderParts = [];
let dustParticles = [];
let steamParticles = [];
let gearRotation = 0;
let bookFallSpeed = 0.5;
let shredderActive = true;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create books
  for (let i = 0; i < 15; i++) {
    books.push({
      x: random(-200, 200),
      y: -300 - i * 40,
      z: random(-100, 100),
      width: random(80, 120),
      height: random(10, 20),
      depth: random(5, 15),
      color: color(random(20, 40), 70, 80)
    });
  }
  
  // Create shredder parts
  for (let i = 0; i < 8; i++) {
    shredderParts.push({
      x: random(-100, 100),
      y: random(50, 150),
      z: random(-100, 100),
      size: random(20, 40),
      rotation: random(TWO_PI),
      speed: random(0.02, 0.05)
    });
  }
  
  // Create initial dust particles
  for (let i = 0; i < 300; i++) {
    dustParticles.push({
      x: random(-150, 150),
      y: random(0, 100),
      z: random(-100, 100),
      size: random(1, 4),
      speed: random(0.1, 0.3),
      life: random(200, 400)
    });
  }
  
  // Create steam particles
  for (let i = 0; i < 150; i++) {
    steamParticles.push({
      x: random(-100, 100),
      y: random(200, 300),
      z: random(-100, 100),
      size: random(2, 8),
      speed: random(0.5, 1.5),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Camera movement
  let time = millis() * 0.0005;
  camera(
    sin(time) * 400,
    sin(time * 0.5) * 100,
    cos(time) * 400,
    0, 0, 0,
    0, 1, 0
  );
  
  // Rotate gears
  gearRotation += 0.03;
  
  // Draw shredder base
  push();
  translate(0, 200, 0);
  rotateX(HALF_PI);
  noStroke();
  fill(30, 30, 40);
  cylinder(150, 4);
  pop();
  
  // Draw shredder mechanism
  for (let part of shredderParts) {
    push();
    translate(part.x, part.y, part.z);
    rotateZ(gearRotation * part.speed);
    
    // Gear teeth
    fill(20, 50, 60);
    stroke(0, 0, 0);
    strokeWeight(1);
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI / 12 * i;
      let x1 = cos(angle) * (part.size - 5);
      let y1 = sin(angle) * (part.size - 5);
      let x2 = cos(angle) * part.size;
      let y2 = sin(angle) * part.size;
      
      beginShape();
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
      vertex(x2, y2, 10);
      vertex(x1, y1, 10);
      endShape(CLOSE);
    }
    
    // Central gear
    fill(30, 40, 50);
    sphere(part.size * 0.6, 8, 6);
    
    pop();
  }
  
  // Draw books falling
  for (let i = books.length - 1; i >= 0; i--) {
    let book = books[i];
    
    // Move book down
    book.y += bookFallSpeed;
    
    // Apply some rotation as it falls
    book.z += sin(book.y * 0.02) * 0.5;
    
    push();
    translate(book.x, book.y, book.z);
    rotateY(PI/4);
    rotateZ(PI/6);
    
    fill(book.color);
    noStroke();
    box(book.width, book.height, book.depth);
    
    pop();
    
    // Remove book if it's fallen too far
    if (book.y > 400) {
      books.splice(i, 1);
      
      // Add more dust when book is shredded
      for (let j = 0; j < 50; j++) {
        dustParticles.push({
          x: book.x + random(-20, 20),
          y: book.y,
          z: book.z + random(-20, 20),
          size: random(1, 3),
          speed: random(0.1, 0.5),
          life: random(100, 200)
        });
      }
      
      // Add new book
      books.push({
        x: random(-200, 200),
        y: -400,
        z: random(-100, 100),
        width: random(80, 120),
        height: random(10, 20),
        depth: random(5, 15),
        color: color(random(20, 40), 70, 80)
      });
    }
  }
  
  // Draw dust particles
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    let p = dustParticles[i];
    
    p.y -= p.speed;
    p.life--;
    
    if (p.life <= 0) {
      dustParticles.splice(i, 1);
      continue;
    }
    
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(50, 20, 80, 0.7);
    sphere(p.size, 4, 3);
    pop();
  }
  
  // Draw steam particles
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    let p = steamParticles[i];
    
    p.y -= p.speed;
    p.z += random(-0.2, 0.2);
    p.x += random(-0.2, 0.2);
    p.life--;
    
    if (p.life <= 0) {
      steamParticles.splice(i, 1);
      continue;
    }
    
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(180, 50, 100, 0.4);
    sphere(p.size, 6, 4);
    pop();
  }
  
  // Add new steam particles occasionally
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 3; i++) {
      steamParticles.push({
        x: random(-50, 50),
        y: 280,
        z: random(-50, 50),
        size: random(2, 6),
        speed: random(0.5, 1.5),
        life: random(100, 200)
      });
    }
  }
  
  // Add new dust occasionally
  if (frameCount % 5 === 0) {
    for (let i = 0; i < 2; i++) {
      dustParticles.push({
        x: random(-100, 100),
        y: random(50, 100),
        z: random(-100, 100),
        size: random(1, 3),
        speed: random(0.1, 0.3),
        life: random(200, 400)
      });
    }
  }
}
