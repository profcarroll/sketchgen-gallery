let photos = [];
let scraps = [];
let numPhotos = 8;
let numScraps = 6;
let time = 0;

function preload() {
  for (let i = 0; i < numPhotos; i++) {
    let url = `https://picsum.photos/seed/photo${i}/800/600`;
    let img = loadImage(url, () => {
      applySepiaToImage(img);
    });
    photos.push(img);
  }
  
  for (let i = 0; i < numScraps; i++) {
    let url = `https://picsum.photos/seed/scrap${i}/400/300`;
    let img = loadImage(url, () => {
      applySepiaToImage(img);
    });
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
    img.tearNoise = random(TWO_PI);
  }
}

function draw() {
  background(245, 235, 220, 30);
  time = millis() * 0.001;
  
  // Draw scraps with torn edges
  for (let scrap of scraps) {
    push();
    translate(scrap.pos.x, scrap.pos.y);
    rotate(scrap.angle);
    
    // Draw with opacity using tint
    tint(255, scrap.opacity);
    image(scrap, -scrap.width * scrap.scale / 2, -scrap.height * scrap.scale / 2,
          scrap.width * scrap.scale, scrap.height * scrap.scale);
    
    // Draw torn paper edge with frayed fibers
    drawTornEdge(scrap, scrap.scale);
    pop();
    
    // Movement logic with moments of stillness
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
  
  // Draw photos with sepia tone (pre-applied in preload)
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

function applySepiaToImage(img) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    
    let nr = min(255, r * 0.393 + g * 0.769 + b * 0.189);
    let ng = min(255, r * 0.349 + g * 0.686 + b * 0.168);
    let nb = min(255, r * 0.272 + g * 0.534 + b * 0.131);
    
    img.pixels[i] = nr;
    img.pixels[i + 1] = ng;
    img.pixels[i + 2] = nb;
  }
  img.updatePixels();
}

function drawTornEdge(img, scale) {
  let w = img.width * scale;
  let h = img.height * scale;
  
  let noiseScale = 0.02;
  let tearNoise = img.tearNoise;
  
  // Draw torn edges with single shape calls per side
  stroke(139, 69, 19);
  strokeWeight(1.5);
  
  noFill();
  
  // Top edge
  beginShape();
  for (let x = 0; x <= w; x += 5) {
    let y = h * 0.1 + sin(x * noiseScale + time * 0.5 + tearNoise) * 3;
    vertex(x, y);
  }
  endShape();
  
  // Bottom edge
  beginShape();
  for (let x = w; x >= 0; x -= 5) {
    let y = h * 0.9 + cos(x * noiseScale + time * 0.3 + tearNoise) * 4;
    vertex(x, y);
  }
  endShape();
  
  // Left edge
  beginShape();
  for (let y = 0; y <= h; y += 5) {
    let x = w * 0.1 + sin(y * noiseScale + time * 0.7 + tearNoise) * 3;
    vertex(x, y);
  }
  endShape();
  
  // Right edge
  beginShape();
  for (let y = h; y >= 0; y -= 5) {
    let x = w * 0.9 + cos(y * noiseScale + time * 0.4 + tearNoise) * 4;
    vertex(x, y);
  }
  endShape();
  
  // Draw frayed fibers on torn edges
  stroke(255, 200, 150);
  strokeWeight(0.8);
  
  // Top edge fibers
  for (let x = 0; x < w; x += 10) {
    let baseY = h * 0.1 + sin(x * noiseScale + time * 0.5 + tearNoise) * 3;
    let fibers = int(abs(noise(x * 0.1, time * 2)) * 4);
    for (let f = 0; f < fibers; f++) {
      let offset = random(-2, 2);
      let length = random(1, 3);
      line(x, baseY, x + offset, baseY - length);
    }
  }
  
  // Bottom edge fibers
  for (let x = 0; x < w; x += 10) {
    let baseY = h * 0.9 + cos(x * noiseScale + time * 0.3 + tearNoise) * 4;
    let fibers = int(abs(noise(x * 0.1 + 100, time * 1.5)) * 4);
    for (let f = 0; f < fibers; f++) {
      let offset = random(-2, 2);
      let length = random(1, 3);
      line(x, baseY, x + offset, baseY + length);
    }
  }
  
  // Left edge fibers
  for (let y = 0; y < h; y += 10) {
    let baseX = w * 0.1 + sin(y * noiseScale + time * 0.7 + tearNoise) * 3;
    let fibers = int(abs(noise(200 + y * 0.1, time * 3)) * 4);
    for (let f = 0; f < fibers; f++) {
      let offset = random(1, 3);
      let length = random(1, 3);
      line(baseX, y, baseX - offset, y + length);
    }
  }
  
  // Right edge fibers
  for (let y = 0; y < h; y += 10) {
    let baseX = w * 0.9 + cos(y * noiseScale + time * 0.4 + tearNoise) * 4;
    let fibers = int(abs(noise(300 + y * 0.1, time * 2.5)) * 4);
    for (let f = 0; f < fibers; f++) {
      let offset = random(1, 3);
      let length = random(1, 3);
      line(baseX, y, baseX + offset, y + length);
    }
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
    scrap.tearNoise = random(TWO_PI);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
