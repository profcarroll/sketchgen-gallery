let photos = [];
let scraps = [];
let numPhotos = 8;
let numScraps = 6;
let photoTextures = [];
let scrapTextures = [];

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
    img.speed = random(0.05, 0.15);
    img.rotationDir = random([-1, 1]);
    img.opacity = random(80, 180);
    img.scale = random(0.4, 0.8);
    img.waitPhase = random(TWO_PI);
  }
  
  for (let img of scraps) {
    img.pos = createVector(random(width), random(height));
    img.angle = random(360);
    img.speed = random(0.05, 0.12);
    img.rotationDir = random([-1, 1]);
    img.opacity = random(120, 220);
    img.scale = random(0.3, 0.6);
    img.waitPhase = random(TWO_PI);
  }
  
  // Precompute edge textures for scraps
  for (let img of scraps) {
    let pg = createGraphics(80, 60);
    pg.image(img, 0, 0, 80, 60);
    pg.filter(THRESHOLD, 0.5);
    // Add white border for frayed effect
    pg.stroke(255);
    pg.strokeWeight(1);
    for (let i = 0; i < 3; i++) {
      pg.rect(0, 0, 80, 60);
      pg.fill(255, 100);
      pg.noStroke();
      pg.rect(i, i, 80 - 2*i, 60 - 2*i);
    }
    img.edgeTex = pg;
  }
}

function draw() {
  background(245, 235, 220, 30);
  
  let time = millis() * 0.001;
  
  // Draw scraps
  for (let scrap of scraps) {
    push();
    translate(scrap.pos.x, scrap.pos.y);
    rotate(scrap.angle);
    
    // Draw base image
    tint(255, scrap.opacity);
    image(scrap, -scrap.width * scrap.scale / 2, -scrap.height * scrap.scale / 2,
          scrap.width * scrap.scale, scrap.height * scrap.scale);
    
    // Draw frayed edge overlay
    noTint();
    image(scrap.edgeTex, -scrap.width * scrap.scale / 2, -scrap.height * scrap.scale / 2,
          scrap.width * scrap.scale, scrap.height * scrap.scale);
    pop();
    
    // Movement logic
    let shouldMove = sin(time + scrap.waitPhase) > 0;
    let moveIntensity = abs(sin(time + scrap.waitPhase)) * scrap.speed * 1.5;
    
    if (shouldMove) {
      scrap.pos.x += cos(scrap.angle) * moveIntensity;
      scrap.pos.y += sin(scrap.angle) * moveIntensity;
      scrap.angle += scrap.rotationDir * scrap.speed * 0.5;
    }
    
    // Wrap around
    if (scrap.pos.x > width + 100) scrap.pos.x = -100;
    if (scrap.pos.x < -100) scrap.pos.x = width + 100;
    if (scrap.pos.y > height + 100) scrap.pos.y = -100;
    if (scrap.pos.y < -100) scrap.pos.y = height + 100;
  }
  
  // Draw photos
  for (let photo of photos) {
    push();
    translate(photo.pos.x, photo.pos.y);
    rotate(photo.angle);
    tint(255, photo.opacity);
    image(photo, -photo.width * photo.scale / 2, -photo.height * photo.scale / 2,
          photo.width * photo.scale, photo.height * photo.scale);
    pop();
    
    // Movement with occasional stillness
    let shouldMove = sin(millis() * 0.001 + photo.waitPhase) > 0;
    let moveIntensity = abs(sin(millis() * 0.001 + photo.waitPhase)) * photo.speed * 2;
    
    if (shouldMove) {
      photo.pos.x += cos(photo.angle) * moveIntensity;
      photo.pos.y += sin(photo.angle) * moveIntensity;
      photo.angle += photo.rotationDir * photo.speed * 0.3;
    }
    
    // Wrap around
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
    photo.scale = random(0.5, 1.0);
    photo.waitPhase = random(TWO_PI);
  }
  
  for (let scrap of scraps) {
    scrap.pos = createVector(random(width), random(height));
    scrap.angle = random(360);
    scrap.opacity = random(150, 255);
    scrap.scale = random(0.4, 0.8);
    scrap.waitPhase = random(TWO_PI);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
