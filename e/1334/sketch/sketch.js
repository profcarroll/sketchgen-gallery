let images = [];
let draggedImage = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let lightLeakParticles = [];

class Photo {
  constructor(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = img.width / 3;
    this.height = img.height / 3;
    this.rotation = random(-0.1, 0.1);
    this.tintR = random(150, 200);
    this.tintG = random(120, 160);
    this.tintB = random(100, 140);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.originalX = x;
    this.originalY = y;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    tint(this.tintR, this.tintG, this.tintB);
    image(this.img, -this.width/2, -this.height/2, this.width, this.height);
    noTint();
    pop();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x < -this.width || this.x > width + this.width) this.speedX *= -1;
    if (this.y < -this.height || this.y > height + this.height) this.speedY *= -1;

    // Slow drift
    this.x += random(-0.1, 0.1);
    this.y += random(-0.1, 0.1);
  }

  contains(x, y) {
    return x > this.x - this.width/2 && x < this.x + this.width/2 &&
           y > this.y - this.height/2 && y < this.y + this.height/2;
  }
}

function preload() {
  images[0] = loadImage('https://picsum.photos/seed/one/800/600');
  images[1] = loadImage('https://picsum.photos/seed/two/800/600');
  images[2] = loadImage('https://picsum.photos/seed/three/800/600');
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 3; i++) {
    let x = random(width);
    let y = random(height);
    images[i] = new Photo(images[i], x, y);
  }

  // Create light leak particles
  for (let i = 0; i < 200; i++) {
    lightLeakParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 5),
      speed: random(0.5, 2),
      opacity: random(30, 80)
    });
  }
}

function draw() {
  background(240);

  // Draw light leaks
  for (let p of lightLeakParticles) {
    fill(255, 255, 255, p.opacity);
    noStroke();
    ellipse(p.x, p.y, p.size);
    p.y += p.speed;
    if (p.y > height + 10) p.y = -10;
  }

  // Update and display photos
  for (let photo of images) {
    photo.update();
    photo.display();
  }
}

function mousePressed() {
  // Check if clicked on a photo
  for (let i = images.length - 1; i >= 0; i--) {
    if (images[i].contains(mouseX, mouseY)) {
      draggedImage = images[i];
      dragOffsetX = mouseX - draggedImage.x;
      dragOffsetY = mouseY - draggedImage.y;
      // Bring to front
      let idx = images.indexOf(draggedImage);
      images.splice(idx, 1);
      images.push(draggedImage);
      return;
    }
  }

  // Change color tint of the topmost image if clicked elsewhere
  if (images.length > 0) {
    let topImage = images[images.length - 1];
    topImage.tintR = random(200, 255);
    topImage.tintG = random(150, 200);
    topImage.tintB = random(100, 150);
  }
}

function mouseDragged() {
  if (draggedImage) {
    draggedImage.x = mouseX - dragOffsetX;
    draggedImage.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  draggedImage = null;
}
