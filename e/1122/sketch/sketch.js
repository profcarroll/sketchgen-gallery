let gears = [];
let books = [];
let shreds = [];
let steam = [];
let splinters = [];
let residue = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create gears
  for (let i = 0; i < 5; i++) {
    gears.push({
      x: width/2,
      y: height/2 + i * 80,
      r: 40 + i * 10,
      speed: 0.02 + i * 0.01,
      direction: i % 2 === 0 ? 1 : -1
    });
  }
  
  // Create books
  for (let i = 0; i < 3; i++) {
    books.push({
      x: width/2,
      y: height/4 - i * 60,
      w: 80,
      h: 120,
      fallSpeed: 0,
      fallen: false
    });
  }
  
  // Initialize residue
  for (let i = 0; i < 20; i++) {
    residue.push({
      x: random(width),
      y: random(height/2, height),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(30);
  
  // Draw shredder base
  fill(80);
  rect(0, height/2 - 50, width, 100);
  
  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y);
    rotate(frameCount * gear.speed * gear.direction);
    
    fill(60);
    ellipse(0, 0, gear.r * 2);
    
    fill(120);
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i;
      let x = cos(angle) * (gear.r - 10);
      let y = sin(angle) * (gear.r - 10);
      ellipse(x, y, 5);
    }
    
    pop();
  }
  
  // Draw books
  for (let book of books) {
    if (!book.fallen) {
      fill(200, 180, 160);
      rect(book.x - book.w/2, book.y - book.h/2, book.w, book.h);
      
      // Book spine
      fill(150, 130, 110);
      rect(book.x - book.w/2, book.y - book.h/2, 10, book.h);
      
      // Fall book if it's the top one
      if (book === books[0]) {
        book.fallSpeed += 0.5;
        book.y += book.fallSpeed;
        
        if (book.y > height/2) {
          book.fallen = true;
          // Create shreds when book hits
          for (let i = 0; i < 100; i++) {
            shreds.push({
              x: book.x,
              y: book.y,
              vx: random(-3, 3),
              vy: random(-3, 3),
              size: random(2, 8),
              life: 255
            });
          }
        }
      }
    } else {
      // Draw fallen book
      fill(180, 160, 140);
      rect(book.x - book.w/2, book.y - book.h/2, book.w, book.h);
      
      // Add splinters
      if (frameCount % 5 === 0) {
        splinters.push({
          x: book.x + random(-book.w/2, book.w/2),
          y: book.y,
          vx: random(-1, 1),
          vy: random(-1, -3),
          size: random(2, 6)
        });
      }
    }
  }
  
  // Update and draw shreds
  for (let i = shreds.length - 1; i >= 0; i--) {
    let s = shreds[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 5;
    
    fill(200, 180, 160, s.life);
    ellipse(s.x, s.y, s.size);
    
    if (s.life <= 0) {
      shreds.splice(i, 1);
    }
  }
  
  // Update and draw splinters
  for (let i = splinters.length - 1; i >= 0; i--) {
    let s = splinters[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.2; // gravity
    
    fill(150, 130, 110);
    ellipse(s.x, s.y, s.size);
    
    if (s.y > height) {
      splinters.splice(i, 1);
    }
  }
  
  // Draw steam
  for (let i = 0; i < 5; i++) {
    let x = width/2 + random(-20, 20);
    let y = height/2 + random(-30, 30);
    fill(200, 200, 200, 100);
    ellipse(x, y, random(10, 30));
  }
  
  // Draw residue
  for (let r of residue) {
    fill(40);
    ellipse(r.x, r.y, r.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
