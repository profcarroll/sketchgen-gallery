let books = [];
let debris = [];
let gears = [];
let shredder;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the shredder apparatus
  shredder = {
    x: 0,
    y: -height/4,
    z: 0,
    width: 200,
    height: 150,
    depth: 100,
    rotation: 0,
    gearRadius: 30,
    gearCount: 6
  };
  
  // Create initial books
  for (let i = 0; i < 8; i++) {
    books.push({
      x: random(-width/4, width/4),
      y: -height/6 - i * 30,
      z: random(-50, 50),
      width: random(40, 60),
      height: random(150, 200),
      depth: random(10, 20),
      color: color(random(10, 40), 50, 70 + random(20)),
      rotation: random(TWO_PI)
    });
  }
  
  // Create initial gears
  for (let i = 0; i < shredder.gearCount; i++) {
    gears.push({
      angle: i * TWO_PI / shredder.gearCount,
      radius: shredder.gearRadius + random(-5, 5),
      speed: random(0.02, 0.05)
    });
  }
}

function draw() {
  background(0);
  
  // Update shredder rotation
  shredder.rotation += 0.03;
  
  // Update gears
  for (let gear of gears) {
    gear.angle += gear.speed;
  }
  
  // Draw shredder apparatus
  drawShredder();
  
  // Draw books
  for (let book of books) {
    drawBook(book);
  }
  
  // Update and draw debris
  updateDebris();
  drawDebris();
  
  // Occasionally add new debris from shredding
  if (frameCount % 5 === 0) {
    createDebris();
  }
}

function drawShredder() {
  push();
  translate(shredder.x, shredder.y, shredder.z);
  
  // Main shredder box
  fill(30, 30, 40);
  stroke(0);
  box(shredder.width, shredder.height, shredder.depth);
  
  // Inner tearing plates
  for (let i = 0; i < 4; i++) {
    push();
    translate(0, -shredder.height/2 + i * 50, 0);
    fill(10, 20, 30);
    box(shredder.width - 20, 10, shredder.depth - 20);
    pop();
  }
  
  // Rotating gears
  for (let gear of gears) {
    push();
    rotateZ(gear.angle + shredder.rotation);
    translate(0, -shredder.height/2 + 50, 0);
    fill(10, 40, 60);
    sphere(gear.radius);
    pop();
  }
  
  pop();
}

function drawBook(book) {
  push();
  translate(book.x, book.y, book.z);
  rotateY(book.rotation);
  
  // Book cover
  fill(book.color);
  stroke(0);
  box(book.width, book.height, book.depth);
  
  // Book spine
  fill(10, 30, 40);
  push();
  translate(-book.width/2, 0, 0);
  box(5, book.height, book.depth);
  pop();
  
  // Book pages (simplified)
  for (let i = 0; i < 5; i++) {
    fill(30 + i * 5, 10, 80);
    push();
    translate(0, -book.height/2 + i * book.height/5, book.depth/2 - 2);
    box(book.width - 10, book.height/5 - 2, 4);
    pop();
  }
  
  pop();
}

function createDebris() {
  if (debris.length > 300) return;
  
  let debrisCount = random(1, 3);
  for (let i = 0; i < debrisCount; i++) {
    debris.push({
      x: shredder.x + random(-shredder.width/2, shredder.width/2),
      y: shredder.y - shredder.height/2,
      z: random(-shredder.depth/2, shredder.depth/2),
      size: random(2, 8),
      speedX: random(-2, 2),
      speedY: random(1, 3),
      speedZ: random(-1, 1),
      color: color(random(10, 40), 50, 40 + random(20)),
      lifetime: random(100, 200)
    });
  }
}

function updateDebris() {
  for (let i = debris.length - 1; i >= 0; i--) {
    let d = debris[i];
    d.x += d.speedX;
    d.y += d.speedY;
    d.z += d.speedZ;
    d.lifetime--;
    
    // Remove dead debris
    if (d.lifetime <= 0) {
      debris.splice(i, 1);
      continue;
    }
    
    // Apply gravity
    d.speedY += 0.1;
    
    // Apply some drag
    d.speedX *= 0.95;
    d.speedZ *= 0.95;
    
    // Check collision with books (simplified)
    for (let book of books) {
      let dx = d.x - book.x;
      let dy = d.y - book.y;
      let dz = d.z - book.z;
      
      if (abs(dx) < book.width/2 + d.size &&
          abs(dy) < book.height/2 + d.size &&
          abs(dz) < book.depth/2 + d.size) {
        // Embed debris in book
        d.x = book.x + dx;
        d.y = book.y + dy;
        d.z = book.z + dz;
        d.speedX = 0;
        d.speedY = 0;
        d.speedZ = 0;
      }
    }
  }
}

function drawDebris() {
  for (let d of debris) {
    push();
    translate(d.x, d.y, d.z);
    fill(d.color);
    noStroke();
    sphere(d.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
