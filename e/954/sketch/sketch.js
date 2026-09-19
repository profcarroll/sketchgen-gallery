let rocks = [];
let snow = [];
let avalanche = [];
let isAvalancheActive = false;
let avalancheTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create rock formations
  for (let i = 0; i < 200; i++) {
    rocks.push({
      x: random(width),
      y: random(height * 0.4, height),
      w: random(20, 80),
      h: random(10, 50),
      color: color(random(20, 40), random(10, 30), random(20, 40))
    });
  }
  
  // Create snow particles
  for (let i = 0; i < 1000; i++) {
    snow.push({
      x: random(width),
      y: random(height * 0.3, height),
      size: random(1, 3),
      speed: random(0.5, 2),
      opacity: random(0.3, 0.8)
    });
  }
  
  // Create avalanche particles
  for (let i = 0; i < 500; i++) {
    avalanche.push({
      x: random(width),
      y: random(height * 0.2, height * 0.4),
      size: random(2, 6),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      opacity: random(0.5, 1)
    });
  }
}

function draw() {
  // Background with cold tones
  background(color(200, 20, 80));
  
  // Draw sky gradient
  for (let y = 0; y < height * 0.3; y++) {
    let inter = map(y, 0, height * 0.3, 0, 1);
    let c = lerpColor(color(200, 20, 90), color(220, 30, 95), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw distant peaks
  drawPeaks();
  
  // Draw foreground rocks
  for (let rock of rocks) {
    fill(rock.color);
    noStroke();
    rect(rock.x, rock.y, rock.w, rock.h, 5);
  }
  
  // Draw snow on rocks and ground
  drawSnow();
  
  // Handle avalanche effect
  if (isAvalancheActive) {
    handleAvalanche();
  }
}

function drawPeaks() {
  noStroke();
  fill(color(200, 10, 90));
  beginShape();
  for (let x = 0; x < width; x += 20) {
    let y = height * 0.3 + sin(x * 0.01) * 30 + noise(x * 0.01) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Add more peaks
  fill(color(210, 15, 85));
  beginShape();
  for (let x = 0; x < width; x += 30) {
    let y = height * 0.3 + sin(x * 0.005) * 40 + noise(x * 0.02) * 15;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function drawSnow() {
  noStroke();
  
  // Draw snow on ground
  fill(color(240, 0, 100));
  for (let i = 0; i < 500; i++) {
    let s = snow[i];
    ellipse(s.x, s.y, s.size);
  }
  
  // Draw snow on rocks
  for (let rock of rocks) {
    fill(color(240, 0, 100));
    for (let i = 0; i < 50; i++) {
      let x = rock.x + random(rock.w);
      let y = rock.y + random(rock.h);
      ellipse(x, y, random(1, 2));
    }
  }
}

function handleAvalanche() {
  avalancheTimer++;
  
  // Update and draw avalanche particles
  for (let i = 0; i < avalanche.length; i++) {
    let p = avalanche[i];
    
    // Apply gravity and wind
    p.speedY += 0.1;
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Fade out as they fall
    p.opacity -= 0.002;
    
    // Draw particle
    if (p.opacity > 0) {
      fill(240, 0, 100, p.opacity);
      noStroke();
      ellipse(p.x, p.y, p.size);
      
      // Create trail effect
      if (frameCount % 3 === 0) {
        stroke(240, 0, 100, p.opacity * 0.5);
        strokeWeight(1);
        line(p.x, p.y, p.x - p.speedX * 5, p.y - p.speedY * 5);
      }
    }
    
    // Reset particle if it goes off screen
    if (p.y > height || p.opacity <= 0) {
      p.x = random(width);
      p.y = random(height * 0.2, height * 0.4);
      p.opacity = random(0.5, 1);
      p.speedX = random(-1, 1);
      p.speedY = random(-1, 1);
    }
  }
  
  // Stop avalanche after a while
  if (avalancheTimer > 200) {
    isAvalancheActive = false;
    avalancheTimer = 0;
  }
}

function mousePressed() {
  // Start avalanche on click
  isAvalancheActive = true;
  avalancheTimer = 0;
}
