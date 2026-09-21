let bricks = [];
let vines = [];
let brickTexture;
let clickEffect = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create brick pattern
  brickTexture = createGraphics(100, 100);
  brickTexture.noStroke();
  brickTexture.fill(120, 60, 30);
  brickTexture.rect(0, 0, 100, 100);
  brickTexture.fill(100, 50, 20);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((i + j) % 2 === 0) {
        brickTexture.rect(i * 10, j * 10, 10, 10);
      }
    }
  }

  // Initialize bricks
  for (let x = 0; x < width; x += 60) {
    for (let y = 0; y < height; y += 40) {
      bricks.push({
        x: x,
        y: y,
        w: 50,
        h: 30,
        color: color(120, 60, 30),
        time: random(1000)
      });
    }
  }

  // Initialize vines
  for (let i = 0; i < 1000; i++) {
    vines.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      age: random(100),
      bloom: random() > 0.7,
      targetSize: random(5, 15)
    });
  }
}

function draw() {
  background(50);

  // Draw brick wall
  for (let b of bricks) {
    fill(b.color);
    rect(b.x, b.y, b.w, b.h);
    image(brickTexture, b.x, b.y, b.w, b.h);
  }

  // Update and draw vines
  for (let v of vines) {
    v.age += v.speed;
    v.x += cos(v.angle) * 0.5;
    v.y += sin(v.angle) * 0.5;

    if (v.bloom && v.size < v.targetSize) {
      v.size += 0.1;
    }

    // Keep vines on screen
    if (v.x < -50 || v.x > width + 50 || v.y < -50 || v.y > height + 50) {
      v.x = random(width);
      v.y = random(height);
      v.size = random(2, 8);
      v.angle = random(TWO_PI);
      v.age = 0;
      v.bloom = random() > 0.7;
      v.targetSize = random(5, 15);
    }

    // Draw vine tendrils
    if (v.age > 30) {
      noFill();
      stroke(30, 80, 20);
      strokeWeight(v.size * 0.2);
      beginShape();
      for (let i = 0; i < 10; i++) {
        let a = v.angle + sin(v.age * 0.1 + i) * 0.5;
        vertex(v.x + cos(a) * i, v.y + sin(a) * i);
      }
      endShape();
    }

    // Draw leaves
    if (v.age > 60 && v.bloom) {
      fill(20, 100, 30);
      noStroke();
      ellipse(v.x, v.y, v.size * 2, v.size);
    }
  }

  // Handle click effect
  if (clickEffect) {
    clickEffect.radius += 5;
    stroke(100, 200, 100);
    strokeWeight(2);
    noFill();
    ellipse(clickEffect.x, clickEffect.y, clickEffect.radius * 2);
    
    if (clickEffect.radius > 100) {
      clickEffect = null;
    }
  }
}

function mousePressed() {
  // Create a burst of new growth at the click point
  clickEffect = { x: mouseX, y: mouseY, radius: 0 };
  
  for (let i = 0; i < 50; i++) {
    vines.push({
      x: mouseX,
      y: mouseY,
      size: random(2, 8),
      speed: random(1, 3),
      angle: random(TWO_PI),
      age: 0,
      bloom: true,
      targetSize: random(5, 20)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
