let paperTexture;
let textStream = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create aged paper texture
  paperTexture = createGraphics(width, height);
  paperTexture.background(240, 230, 220);
  
  // Add paper grain and age marks
  paperTexture.noStroke();
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    let alpha = random(10, 30);
    paperTexture.fill(220, 210, 200, alpha);
    paperTexture.ellipse(x, y, size);
  }
  
  // Add subtle creases
  paperTexture.stroke(200, 190, 180, 40);
  paperTexture.strokeWeight(1);
  for (let i = 0; i < 200; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-50, 50);
    paperTexture.line(x1, y1, x2, y2);
  }
  
  // Initialize text stream
  for (let i = 0; i < 100; i++) {
    textStream.push({
      char: String.fromCharCode(33 + floor(random(94))),
      x: random(width),
      y: -20,
      speed: random(0.5, 2),
      life: random(0.5, 1),
      size: random(8, 16),
      angle: random(-0.1, 0.1),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(245, 235, 225);
  
  // Draw paper texture
  image(paperTexture, 0, 0);
  
  // Add subtle warping effect
  time += 0.005;
  let warp = sin(time * 0.3) * 0.5 + 0.5;
  
  // Draw text stream
  for (let i = 0; i < textStream.length; i++) {
    let t = textStream[i];
    
    // Update position
    t.y += t.speed;
    t.life -= 0.001;
    
    // Reset if off screen or dead
    if (t.y > height + 20 || t.life <= 0) {
      t.x = random(width);
      t.y = -20;
      t.life = 1;
      t.char = String.fromCharCode(33 + floor(random(94)));
    }
    
    // Apply warping effect
    let dx = sin(t.y * 0.01 + time) * 5 * warp;
    let dy = cos(t.x * 0.01 + time) * 3 * warp;
    
    push();
    translate(t.x + dx, t.y + dy);
    rotate(t.rotation + t.angle);
    
    // Draw character with age effect
    fill(30, 20, 10, map(t.life, 0, 1, 50, 255));
    noStroke();
    textSize(t.size);
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    text(t.char, 0, 0);
    
    pop();
  }
  
  // Add fiber fraying effect
  if (frameCount % 10 === 0) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    let alpha = random(50, 150);
    
    push();
    translate(x, y);
    rotate(random(TWO_PI));
    noStroke();
    fill(200, 190, 180, alpha);
    ellipse(0, 0, size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
