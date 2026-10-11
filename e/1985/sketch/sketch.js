let inkDrops = [];
let newsprintTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a subtle newsprint texture
  newsprintTexture = createGraphics(width, height);
  newsprintTexture.noiseSeed(42);
  newsprintTexture.background(240);
  for (let i = 0; i < 1000; i++) {
    const x = random(width);
    const y = random(height);
    const sz = random(0.5, 2);
    newsprintTexture.noStroke();
    newsprintTexture.fill(200, 200, 200, 30);
    newsprintTexture.ellipse(x, y, sz, sz);
  }
  
  // Initialize some ink drops
  for (let i = 0; i < 5; i++) {
    inkDrops.push({
      x: random(width),
      y: random(height),
      radius: 2,
      maxRadius: random(30, 80),
      speed: random(0.5, 1.5),
      color: color(0, 0, 0, 150),
      active: true
    });
  }
}

function draw() {
  // Draw the newsprint background
  image(newsprintTexture, 0, 0);
  
  // Add new ink drops occasionally
  if (frameCount % 60 === 0 && inkDrops.length < 20) {
    inkDrops.push({
      x: random(width),
      y: random(height),
      radius: 2,
      maxRadius: random(30, 80),
      speed: random(0.5, 1.5),
      color: color(0, 0, 0, 150),
      active: true
    });
  }
  
  // Update and draw ink drops
  for (let i = inkDrops.length - 1; i >= 0; i--) {
    const drop = inkDrops[i];
    
    if (!drop.active) continue;
    
    // Grow the ink drop
    drop.radius += drop.speed;
    
    // Draw the ink drop with a soft edge
    noStroke();
    fill(drop.color);
    ellipse(drop.x, drop.y, drop.radius * 2, drop.radius * 2);
    
    // Fade out as it spreads
    const alpha = map(drop.radius, 0, drop.maxRadius, 150, 0);
    fill(red(drop.color), green(drop.color), blue(drop.color), alpha);
    ellipse(drop.x, drop.y, drop.radius * 2, drop.radius * 2);
    
    // Remove if it's too large
    if (drop.radius > drop.maxRadius) {
      drop.active = false;
    }
  }
  
  // Remove inactive drops
  inkDrops = inkDrops.filter(drop => drop.active);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
