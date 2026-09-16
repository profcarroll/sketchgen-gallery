let books = [];
let shredder;
let shakeIntensity = 0;
let collapseStarted = false;
let collapseProgress = 0;
let bookHeight = 30;
let bookWidth = 200;
let bookDepth = 15;
let bookCount = 8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create books
  for (let i = 0; i < bookCount; i++) {
    books.push({
      x: 0,
      y: -bookHeight * (bookCount / 2) + i * bookHeight,
      z: 0,
      rotation: 0,
      cracks: [],
      isShaking: false
    });
  }

  // Create shredder
  shredder = {
    x: 300,
    y: 0,
    width: 150,
    height: 200,
    teeth: 20,
    active: false
  };

  // Initialize cracks for books
  for (let book of books) {
    book.cracks = [];
    for (let i = 0; i < 8; i++) {
      book.cracks.push({
        x: random(-bookWidth/2, bookWidth/2),
        y: random(-bookHeight/2, bookHeight/2),
        length: random(10, 30),
        angle: random(TWO_PI)
      });
    }
  }

  frameRate(30);
}

function draw() {
  background(220, 50, 90);

  // Move camera
  let time = millis() / 1000;
  let camX = sin(time * 0.2) * 200;
  let camY = cos(time * 0.3) * 100;
  let camZ = 600 + sin(time * 0.1) * 200;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Start shaking after a delay
  if (frameCount > 150 && !collapseStarted) {
    shakeIntensity = map(frameCount, 150, 200, 0, 1);
    for (let book of books) {
      book.isShaking = true;
    }
  }

  // Start collapse
  if (frameCount > 200 && !collapseStarted) {
    collapseStarted = true;
  }

  if (collapseStarted) {
    collapseProgress += 0.01;
    if (collapseProgress > 1) collapseProgress = 1;
  }

  // Draw shredder
  push();
  translate(shredder.x, shredder.y);
  rotateY(PI/2);
  fill(50, 80, 30);
  noStroke();
  box(shredder.width, shredder.height, 30);
  
  // Teeth
  fill(30, 70, 40);
  for (let i = 0; i < shredder.teeth; i++) {
    let angle = map(i, 0, shredder.teeth, 0, TWO_PI);
    let x = cos(angle) * shredder.width/2;
    let y = sin(angle) * shredder.height/2;
    push();
    translate(x, y, 15);
    rotateZ(angle + PI/2);
    box(5, 30, 5);
    pop();
  }
  
  // Shredding effect
  if (collapseProgress > 0.5) {
    fill(200, 80, 60, 0.5);
    noStroke();
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 10, 0, TWO_PI);
      let x = cos(angle) * (shredder.width/2 + 20 + sin(time*5+i)*10);
      let y = sin(angle) * (shredder.height/2 + 20 + cos(time*3+i)*10);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
  }
  
  pop();

  // Draw books
  for (let i = 0; i < books.length; i++) {
    let book = books[i];
    
    push();
    
    // Apply shake and collapse
    if (book.isShaking) {
      book.rotation = sin(time * 3 + i) * shakeIntensity * 0.2;
    }
    
    if (collapseStarted && i === books.length - 1) {
      book.y += 5;
      book.rotation = map(collapseProgress, 0, 1, 0, PI/4);
    }
    
    translate(book.x, book.y, book.z);
    rotateY(book.rotation);
    
    // Book cover
    fill(30, 100, 70 + sin(time*2+i)*20);
    stroke(20, 80, 50);
    strokeWeight(1);
    box(bookWidth, bookHeight, bookDepth);
    
    // Spine
    fill(10, 90, 40);
    noStroke();
    translate(-bookWidth/2 - 1, 0, 0);
    box(5, bookHeight, bookDepth);
    
    // Cracks
    if (book.isShaking || collapseStarted) {
      stroke(200, 100, 100);
      strokeWeight(1);
      for (let crack of book.cracks) {
        let x1 = crack.x;
        let y1 = crack.y;
        let x2 = x1 + cos(crack.angle) * crack.length;
        let y2 = y1 + sin(crack.angle) * crack.length;
        line(x1, y1, x2, y2);
      }
    }
    
    pop();
  }

  // Collapse books that have fallen
  if (collapseStarted && collapseProgress > 0.7) {
    for (let i = books.length - 1; i >= 0; i--) {
      let book = books[i];
      if (book.y > 0) {
        book.y += 3;
        book.rotation += 0.05;
        book.x = map(collapseProgress, 0.7, 1, 0, 150);
      }
    }
  }

  // Reset after all books are gone
  if (collapseProgress > 1) {
    books = [];
    for (let i = 0; i < bookCount; i++) {
      books.push({
        x: 0,
        y: -bookHeight * (bookCount / 2) + i * bookHeight,
        z: 0,
        rotation: 0,
        cracks: [],
        isShaking: false
      });
    }
    collapseStarted = false;
    collapseProgress = 0;
    shakeIntensity = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
