let tree;
let leaves = [];
let snowflakes = [];
let time = 0;
let season = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the central tree structure
  tree = {
    trunk: { x: width/2, y: height/2 + 50, width: 20, height: 150 },
    canopy: { x: width/2, y: height/2 - 100, radius: 100 }
  };
  
  // Create initial leaves
  for (let i = 0; i < 300; i++) {
    leaves.push({
      x: tree.canopy.x + random(-tree.canopy.radius, tree.canopy.radius),
      y: tree.canopy.y + random(-tree.canopy.radius, tree.canopy.radius),
      size: random(4, 8),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      originalHue: random(120, 140), // Spring green
      hueOffset: random(-20, 20)
    });
  }
  
  // Create initial snowflakes
  for (let i = 0; i < 500; i++) {
    snowflakes.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 1.5),
      sway: random(TWO_PI)
    });
  }
}

function draw() {
  background(200, 20, 95);
  
  time += 0.005;
  season = (time * 0.02) % 1;
  
  // Draw rolling hill
  fill(20, 50, 30);
  noStroke();
  beginShape();
  for (let x = 0; x < width; x += 20) {
    let y = height/2 + sin(x * 0.01 + time) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Draw tree trunk
  fill(30, 70, 40);
  rect(tree.trunk.x - tree.trunk.width/2, tree.trunk.y, tree.trunk.width, tree.trunk.height);
  
  // Update and draw leaves with seasonal color transitions
  for (let leaf of leaves) {
    leaf.angle += leaf.speed;
    let sway = sin(leaf.angle) * 0.5;
    
    let x = leaf.x + cos(leaf.angle) * sway * 2;
    let y = leaf.y + sin(leaf.angle) * sway * 2;
    
    // Seasonal color transitions
    let hue;
    if (season > 0.75) {
      hue = 20; // Winter brown
    } else if (season > 0.5) {
      hue = 10 + (season - 0.5) * 30; // Fall red-orange
    } else if (season > 0.25) {
      hue = 120 + (season - 0.25) * 40; // Summer green
    } else {
      hue = 120; // Spring green
    }
    
    fill(hue, 80, 60);
    noStroke();
    ellipse(x, y, leaf.size, leaf.size);
  }
  
  // Snowfall effect during winter
  if (season > 0.75) {
    for (let flake of snowflakes) {
      flake.y += flake.speed;
      flake.sway += 0.02;
      flake.x += sin(flake.sway) * 0.3;
      
      if (flake.y > height) {
        flake.y = -10;
        flake.x = random(width);
      }
      
      fill(360, 0, 100);
      noStroke();
      ellipse(flake.x, flake.y, flake.size, flake.size);
    }
    
    // Draw snow on the ground
    fill(360, 0, 100);
    noStroke();
    beginShape();
    for (let x = 0; x < width; x += 20) {
      let y = height - 10 + sin(x * 0.05 + time) * 5;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
  
  // Bloom effect in spring
  if (season < 0.25) {
    let budCount = 100;
    for (let i = 0; i < budCount; i++) {
      let angle = time * 0.2 + i * 0.1;
      let radius = tree.canopy.radius + sin(time * 0.3 + i) * 30;
      let x = tree.canopy.x + cos(angle) * radius;
      let y = tree.canopy.y + sin(angle) * radius;
      
      // Spring bud color
      fill(60, 80, 80);
      noStroke();
      ellipse(x, y, 4 + sin(time * 0.5 + i) * 2, 4 + sin(time * 0.5 + i) * 2);
    }
    
    // Flower buds
    let flowerCount = 50;
    for (let i = 0; i < flowerCount; i++) {
      let angle = time * 0.1 + i * 0.2;
      let radius = tree.canopy.radius + sin(time * 0.2 + i) * 40;
      let x = tree.canopy.x + cos(angle) * radius;
      let y = tree.canopy.y + sin(angle) * radius;
      
      // Colorful flowers
      let hue = (time * 20 + i * 10) % 360;
      fill(hue, 80, 80);
      noStroke();
      ellipse(x, y, 6, 6);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
