let fragments = [];
let numFragments = 100;
let speed = 0.002;
let rotationSpeed = 0.001;
let isDragging = false;
let dragStartX, dragStartY;

class Fragment {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(20, 80);
    this.rotation = random(TWO_PI);
    this.vx = random(-speed, speed);
    this.vy = random(-speed, speed);
    this.vr = random(-rotationSpeed, rotationSpeed);
    this.texture = createGraphics(this.size, this.size);
    this.generateTexture();
  }

  generateTexture() {
    this.texture.background(0);
    this.texture.noStroke();
    for (let i = 0; i < 10; i++) {
      const x = random(this.texture.width);
      const y = random(this.texture.height);
      const s = random(2, 10);
      const a = random(50, 200);
      this.texture.fill(a);
      this.texture.ellipse(x, y, s, s);
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vr;

    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    image(this.texture, -this.size/2, -this.size/2);
    pop();
  }
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < numFragments; i++) {
    fragments.push(new Fragment());
  }
}

function draw() {
  background(20);

  for (let f of fragments) {
    f.update();
    f.display();
  }

  if (isDragging) {
    let dx = mouseX - dragStartX;
    let dy = mouseY - dragStartY;

    for (let f of fragments) {
      f.x += dx * 0.1;
      f.y += dy * 0.1;
    }

    dragStartX = mouseX;
    dragStartY = mouseY;
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    isDragging = true;
    dragStartX = mouseX;
    dragStartY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseClicked() {
  for (let f of fragments) {
    f.x = random(width);
    f.y = random(height);
    f.vx = random(-speed, speed);
    f.vy = random(-speed, speed);
    f.vr = random(-rotationSpeed, rotationSpeed);
  }
}
