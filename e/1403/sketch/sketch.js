let bubbles = [];
let texts = [];
let clickEffect = null;
let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(20, 60);
    this.speed = random(0.5, 1.5);
    this.color = color(random(150, 220), random(180, 255), random(220, 255), 150);
    this.drift = random(-0.5, 0.5);
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;
    
    if (this.y < -this.size) {
      this.y = height + this.size;
      this.x = random(width);
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class TextFragment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.text = random(['thought', 'idea', 'dream', 'memory', 'moment']);
    this.size = random(12, 20);
    this.speed = random(0.3, 1.0);
    this.color = color(random(100, 180), random(150, 220), random(200, 255), 200);
    this.drift = random(-0.3, 0.3);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.01, 0.01);
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;
    this.rotation += this.rotationSpeed;
    
    if (this.y < -20) {
      this.y = height + 20;
      this.x = random(width);
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
  for (let i = 0; i < 100; i++) {
    bubbles.push(new Bubble(random(width), random(height)));
  }
  for (let i = 0; i < 50; i++) {
    texts.push(new TextFragment(random(width), random(height)));
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
  
  // Handle click effect
  if (clickEffect) {
    clickEffect.update();
    clickEffect.display();
    if (clickEffect.isFinished()) {
      clickEffect = null;
    }
  }
  
  // Handle dragging effect
  if (dragging && clickEffect === null) {
    for (let bubble of bubbles) {
      let dx = bubble.x - mouseX;
      let dy = bubble.y - mouseY;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        let force = map(distance, 0, 100, 2, 0);
        bubble.x += dx * force * 0.01;
        bubble.y += dy * force * 0.01;
      }
    }
    
    for (let text of texts) {
      let dx = text.x - mouseX;
      let dy = text.y - mouseY;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        let force = map(distance, 0, 100, 2, 0);
        text.x += dx * force * 0.01;
        text.y += dy * force * 0.01;
      }
    }
  }
}

function mousePressed() {
  // Create click effect
  clickEffect = new ClickEffect(mouseX, mouseY);
  
  // Add some bright bubbles at click location
  for (let i = 0; i < 15; i++) {
    bubbles.push(new Bubble(mouseX, mouseY));
  }
}

function mouseDragged() {
  dragging = true;
}

function mouseReleased() {
  dragging = false;
}

class ClickEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
    this.maxSize = random(50, 100);
    this.alpha = 255;
    this.growthRate = random(2, 5);
  }
  
  update() {
    this.size += this.growthRate;
    this.alpha -= 5;
  }
  
  display() {
    noFill();
    stroke(255, 100, 100, this.alpha);
    strokeWeight(3);
    ellipse(this.x, this.y, this.size);
  }
  
  isFinished() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
