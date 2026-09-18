let books = [];
let sparks = [];
let steam = [];
let shredder;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the shredding machine
  shredder = {
    x: width / 2,
    y: height * 0.4,
    width: 200,
    height: 150,
    gears: [],
    plates: []
  };
  
  // Initialize gears
  for (let i = 0; i < 5; i++) {
    shredder.gears.push({
      x: shredder.x - 80 + i * 40,
      y: shredder.y + 20,
      radius: 15 + random(5),
      rotation: random(TWO_PI),
      speed: random(0.02, 0.05)
    });
  }
  
  // Initialize plates
  for (let i = 0; i < 3; i++) {
    shredder.plates.push({
      x: shredder.x - 60 + i * 40,
      y: shredder.y + 80,
      width: 20,
      height: 15,
      speed: random(0.01, 0.03)
    });
  }
  
  // Create initial books
  for (let i = 0; i < 15; i++) {
    books.push({
      x: width / 2 + random(-100, 100),
      y: height * 0.1,
      width: 40,
      height: 60,
      rotation: random(TWO_PI),
      speed: random(0.5, 1.5),
      color: color(random(20, 40), 80, 90)
    });
  }
}

function draw() {
  background(220, 20, 10);
  
  // Draw the shredder machine
  fill(30, 30, 30);
  rect(shredder.x - shredder.width/2, shredder.y, shredder.width, shredder.height);
  
  // Draw machine details
  fill(50, 50, 50);
  rect(shredder.x - shredder.width/2 + 10, shredder.y + 10, shredder.width - 20, 20);
  rect(shredder.x - shredder.width/2 + 10, shredder.y + 120, shredder.width - 20, 20);
  
  // Draw gears
  for (let gear of shredder.gears) {
    gear.rotation += gear.speed;
    push();
    translate(gear.x, gear.y);
    rotate(gear.rotation);
    
    fill(40, 40, 40);
    ellipse(0, 0, gear.radius * 2);
    
    // Gear teeth
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI / 12 * i;
      let x = cos(angle) * (gear.radius - 5);
      let y = sin(angle) * (gear.radius - 5);
      fill(60, 60, 60);
      ellipse(x, y, 3, 3);
    }
    pop();
    
    // Sparks from gears
    if (random() < 0.3) {
      sparks.push({
        x: gear.x + random(-10, 10),
        y: gear.y + random(-10, 10),
        size: random(2, 6),
        life: 255,
        color: color(random(20, 40), 100, 100)
      });
    }
  }
  
  // Draw plates
  for (let plate of shredder.plates) {
    plate.y += plate.speed;
    if (plate.y > shredder.y + 100) {
      plate.y = shredder.y + 60;
    }
    
    fill(50, 50, 50);
    rect(plate.x - plate.width/2, plate.y, plate.width, plate.height);
    
    // Steam from plates
    if (random() < 0.4) {
      steam.push({
        x: plate.x + random(-5, 5),
        y: plate.y,
        size: random(10, 20),
        life: 255,
        speed: random(0.5, 1)
      });
    }
  }
  
  // Update and draw books
  for (let i = books.length - 1; i >= 0; i--) {
    let book = books[i];
    
    // Book falls down
    book.y += book.speed;
    book.rotation += book.speed * 0.02;
    
    // Check if book reaches shredder
    if (book.y > shredder.y - 30) {
      // Book is shredded into pieces
      for (let j = 0; j < 5; j++) {
        sparks.push({
          x: book.x + random(-20, 20),
          y: book.y + random(-10, 10),
          size: random(3, 8),
          life: 255,
          color: book.color
        });
      }
      
      // Remove book and add new one
      books.splice(i, 1);
      books.push({
        x: width / 2 + random(-100, 100),
        y: height * 0.1,
        width: 40,
        height: 60,
        rotation: random(TWO_PI),
        speed: random(0.5, 1.5),
        color: color(random(20, 40), 80, 90)
      });
    } else {
      // Draw book
      push();
      translate(book.x, book.y);
      rotate(book.rotation);
      
      fill(book.color);
      rect(-book.width/2, -book.height/2, book.width, book.height);
      
      // Book spine
      fill(10, 30, 30);
      rect(-book.width/2 + 5, -book.height/2, 5, book.height);
      
      pop();
    }
  }
  
  // Update and draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let spark = sparks[i];
    spark.x += random(-1, 1);
    spark.y -= random(0.5, 2);
    spark.life -= 5;
    
    if (spark.life <= 0) {
      sparks.splice(i, 1);
    } else {
      fill(spark.color, spark.life);
      noStroke();
      ellipse(spark.x, spark.y, spark.size);
    }
  }
  
  // Update and draw steam
  for (let i = steam.length - 1; i >= 0; i--) {
    let s = steam[i];
    s.y -= s.speed;
    s.life -= 2;
    s.size += 0.2;
    
    if (s.life <= 0) {
      steam.splice(i, 1);
    } else {
      fill(200, 50, 90, s.life / 255 * 0.5);
      noStroke();
      ellipse(s.x, s.y, s.size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
