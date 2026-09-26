let bubbles = [];
let texts = [];

class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = height + random(50);
    this.size = random(15, 40);
    this.speed = random(0.3, 0.8);
    this.color = color(random(180, 220), random(200, 255), random(240, 255), random(100, 180));
    this.drift = random(-0.3, 0.3);
    this.life = random(200, 400);
    this.age = 0;
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;
    this.age++;
    
    if (this.y < -this.size || this.age > this.life) {
      this.reset();
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class TextFragment {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = height + random(50);
    this.text = random(['thought', 'idea', 'dream', 'memory', 'moment']);
    this.size = random(12, 18);
    this.speed = random(0.2, 0.6);
    this.color = color(random(120, 180), random(180, 240), random(220, 255), random(150, 220));
    this.drift = random(-0.2, 0.2);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.01, 0.01);
    this.life = random(200, 400);
    this.age = 0;
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;
    this.rotation += this.rotationSpeed;
    this.age++;
    
    if (this.y < -20 || this.age > this.life) {
      this.reset();
    }
  }

  display() {
    fill(this.color);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.size);
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    text(this.text, 0, 0);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create bubbles
  for (let i = 0; i < 80; i++) {
    bubbles.push(new Bubble());
  }
  
  // Create text fragments
  for (let i = 0; i < 40; i++) {
    texts.push(new TextFragment());
  }
}

function draw() {
  background(240, 245, 250);
  
  // Update and display bubbles
  for (let bubble of bubbles) {
    bubble.update();
    bubble.display();
  }
  
  // Update and display text fragments
  for (let text of texts) {
    text.update();
    text.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
