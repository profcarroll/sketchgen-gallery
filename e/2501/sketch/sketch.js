let leaves = [];
let snow = [];
let buds = [];
let time = 0;
let season = 0; // 0: spring, 1: summer, 2: fall, 3: winter, 4: spring again

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);

  // Create the tree trunk and branches
  for (let i = 0; i < 50; i++) {
    leaves.push({
      x: width/2 + random(-100, 100),
      y: height/2 + random(-150, 150),
      size: random(5, 15),
      hue: 100 + random(30), // green to yellow-green
      alpha: 1,
      age: random(100),
      speed: random(0.01, 0.03)
    });
  }

  // Initialize snowflakes
  for (let i = 0; i < 200; i++) {
    snow.push({
      x: random(width),
      y: random(-height, 0),
      size: random(2, 6),
      speed: random(1, 3),
      sway: random(-0.5, 0.5),
      swaySpeed: random(0.01, 0.03)
    });
  }

  // Initialize buds
  for (let i = 0; i < 50; i++) {
    buds.push({
      x: width/2 + random(-100, 100),
      y: height/2 + random(-150, 150),
      size: random(2, 5),
      hue: 100 + random(30),
      alpha: 0,
      growSpeed: random(0.005, 0.01)
    });
  }
}

function draw() {
  background(220, 20, 90); // Sky color
  
  time += 0.01;
  
  // Cycle through seasons
  season = floor(time / 2) % 5;
  
  // Draw hillside
  noStroke();
  fill(80, 40, 60);
  beginShape();
  for (let i = 0; i <= width; i += 10) {
    const y = height/2 + sin(i * 0.01 + time) * 30;
    vertex(i, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Draw tree trunk
  stroke(30, 50, 40);
  strokeWeight(20);
  line(width/2, height/2 + 100, width/2, height/2 - 100);
  
  // Draw branches
  stroke(30, 50, 40);
  strokeWeight(3);
  for (let i = 0; i < 8; i++) {
    const angle = map(i, 0, 8, -PI/4, PI/4);
    const length = 80 + sin(time + i) * 10;
    line(width/2, height/2, width/2 + cos(angle) * length, height/2 - sin(angle) * length);
  }
  
  // Update and draw leaves based on season
  if (season === 0 || season === 4) { // Spring or next spring
    // Leaves are green
    for (let leaf of leaves) {
      leaf.hue = 100 + sin(time + leaf.age) * 20;
      leaf.size = 5 + sin(time + leaf.age) * 5;
      fill(leaf.hue, 80, 90, leaf.alpha);
      noStroke();
      ellipse(leaf.x, leaf.y, leaf.size);
    }
  } else if (season === 1) { // Summer
    // Leaves are green
    for (let leaf of leaves) {
      leaf.hue = 100 + sin(time + leaf.age) * 20;
      leaf.size = 8 + sin(time + leaf.age) * 3;
      fill(leaf.hue, 80, 90, leaf.alpha);
      noStroke();
      ellipse(leaf.x, leaf.y, leaf.size);
    }
  } else if (season === 2) { // Fall
    // Leaves change color
    for (let leaf of leaves) {
      leaf.hue = 10 + sin(time + leaf.age) * 20; // Red/orange range
      leaf.size = 8 + sin(time + leaf.age) * 3;
      fill(leaf.hue, 90, 90, leaf.alpha);
      noStroke();
      ellipse(leaf.x, leaf.y, leaf.size);
    }
  } else if (season === 3) { // Winter
    // Leaves fall and snow falls
    for (let leaf of leaves) {
      leaf.y += 2;
      leaf.alpha = max(0, leaf.alpha - 0.01);
      fill(leaf.hue, 80, 60, leaf.alpha);
      noStroke();
      ellipse(leaf.x, leaf.y, leaf.size);
    }
    
    // Snowfall
    for (let flake of snow) {
      flake.y += flake.speed;
      flake.x += sin(flake.sway + time * flake.swaySpeed) * 0.5;
      
      if (flake.y > height) {
        flake.y = random(-20, 0);
        flake.x = random(width);
      }
      
      fill(360, 0, 100, 0.8);
      noStroke();
      ellipse(flake.x, flake.y, flake.size);
    }
    
    // Snow melts and buds appear
    if (time > 15) {
      for (let bud of buds) {
        bud.alpha = min(1, bud.alpha + bud.growSpeed);
        fill(bud.hue, 80, 90, bud.alpha);
        noStroke();
        ellipse(bud.x, bud.y, bud.size);
      }
    }
    
    // Draw blossoms
    if (time > 20) {
      for (let bud of buds) {
        if (bud.alpha >= 1) {
          fill(340, 90, 90); // Pink blossom
          noStroke();
          ellipse(bud.x, bud.y, bud.size * 3);
        }
      }
    }
  }
  
  // Reset leaves for next cycle
  if (time > 25) {
    time = 0;
    season = 0;
    
    // Reset leaves
    for (let leaf of leaves) {
      leaf.x = width/2 + random(-100, 100);
      leaf.y = height/2 + random(-150, 150);
      leaf.alpha = 1;
    }
    
    // Reset buds
    for (let bud of buds) {
      bud.alpha = 0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
