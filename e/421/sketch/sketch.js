let books = [];
let gears = [];
let shredder;
let backgroundImg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a muted academic background
  backgroundImg = createGraphics(width, height);
  backgroundImg.background(240, 235, 225);
  backgroundImg.noStroke();
  for (let i = 0; i < 100; i++) {
    backgroundImg.fill(220, 215, 205);
    backgroundImg.rect(random(width), random(height), random(5, 20), random(5, 20));
  }
  
  // Initialize books - tall stack
  for (let i = 0; i < 30; i++) {
    books.push({
      x: width/2,
      y: height/2 - i * 30,
      w: random(80, 120),
      h: 25,
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      shrink: 0
    });
  }
  
  // Initialize gears
  for (let i = 0; i < 8; i++) {
    gears.push({
      x: width * 0.1 + i * 30,
      y: height * 0.7,
      r: random(15, 25),
      rotation: 0,
      speed: random(0.02, 0.05)
    });
  }
  
  // Initialize shredder
  shredder = {
    x: width * 0.1,
    y: height/2,
    mouthWidth: 40,
    mouthHeight: 80,
    open: true,
    openTimer: 0,
    openDuration: 60,
    closeSpeed: 0.05
  };
}

function draw() {
  image(backgroundImg, 0, 0);
  
  // Update and draw gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    drawGear(gear);
  }
  
  // Update and draw books
  for (let i = books.length - 1; i >= 0; i--) {
    let book = books[i];
    book.shrink += 0.02;
    
    if (book.shrink > 1) {
      // Remove book when fully shrunk
      books.splice(i, 1);
      continue;
    }
    
    // Shrink book and make it fall
    let shrinkFactor = 1 - book.shrink * 0.8;
    let newX = book.x;
    let newY = book.y + book.shrink * 5;
    
    fill(book.color);
    noStroke();
    rect(newX - book.w * shrinkFactor / 2, newY, book.w * shrinkFactor, book.h * shrinkFactor);
  }
  
  // Update and draw shredder
  updateShredder();
  drawShredder();
}

function updateShredder() {
  shredder.openTimer++;
  if (shredder.openTimer > shredder.openDuration) {
    shredder.open = !shredder.open;
    shredder.openTimer = 0;
  }
  
  // Move shredder towards books
  if (books.length > 0) {
    let closestBook = books[books.length - 1];
    let targetX = closestBook.x - closestBook.w / 2 - 50;
    shredder.x += (targetX - shredder.x) * 0.03;
  }
}

function drawShredder() {
  // Draw mechanical base
  fill(100);
  rect(shredder.x, shredder.y - 40, 100, 80);
  
  // Draw rotating parts
  fill(150);
  ellipse(shredder.x + 30, shredder.y, 20, 20);
  ellipse(shredder.x + 70, shredder.y, 20, 22);
  
  // Draw mouth
  noFill();
  stroke(50);
  strokeWeight(3);
  if (shredder.open) {
    arc(shredder.x + 100, shredder.y, shredder.mouthWidth, shredder.mouthHeight, PI, TWO_PI, OPEN);
  } else {
    // Draw closed mouth
    rect(shredder.x + 100, shredder.y - shredder.mouthHeight/2, 10, shredder.mouthHeight);
  }
}

function drawGear(gear) {
  push();
  translate(gear.x, gear.y);
  rotate(gear.rotation);
  
  // Draw gear circle
  fill(180);
  noStroke();
  ellipse(0, 0, gear.r * 2, gear.r * 2);
  
  // Draw gear teeth
  stroke(100);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI / 12 * i;
    let x1 = cos(angle) * gear.r;
    let y1 = sin(angle) * gear.r;
    let x2 = cos(angle) * (gear.r - 8);
    let y2 = sin(angle) * (gear.r - 8);
    line(x1, y1, x2, y2);
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
