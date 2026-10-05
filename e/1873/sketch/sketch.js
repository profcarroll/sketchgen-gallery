let circles = [];
let afterimages = [];

class Circle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(50, 200);
    this.speedX = random(-0.1, 0.1);
    this.speedY = random(-0.1, 0.1);
    this.alpha = random(30, 80);
    this.color = color(255, 255, 255, this.alpha);
    this.hueShift = random(-10, 10);
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x > width + this.size) this.x = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.y > height + this.size) this.y = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

class Afterimage {
  constructor(x, y, size, color, alpha) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.alpha = alpha;
    this.decay = random(0.5, 1.0);
  }
  
  update() {
    this.alpha -= this.decay;
    this.size *= 0.99;
  }
  
  isFinished() {
    return this.alpha <= 0 || this.size <= 1;
  }
  
  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  for (let i = 0; i < 15; i++) {
    circles.push(new Circle());
  }
}

function draw() {
  background(10, 10, 30, 20); // Semi-transparent background for trail effect
  
  // Update and display circles
  for (let circle of circles) {
    circle.update();
    circle.display();
    
    // Occasionally create an afterimage
    if (random() < 0.05) {
      let alpha = random(20, 60);
      let newColor = color(
        red(circle.color),
        green(circle.color),
        blue(circle.color),
        alpha
      );
      afterimages.push(new Afterimage(
        circle.x,
        circle.y,
        circle.size * random(0.5, 1.5),
        newColor,
        alpha
      ));
    }
  }
  
  // Update and display afterimages
  for (let i = afterimages.length - 1; i >= 0; i--) {
    afterimages[i].update();
    afterimages[i].display();
    
    if (afterimages[i].isFinished()) {
      afterimages.splice(i, 1);
    }
  }
  
  // Apply subtle color shifts to nearby circles based on afterimages
  for (let afterimage of afterimages) {
    for (let circle of circles) {
      let d = dist(afterimage.x, afterimage.y, circle.x, circle.y);
      if (d < circle.size + afterimage.size * 0.5) {
        let hueDiff = map(d, 0, circle.size + afterimage.size * 0.5, 10, 0);
        let newHue = (hue(circle.color) + afterimage.decay * (1 - hueDiff / 10)) % 360;
        circle.color = color(newHue, saturation(circle.color), brightness(circle.color), alpha(circle.color));
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
