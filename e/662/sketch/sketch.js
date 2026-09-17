let books = [];
let gears = [];
let sparks = [];
let shredder;
let stackTilt = 0;
let stackTiltDirection = 1;
let stackFall = false;
let fallSpeed = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create books
  for (let i = 0; i < 15; i++) {
    books.push({
      x: 0,
      y: -200 + i * 25,
      z: 0,
      w: 100,
      h: 20,
      d: 20,
      rot: 0
    });
  }

  // Create gears
  for (let i = 0; i < 8; i++) {
    gears.push({
      x: -150 + i * 40,
      y: 50,
      z: 0,
      r: 30,
      rot: i * 0.5,
      speed: 0.02 + (i % 3) * 0.01
    });
  }

  // Shredder base
  shredder = {
    x: 0,
    y: 150,
    z: 0,
    w: 200,
    h: 30,
    d: 200
  };
}

function draw() {
  background(20);
  
  // Camera movement for dramatic effect
  let time = millis() * 0.0005;
  camera(
    sin(time) * 400,
    100 + sin(time * 0.5) * 50,
    cos(time) * 400,
    0, 0, 0,
    0, 1, 0
  );

  // Stack tilt animation
  if (!stackFall) {
    stackTilt += 0.01 * stackTiltDirection;
    if (stackTilt > 0.2) stackTiltDirection = -1;
    if (stackTilt < -0.2) stackTiltDirection = 1;
    
    // Start falling after a while
    if (abs(stackTilt) > 0.15 && frameCount > 180) {
      stackFall = true;
      fallSpeed = 1;
    }
  } else {
    // Fall down
    for (let book of books) {
      book.y += fallSpeed;
      book.rot += 0.05;
      fallSpeed *= 1.02;
    }
    
    // Stop falling when books reach shredder
    if (books[books.length - 1].y > 180) {
      for (let book of books) {
        book.y = 180;
        book.rot = 0;
      }
    }
  }

  // Draw gears
  for (let gear of gears) {
    gear.rot += gear.speed;
    push();
    translate(gear.x, gear.y, gear.z);
    rotateY(gear.rot);
    
    // Gear teeth
    fill(180, 160, 120);
    sphere(gear.r, 16, 8);
    
    // Inner hole
    fill(80, 70, 50);
    sphere(gear.r * 0.4, 8, 4);
    
    pop();
    
    // Sparks from gears
    if (frameCount % 3 === 0) {
      sparks.push({
        x: gear.x + random(-gear.r, gear.r),
        y: gear.y + random(-gear.r, gear.r),
        z: gear.z + random(-gear.r, gear.r),
        vx: random(-1, 1),
        vy: random(-1, 1),
        vz: random(-1, 1),
        life: 20
      });
    }
  }

  // Draw books
  for (let book of books) {
    push();
    translate(book.x, book.y, book.z);
    rotateY(stackTilt);
    rotateX(book.rot);
    
    if (stackFall) {
      // Books falling and rotating
      fill(150, 100, 80);
      box(book.w, book.h, book.d);
      
      // Add some detail to books
      fill(120, 80, 60);
      for (let i = 0; i < 3; i++) {
        push();
        translate(-book.w/2 + 10 + i * 30, 0, book.d/2 - 1);
        box(20, book.h, 2);
        pop();
      }
    } else {
      // Stack before falling
      fill(150, 100, 80);
      box(book.w, book.h, book.d);
      
      // Add some detail to books
      fill(120, 80, 60);
      for (let i = 0; i < 3; i++) {
        push();
        translate(-book.w/2 + 10 + i * 30, 0, book.d/2 - 1);
        box(20, book.h, 2);
        pop();
      }
    }
    
    pop();
  }

  // Draw shredder
  push();
  translate(shredder.x, shredder.y, shredder.z);
  fill(100, 100, 120);
  box(shredder.w, shredder.h, shredder.d);
  
  // Shredder blades
  for (let i = 0; i < 8; i++) {
    push();
    translate(-shredder.w/2 + 20 + i * 25, -shredder.h/2, 0);
    fill(180, 160, 140);
    box(10, 50, 10);
    pop();
  }
  
  pop();

  // Draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.z += s.vz;
    s.life--;
    
    if (s.life <= 0) {
      sparks.splice(i, 1);
      continue;
    }
    
    push();
    translate(s.x, s.y, s.z);
    fill(255, 200, 0, s.life * 10);
    sphere(2, 4, 3);
    pop();
  }

  // Add some sparks from shredder
  if (stackFall && frameCount % 2 === 0) {
    for (let i = 0; i < 3; i++) {
      sparks.push({
        x: random(-shredder.w/2, shredder.w/2),
        y: shredder.y - shredder.h/2,
        z: random(-shredder.d/2, shredder.d/2),
        vx: random(-1, 1),
        vy: random(-2, -0.5),
        vz: random(-1, 1),
        life: 30
      });
    }
  }

  // Add more sparks when books fall
  if (stackFall && frameCount % 5 === 0) {
    for (let book of books) {
      if (book.y > 100) {
        sparks.push({
          x: book.x + random(-book.w/2, book.w/2),
          y: book.y + random(-book.h/2, book.h/2),
          z: book.z + random(-book.d/2, book.d/2),
          vx: random(-1, 1),
          vy: random(-2, -0.5),
          vz: random(-1, 1),
          life: 25
        });
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
