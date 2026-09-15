let seasons = ['spring', 'summer', 'autumn', 'winter'];
let currentSeason = 0;
let seasonProgress = 0;
let leaves = [];
let snowflakes = [];
let buds = [];
let flowers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize tree leaves
  for (let i = 0; i < 200; i++) {
    leaves.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      size: random(5, 15),
      color: color(0, 150, 0),
      originalY: random(height * 0.3, height * 0.7)
    });
  }
  
  // Initialize snowflakes
  for (let i = 0; i < 300; i++) {
    snowflakes.push({
      x: random(width),
      y: random(-50, -10),
      speed: random(0.5, 2),
      size: random(1, 3)
    });
  }
  
  // Initialize buds
  for (let i = 0; i < 50; i++) {
    buds.push({
      x: random(width),
      y: random(height * 0.4, height * 0.6),
      size: random(2, 5),
      color: color(180, 100, 50)
    });
  }
}

function draw() {
  // Update season progress
  seasonProgress += 0.002;
  if (seasonProgress >= 1) {
    seasonProgress = 0;
    currentSeason = (currentSeason + 1) % seasons.length;
  }
  
  // Draw sky background
  let skyColor;
  switch(seasons[currentSeason]) {
    case 'spring':
      skyColor = color(135, 206, 235);
      break;
    case 'summer':
      skyColor = color(135, 206, 235);
      break;
    case 'autumn':
      skyColor = color(255, 165, 0);
      break;
    case 'winter':
      skyColor = color(240, 248, 255);
      break;
  }
  
  background(skyColor);
  
  // Draw ground
  fill(34, 139, 34);
  rect(0, height * 0.7, width, height * 0.3);
  
  // Draw hill
  noStroke();
  fill(34, 139, 34);
  beginShape();
  vertex(0, height * 0.7);
  for (let i = 0; i < width; i += 20) {
    let y = height * 0.7 + noise(i * 0.01, frameCount * 0.01) * 30;
    vertex(i, y);
  }
  vertex(width, height * 0.7);
  endShape(CLOSE);
  
  // Draw tree trunk
  fill(101, 67, 33);
  rect(width/2 - 15, height * 0.6, 30, height * 0.3);
  
  // Draw leaves based on season
  switch(seasons[currentSeason]) {
    case 'spring':
      drawSpringLeaves();
      break;
    case 'summer':
      drawSummerLeaves();
      break;
    case 'autumn':
      drawAutumnLeaves();
      break;
    case 'winter':
      drawWinterLeaves();
      break;
  }
  
  // Draw snow
  if (seasons[currentSeason] === 'winter') {
    updateAndDrawSnow();
  }
  
  // Draw buds and flowers for spring transition
  if (seasons[currentSeason] === 'spring') {
    updateAndDrawBuds();
    updateAndDrawFlowers();
  }
}

function drawSpringLeaves() {
  fill(0, 200, 0);
  for (let leaf of leaves) {
    ellipse(leaf.x, leaf.y, leaf.size, leaf.size);
  }
}

function drawSummerLeaves() {
  fill(0, 150, 0);
  for (let leaf of leaves) {
    ellipse(leaf.x, leaf.y, leaf.size, leaf.size);
  }
}

function drawAutumnLeaves() {
  // Transition colors from green to red/orange
  let r = map(seasonProgress, 0, 1, 0, 255);
  let g = map(seasonProgress, 0, 1, 150, 100);
  let b = map(seasonProgress, 0, 1, 0, 0);
  
  fill(r, g, b);
  for (let leaf of leaves) {
    ellipse(leaf.x, leaf.y, leaf.size, leaf.size);
  }
}

function drawWinterLeaves() {
  // Leaves are shed and covered in snow
  noFill();
  stroke(255);
  for (let leaf of leaves) {
    ellipse(leaf.x, leaf.y, leaf.size, leaf.size);
  }
}

function updateAndDrawSnow() {
  fill(255);
  for (let flake of snowflakes) {
    flake.y += flake.speed;
    if (flake.y > height) {
      flake.y = random(-50, -10);
      flake.x = random(width);
    }
    ellipse(flake.x, flake.y, flake.size, flake.size);
  }
}

function updateAndDrawBuds() {
  fill(180, 100, 50);
  for (let bud of buds) {
    ellipse(bud.x, bud.y, bud.size, bud.size);
  }
}

function updateAndDrawFlowers() {
  fill(255, 105, 180); // Pink
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height * 0.4, height * 0.6);
    ellipse(x, y, 5, 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
