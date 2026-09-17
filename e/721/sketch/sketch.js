let books = [];
let gears = [];
let shredderParts = [];
let bookCount = 0;
let shredderActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create initial books
  for (let i = 0; i < 5; i++) {
    books.push({
      x: random(-200, 200),
      y: -300 + i * 150,
      z: random(-100, 100),
      width: 80,
      height: 100,
      depth: 20,
      rotation: 0,
      fallSpeed: random(0.5, 1.5),
      shredderY: 0
    });
  }
  
  // Create gears
  for (let i = 0; i < 8; i++) {
    gears.push({
      x: random(-300, 300),
      y: random(-200, 200),
      z: random(-150, 150),
      radius: random(30, 60),
      rotation: random(TWO_PI),
      spinSpeed: random(0.02, 0.05),
      teeth: floor(random(12, 24))
    });
  }
  
  // Create shredder components
  for (let i = 0; i < 12; i++) {
    shredderParts.push({
      x: random(-150, 150),
      y: random(-200, 0),
      z: random(-100, 100),
      width: random(10, 30),
      height: random(80, 120),
      rotation: random(TWO_PI),
      spinSpeed: random(0.05, 0.1)
    });
  }
}

function draw() {
  background(30, 40, 50);
  
  // Camera movement
  let time = millis() * 0.0005;
  camera(
    sin(time) * 800,
    sin(time * 0.5) * 200,
    cos(time) * 800,
    0, 0, 0,
    0, 1, 0
  );
  
  // Lighting
  pointLight(255, 255, 255, 0, -300, 500);
  ambientLight(80);
  
  // Draw floor
  fill(60, 70, 80);
  push();
  translate(0, 300, 0);
  rotateX(HALF_PI);
  plane(1000, 1000);
  pop();
  
  // Draw shredder base
  fill(80, 90, 100);
  push();
  translate(0, 250, 0);
  box(300, 10, 200);
  pop();
  
  // Draw shredder sides
  fill(70, 80, 90);
  push();
  translate(-150, 200, 0);
  box(20, 100, 200);
  pop();
  
  push();
  translate(150, 200, 0);
  box(20, 100, 200);
  pop();
  
  // Draw gears
  for (let gear of gears) {
    gear.rotation += gear.spinSpeed;
    
    fill(100, 100, 110);
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear outline
    stroke(50, 50, 60);
    strokeWeight(2);
    noFill();
    circle(0, 0, gear.radius * 2);
    noStroke();
    
    // Teeth
    fill(90, 90, 100);
    for (let i = 0; i < gear.teeth; i++) {
      let angle = (TWO_PI / gear.teeth) * i;
      let toothX = cos(angle) * gear.radius;
      let toothY = sin(angle) * gear.radius;
      
      push();
      translate(toothX, toothY);
      rotateZ(angle);
      rect(0, -5, 10, 10);
      pop();
    }
    
    pop();
  }
  
  // Draw shredder parts
  for (let part of shredderParts) {
    part.rotation += part.spinSpeed;
    
    fill(120, 130, 140);
    push();
    translate(part.x, part.y, part.z);
    rotateZ(part.rotation);
    box(part.width, part.height, 10);
    pop();
  }
  
  // Draw books
  for (let i = books.length - 1; i >= 0; i--) {
    let book = books[i];
    
    // Book falls
    book.y += book.fallSpeed;
    
    // Book rotation
    book.rotation += 0.02;
    
    // Book enters shredder
    if (book.y > 150 && !shredderActive) {
      shredderActive = true;
    }
    
    // Shredding effect
    if (book.y > 100 && book.y < 200) {
      book.width *= 0.995;
      book.height *= 0.995;
      book.depth *= 0.995;
      
      if (book.width < 10 || book.height < 10) {
        books.splice(i, 1);
        continue;
      }
    }
    
    // Draw book
    push();
    translate(book.x, book.y, book.z);
    rotateY(book.rotation);
    
    fill(150, 120, 80);
    box(book.width, book.height, book.depth);
    
    // Book spine
    fill(100, 70, 40);
    push();
    translate(-book.width/2, 0, 0);
    box(5, book.height, book.depth);
    pop();
    
    pop();
  }
  
  // Add new books periodically
  if (millis() % 1000 < 50 && bookCount < 20) {
    books.push({
      x: random(-200, 200),
      y: -300,
      z: random(-100, 100),
      width: 80,
      height: 100,
      depth: 20,
      rotation: 0,
      fallSpeed: random(0.5, 1.5),
      shredderY: 0
    });
    bookCount++;
  }
}
