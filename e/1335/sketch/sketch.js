let photos = [];
let scraps = [];
let numPhotos = 15;
let numScraps = 10;

function preload() {
  for (let i = 0; i < numPhotos; i++) {
    let url = `https://picsum.photos/seed/photo${i}/800/600`;
    let img = loadImage(url);
    photos.push(img);
  }
  
  for (let i = 0; i < numScraps; i++) {
    let url = `https://picsum.photos/seed/scrap${i}/400/300`;
    let img = loadImage(url);
    scraps.push(img);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noStroke();
  
  for (let img of photos) {
    img.pos = createVector(random(width), random(height));
    img.angle = random(360);
    img.speed = random(0.1, 0.3);
    img.rotationDir = random([-1, 1]);
    img.opacity = random(50, 150);
    img.scale = random(0.5, 1.5);
  }
  
  for (let img of scraps) {
    img.pos = createVector(random(width), random(height));
    img.angle = random(360);
    img.speed = random(0.05, 0.2);
    img.rotationDir = random([-1, 1]);
    img.opacity = random(80, 200);
    img.scale = random(0.3, 1.0);
  }
}

function draw() {
  background(245, 235, 220, 50);
  
  for (let scrap of scraps) {
    push();
    translate(scrap.pos.x, scrap.pos.y);
    rotate(scrap.angle);
    tint(255, scrap.opacity);
    image(scrap, -scrap.width * scrap.scale / 2, -scrap.height * scrap.scale / 2, 
          scrap.width * scrap.scale, scrap.height * scrap.scale);
    pop();
    
    scrap.pos.x += cos(scrap.angle) * scrap.speed * 0.5;
    scrap.pos.y += sin(scrap.angle) * scrap.speed * 0.5;
    scrap.angle += scrap.rotationDir * scrap.speed * 0.2;
    
    if (scrap.pos.x > width + 100) scrap.pos.x = -100;
    if (scrap.pos.x < -100) scrap.pos.x = width + 100;
    if (scrap.pos.y > height + 100) scrap.pos.y = -100;
    if (scrap.pos.y < -100) scrap.pos.y = height + 100;
  }
  
  for (let photo of photos) {
    push();
    translate(photo.pos.x, photo.pos.y);
    rotate(photo.angle);
    tint(255, photo.opacity);
    image(photo, -photo.width * photo.scale / 2, -photo.height * photo.scale / 2,
          photo.width * photo.scale, photo.height * photo.scale);
    pop();
    
    photo.pos.x += cos(photo.angle) * photo.speed * 0.3;
    photo.pos.y += sin(photo.angle) * photo.speed * 0.3;
    photo.angle += photo.rotationDir * photo.speed * 0.1;
    
    photo.pos.x += random(-0.5, 0.5);
    photo.pos.y += random(-0.5, 0.5);
    
    if (photo.pos.x > width + 150) photo.pos.x = -150;
    if (photo.pos.x < -150) photo.pos.x = width + 150;
    if (photo.pos.y > height + 150) photo.pos.y = -150;
    if (photo.pos.y < -150) photo.pos.y = height + 150;
  }
}

function mousePressed() {
  for (let photo of photos) {
    photo.pos = createVector(random(width), random(height));
    photo.angle = random(360);
    photo.opacity = random(100, 200);
    photo.scale = random(0.6, 1.4);
  }
  
  for (let scrap of scraps) {
    scrap.pos = createVector(random(width), random(height));
    scrap.angle = random(360);
    scrap.opacity = random(150, 255);
    scrap.scale = random(0.4, 0.9);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
