let shelves = [];
let books = [];
let borrowed = [];
let ripplePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Create shelves
  for (let i = 0; i < 5; i++) {
    shelves.push({
      y: height * 0.2 + i * 80,
      width: width * 0.8,
      height: 10
    });
  }

  // Create books
  for (let i = 0; i < 30; i++) {
    const shelfIndex = floor(random(shelves.length));
    const shelf = shelves[shelfIndex];
    const x = shelf.width * 0.1 + (i % 6) * (shelf.width * 0.8 / 6);
    const y = shelf.y - 40;
    const w = shelf.width * 0.8 / 6 - 10;
    const h = 60;
    
    books.push({
      x, y, w, h,
      shelfIndex,
      borrowed: false,
      lift: 0,
      color: color(random(50, 150), random(50, 150), random(200, 255))
    });
  }
  
  borrowed = new Array(books.length).fill(false);
}

function draw() {
  background(10, 10, 20);
  ripplePhase += 0.02;
  
  // Draw shelves with subtle ripple
  for (let i = 0; i < shelves.length; i++) {
    const shelf = shelves[i];
    
    push();
    translate(shelf.width * 0.5 + sin(ripplePhase + i) * 2, shelf.y);
    
    // Shelf glow
    noStroke();
    fill(40, 40, 60, 100);
    rect(-shelf.width * 0.5, -shelf.height * 0.5, shelf.width, shelf.height);
    
    // Book highlights
    stroke(255, 255, 255, 30);
    strokeWeight(1);
    noFill();
    rect(-shelf.width * 0.5 + 10, -shelf.height * 0.5 + 3, shelf.width - 20, shelf.height - 6);
    
    pop();
  }
  
  // Draw books
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    push();
    
    if (book.borrowed) {
      book.lift = 5;
    } else {
      book.lift = lerp(book.lift, 0, 0.1);
    }
    
    translate(book.x + book.w * 0.5, book.y + book.h * 0.5 - book.lift);
    
    // Book glow
    drawingContext.shadowColor = book.color;
    drawingContext.shadowBlur = 15;
    
    fill(book.color);
    stroke(255, 255, 255, 40);
    strokeWeight(1);
    rect(-book.w * 0.5, -book.h * 0.5, book.w, book.h, 4);
    
    // Book spine
    fill(0, 0, 0, 60);
    noStroke();
    rect(-book.w * 0.5 + 2, -book.h * 0.5 + 2, 4, book.h - 4);
    
    pop();
  }
  
  // Highlight borrowed books
  for (let i = 0; i < books.length; i++) {
    if (books[i].borrowed) {
      const book = books[i];
      push();
      translate(book.x + book.w * 0.5, book.y + book.h * 0.5);
      
      fill(255, 255, 0, 30);
      noStroke();
      ellipse(0, -book.h * 0.4, book.w * 0.8, book.h * 0.3);
      
      pop();
    }
  }
  
  // Add subtle ambient glow
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = color(255, 255, 255, 20);
  fill(255, 255, 255, 5);
  rect(0, 0, width, height);
}

function mousePressed() {
  const mx = mouseX;
  const my = mouseY;
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    if (
      mx > book.x && 
      mx < book.x + book.w && 
      my > book.y && 
      my < book.y + book.h
    ) {
      books[i].borrowed = !books[i].borrowed;
      borrowed[i] = books[i].borrowed;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
