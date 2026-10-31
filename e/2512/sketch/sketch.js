let shelves = [];
let woolThreads = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Muted organic palette inspired by knitted wool and decayed wood
  colors = [
    color(100, 80, 60),   // Deep brown
    color(120, 90, 70),   // Medium brown
    color(140, 110, 90),  // Light brown
    color(160, 130, 110), // Pale brown
    color(180, 150, 130), // Very pale brown
    color(120, 100, 90),  // Muted tan
    color(140, 120, 110), // Soft beige
    color(160, 140, 130), // Cream
    color(80, 70, 60),    // Darker wood tone
    color(60, 50, 40),    // Very dark brown
    color(200, 180, 160), // Pale grayish brown
    color(180, 160, 140)  // Soft muted brown
  ];
  
  // Create library shelves with decayed wood texture
  for (let i = 0; i < 8; i++) {
    let y = map(i, 0, 7, height * 0.2, height * 0.8);
    let shelfHeight = random(15, 30);
    let shelfWidth = random(width * 0.4, width * 0.8);
    let x = (width - shelfWidth) / 2;
    
    shelves.push({
      x: x,
      y: y,
      width: shelfWidth,
      height: shelfHeight,
      color: random(colors),
      texture: []
    });
    
    // Add wood grain texture to shelves
    for (let j = 0; j < 50; j++) {
      shelves[i].texture.push({
        x: random(shelfWidth),
        y: random(shelfHeight),
        w: random(1, 3),
        h: random(0.5, 1.5)
      });
    }
  }
  
  // Create accumulated wool threads
  for (let i = 0; i < 200; i++) {
    woolThreads.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      color: random(colors),
      opacity: random(30, 80),
      speed: random(0.001, 0.005),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(25, 20, 15);
  
  // Draw shelves with subtle decay
  for (let shelf of shelves) {
    let y = shelf.y + sin(frameCount * 0.001 + shelf.offset) * 0.5;
    
    // Shelf base with wood texture
    noStroke();
    fill(shelf.color);
    rect(shelf.x, y, shelf.width, shelf.height);
    
    // Add wood grain texture
    stroke(255, 255, 255, 10);
    strokeWeight(0.3);
    for (let tex of shelf.texture) {
      line(tex.x + shelf.x, tex.y + y, tex.x + shelf.x + tex.w, tex.y + y + tex.h);
    }
    
    // Add subtle aging effect to shelves
    fill(0, 0, 0, 10);
    noStroke();
    rect(shelf.x, y, shelf.width, shelf.height * 0.1);
  }
  
  // Draw accumulated wool threads with slow movement
  for (let thread of woolThreads) {
    let x = thread.x + sin(frameCount * thread.speed + thread.offset) * 0.5;
    let y = thread.y + cos(frameCount * thread.speed + thread.offset) * 0.3;
    
    noStroke();
    fill(thread.color);
    ellipse(x, y, thread.size, thread.size);
    
    // Add subtle fading effect
    fill(255, 255, 255, thread.opacity * 0.2);
    ellipse(x, y, thread.size * 1.5, thread.size * 1.5);
  }
  
  // Add gentle shimmer and slow changes to the scene
  if (frameCount % 30 === 0) {
    let shimmerX = random(width);
    let shimmerY = random(height);
    let size = random(0.5, 2);
    fill(255, 255, 255, 10);
    noStroke();
    ellipse(shimmerX, shimmerY, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
