let tiles = [];
let forceActive = false;
let mouseForce = { x: 0, y: 0 };
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create ceramic tiles
  for (let i = 0; i < 50; i++) {
    tiles.push({
      x: random(width),
      y: random(height),
      w: random(40, 120),
      h: random(20, 80),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      decay: random(0.98, 0.999),
      color: color(random(20), random(30), random(70, 90)),
      breakPoint: random(0.1, 0.9)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.002;
  
  // Apply mouse force if active
  if (forceActive) {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const dx = tile.x - mouseForce.x;
      const dy = tile.y - mouseForce.y;
      const dist = sqrt(dx * dx + dy * dy);
      
      if (dist < 200) {
        const force = map(dist, 0, 200, 0.1, 0);
        tile.decay -= force * 0.005;
        tile.rotation += force * 0.02;
      }
    }
    
    // Reduce force over time
    mouseForce.x += (mouseX - mouseForce.x) * 0.05;
    mouseForce.y += (mouseY - mouseForce.y) * 0.05;
  }
  
  // Draw and update tiles
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    
    push();
    translate(tile.x, tile.y);
    rotate(tile.rotation);
    
    fill(tile.color);
    noStroke();
    
    // Draw broken tile effect
    if (random() < tile.decay) {
      // Create a fractured appearance
      for (let j = 0; j < 5; j++) {
        const offsetX = random(-tile.w/2, tile.w/2);
        const offsetY = random(-tile.h/2, tile.h/2);
        const sizeW = random(5, tile.w/3);
        const sizeH = random(5, tile.h/3);
        
        rect(offsetX, offsetY, sizeW, sizeH);
      }
    } else {
      // Normal tile
      rect(-tile.w/2, -tile.h/2, tile.w, tile.h);
    }
    
    pop();
    
    // Update decay and movement
    tile.decay *= 0.999;
    tile.rotation += tile.speed * sin(time + i);
    tile.x += sin(time * 0.5 + i) * 0.3;
    tile.y += cos(time * 0.5 + i) * 0.3;
    
    // Reset tiles that go off screen
    if (tile.x < -100 || tile.x > width + 100 || tile.y < -100 || tile.y > height + 100) {
      tile.x = random(width);
      tile.y = random(height);
      tile.decay = random(0.98, 0.999);
    }
  }
  
  // Add slow sediment accumulation effect
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    
    if (random() < 0.001) {
      tile.decay -= 0.01;
    }
    
    if (tile.decay < 0.8) {
      tile.decay += 0.002;
    }
  }
}

function mousePressed() {
  forceActive = true;
  mouseForce.x = mouseX;
  mouseForce.y = mouseY;
}

function mouseDragged() {
  mouseForce.x = mouseX;
  mouseForce.y = mouseY;
}

function mouseReleased() {
  forceActive = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
