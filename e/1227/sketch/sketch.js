let books = [];
let gears = [];
let sparks = [];
let steam = [];
let debris = [];
let bookStack;
let shredder;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create book stack
  bookStack = {
    x: 0,
    y: -150,
    z: 0,
    width: 200,
    height: 300,
    depth: 20,
    books: []
  };

  for (let i = 0; i < 15; i++) {
    bookStack.books.push({
      x: bookStack.x,
      y: bookStack.y + i * 20,
      z: bookStack.z,
      width: bookStack.width,
      height: 20,
      depth: bookStack.depth,
      color: color(150, 100, 50)
    });
  }

  // Create shredder
  shredder = {
    x: 0,
    y: 150,
    z: 0,
    width: 250,
    height: 300,
    depth: 250,
    gears: []
  };

  for (let i = 0; i < 5; i++) {
    shredder.gears.push({
      x: 0,
      y: 150 + i * 60,
      z: 0,
      radius: 30,
      rotation: 0
    });
  }

  // Initialize particles
  for (let i = 0; i < 200; i++) {
    sparks.push({
      x: random(-100, 100),
      y: random(100, 200),
      z: random(-100, 100),
      size: random(1, 3),
      speed: random(0.5, 2),
      life: random(20, 40)
    });
  }

  for (let i = 0; i < 300; i++) {
    debris.push({
      x: random(-50, 50),
      y: random(150, 250),
      z: random(-50, 50),
      size: random(1, 4),
      speed: random(0.5, 3),
      life: random(20, 60)
    });
  }

  for (let i = 0; i < 100; i++) {
    steam.push({
      x: random(-100, 100),
      y: random(150, 200),
      z: random(-100, 100),
      size: random(5, 15),
      speed: random(0.1, 0.5),
      life: random(30, 80)
    });
  }
}

function draw() {
  background(0);

  // Ambient lighting
  ambientLight(50);
  pointLight(255, 255, 255, 0, -200, 0);

  // Draw book stack
  push();
  translate(bookStack.x, bookStack.y, bookStack.z);
  for (let book of bookStack.books) {
    fill(book.color);
    noStroke();
    box(book.width, book.height, book.depth);
  }
  pop();

  // Draw shredder
  push();
  translate(shredder.x, shredder.y, shredder.z);
  fill(100);
  noStroke();
  box(shredder.width, shredder.height, shredder.depth);

  // Draw gears
  for (let gear of shredder.gears) {
    gear.rotation += 0.05;
    push();
    translate(gear.x, gear.y, gear.z);
    rotateX(gear.rotation);
    fill(180);
    noStroke();
    sphere(gear.radius, 6, 4);
    pop();
  }

  // Draw shredder blades
  for (let i = 0; i < 8; i++) {
    push();
    translate(0, 150 + i * 30, 0);
    rotateZ(frameCount * 0.02);
    fill(150);
    noStroke();
    box(10, 40, 10);
    pop();
  }

  pop();

  // Update and draw sparks
  beginShape(POINTS);
  for (let i = sparks.length - 1; i >= 0; i--) {
    let s = sparks[i];
    s.x += random(-0.5, 0.5);
    s.y -= s.speed;
    s.z += random(-0.5, 0.5);
    s.life--;
    
    if (s.life <= 0) {
      sparks.splice(i, 1);
      continue;
    }

    fill(255, 200, 0, s.life * 6);
    noStroke();
    vertex(s.x, s.y, s.z);
  }
  endShape();

  // Update and draw debris
  beginShape(POINTS);
  for (let i = debris.length - 1; i >= 0; i--) {
    let d = debris[i];
    d.x += random(-0.3, 0.3);
    d.y -= d.speed;
    d.z += random(-0.3, 0.3);
    d.life--;
    
    if (d.life <= 0) {
      debris.splice(i, 1);
      continue;
    }

    fill(200, 150, 100, d.life * 4);
    noStroke();
    vertex(d.x, d.y, d.z);
  }
  endShape();

  // Update and draw steam
  beginShape(POINTS);
  for (let i = steam.length - 1; i >= 0; i--) {
    let st = steam[i];
    st.x += random(-0.2, 0.2);
    st.y -= st.speed;
    st.z += random(-0.2, 0.2);
    st.life--;
    
    if (st.life <= 0) {
      steam.splice(i, 1);
      continue;
    }

    fill(255, 255, 255, st.life * 3);
    noStroke();
    vertex(st.x, st.y, st.z);
  }
  endShape();

  // Add new particles occasionally
  if (frameCount % 10 === 0) {
    sparks.push({
      x: random(-50, 50),
      y: 200,
      z: random(-50, 50),
      size: random(1, 3),
      speed: random(0.5, 2),
      life: random(20, 40)
    });
  }

  if (frameCount % 5 === 0) {
    debris.push({
      x: random(-30, 30),
      y: 200,
      z: random(-30, 30),
      size: random(1, 4),
      speed: random(0.5, 3),
      life: random(20, 60)
    });
  }

  if (frameCount % 7 === 0) {
    steam.push({
      x: random(-50, 50),
      y: 200,
      z: random(-50, 50),
      size: random(5, 15),
      speed: random(0.1, 0.5),
      life: random(30, 80)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
