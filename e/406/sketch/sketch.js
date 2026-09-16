let books = [];
let feeder;
let bookWidth = 80;
let bookHeight = 120;
let pileHeight = 0;
let machineSpeed = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a neat pile of books
  for (let i = 0; i < 15; i++) {
    books.push({
      x: width / 2 - bookWidth / 2,
      y: height - 50 - pileHeight,
      w: bookWidth,
      h: bookHeight,
      consumed: false
    });
    pileHeight += bookHeight + 10;
  }
  feeder = {
    x: width + 200,
    y: height - 200,
    width: 150,
    height: 100,
    open: true,
    openTime: 0
  };
}

function draw() {
  background(240);
  
  // Draw floor
  fill(180);
  noStroke();
  rect(0, height - 30, width, 30);
  
  // Update and draw feeder machine
  feeder.x -= machineSpeed;
  feeder.openTime += 0.1;
  feeder.open = sin(feeder.openTime) > 0;
  
  // Draw machine body
  fill(100);
  rect(feeder.x, feeder.y, feeder.width, feeder.height);
  
  // Draw mandibles
  fill(80);
  if (feeder.open) {
    rect(feeder.x - 20, feeder.y, 20, feeder.height);
    rect(feeder.x + feeder.width, feeder.y, 20, feeder.height);
  } else {
    rect(feeder.x - 10, feeder.y, 10, feeder.height);
    rect(feeder.x + feeder.width, feeder.y, 10, feeder.height);
  }
  
  // Draw books
  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    
    if (!book.consumed) {
      // Draw book cover
      fill(120, 80, 60);
      noStroke();
      rect(book.x, book.y, book.w, book.h);
      
      // Draw spine
      fill(100, 70, 50);
      rect(book.x - 5, book.y, 5, book.h);
      
      // Draw title text (simplified)
      fill(255);
      textSize(10);
      textAlign(CENTER);
      text("Book", book.x + book.w/2, book.y + book.h/2);
    } else {
      // Book is consumed - fade out
      let alpha = map(book.y, height, 0, 0, 255);
      if (alpha > 0) {
        fill(120, 80, 60, alpha);
        noStroke();
        rect(book.x, book.y, book.w, book.h);
      }
    }
    
    // Move books toward machine
    if (!book.consumed && book.x > feeder.x + feeder.width/2 - bookWidth/2) {
      book.x -= 1;
      book.y += 0.5;
    }
    
    // Consume book when it reaches machine
    if (!book.consumed && book.x <= feeder.x + feeder.width/2 - bookWidth/2) {
      book.consumed = true;
      book.y = height + 100; // Move off screen to simulate disappearance
    }
  }
  
  // Reset machine when it goes off screen
  if (feeder.x < -200) {
    feeder.x = width + 200;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
