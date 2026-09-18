let bricks = [];
let vines = [];
let mortar = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create brick wall
  const brickWidth = 80;
  const brickHeight = 40;
  const mortarThickness = 5;
  
  for (let y = 0; y < height; y += brickHeight + mortarThickness) {
    for (let x = 0; x < width; x += brickWidth + mortarThickness) {
      // Randomly offset every other row
      if ((y / (brickHeight + mortarThickness)) % 2 === 0) {
        x += brickWidth / 2;
      }
      
      bricks.push({x, y, w: brickWidth, h: brickHeight});
      mortar.push({x, y: y + brickHeight, w: brickWidth, h: mortarThickness});
    }
  }
  
  // Create initial vine tendrils
  for (let i = 0; i < 200; i++) {
    vines.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      speed: random(0.01, 0.03),
      angle: random(TWO_PI),
      life: random(100, 300),
      age: 0,
      color: color(random(20, 80), random(100, 150), 20, 150)
    });
  }
}

function draw() {
  // Draw aged brick wall
  background(40, 30, 25);
  
  // Draw bricks with weathered texture
  fill(80, 60, 50);
  for (let brick of bricks) {
    rect(brick.x, brick.y, brick.w, brick.h);
    
    // Add some aging details to bricks
    fill(60, 45, 40);
    rect(brick.x + 2, brick.y + 2, brick.w - 4, brick.h - 4);
    fill(70, 50, 45);
    rect(brick.x + 5, brick.y + 5, brick.w - 10, brick.h - 10);
    
    fill(80, 60, 50);
  }
  
  // Draw mortar lines
  fill(60, 50, 45);
  for (let m of mortar) {
    rect(m.x, m.y, m.w, m.h);
  }
  
  // Update and draw vines
  for (let i = vines.length - 1; i >= 0; i--) {
    let vine = vines[i];
    
    // Slow movement with subtle sine wave motion
    vine.x += cos(vine.angle) * vine.speed;
    vine.y += sin(vine.angle) * vine.speed;
    vine.angle += random(-0.05, 0.05);
    
    // Add slight organic motion
    vine.angle += sin(frameCount * 0.01 + vine.age) * 0.02;
    
    // Age the vine
    vine.age++;
    
    if (vine.age > vine.life) {
      vines.splice(i, 1);
      // Add new vine
      vines.push({
        x: random(width),
        y: random(height),
        size: random(5, 15),
        speed: random(0.01, 0.03),
        angle: random(TWO_PI),
        life: random(100, 300),
        age: 0,
        color: color(random(20, 80), random(100, 150), 20, 150)
      });
    }
    
    // Draw vine tendril
    push();
    translate(vine.x, vine.y);
    rotate(vine.angle);
    
    fill(vine.color);
    noStroke();
    
    // Draw leaf-like shape with organic motion
    let leafSize = vine.size + sin(frameCount * 0.03 + vine.age) * 3;
    ellipse(0, 0, leafSize, leafSize * 0.7);
    
    pop();
  }
  
  // Add some subtle growth effect to the vines
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 5; i++) {
      if (vines.length < 300) {
        vines.push({
          x: random(width),
          y: random(height),
          size: random(5, 15),
          speed: random(0.01, 0.03),
          angle: random(TWO_PI),
          life: random(100, 300),
          age: 0,
          color: color(random(20, 80), random(100, 150), 20, 150)
        });
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
