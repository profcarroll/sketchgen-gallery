let tiles = [];
let tileCount = 0;
let maxTiles = 200;
let animationSpeed = 0.01;
let constructionPhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Initialize with a few tiles
  for (let i = 0; i < 5; i++) {
    tiles.push({
      x: random(width),
      y: random(height),
      w: random(80, 150),
      h: random(80, 150),
      hue: random(360),
      rotation: random(TWO_PI),
      isSettling: false,
      settleProgress: 0,
      targetX: 0,
      targetY: 0,
      targetW: 0,
      targetH: 0
    });
    tileCount++;
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 10, 0.05);

  constructionPhase += animationSpeed;

  // Draw all tiles
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];

    if (!tile.isSettling) {
      // Random movement to simulate ongoing construction
      tile.x += sin(constructionPhase + i) * 0.5;
      tile.y += cos(constructionPhase + i) * 0.5;

      // Gradually shift towards new positions
      if (random() < 0.01 && tileCount < maxTiles) {
        tile.isSettling = true;
        tile.settleProgress = 0;
        tile.targetX = random(width);
        tile.targetY = random(height);
        tile.targetW = random(80, 150);
        tile.targetH = random(80, 150);
        tiles.push({
          x: tile.x + random(-200, 200),
          y: tile.y + random(-200, 200),
          w: random(80, 150),
          h: random(80, 150),
          hue: (tile.hue + random(-30, 30)) % 360,
          rotation: random(TWO_PI),
          isSettling: false,
          settleProgress: 0,
          targetX: 0,
          targetY: 0,
          targetW: 0,
          targetH: 0
        });
        tileCount++;
      }
    } else {
      // Settling animation
      tile.settleProgress += 0.02;
      if (tile.settleProgress >= 1) {
        tile.isSettling = false;
        tile.x = tile.targetX;
        tile.y = tile.targetY;
        tile.w = tile.targetW;
        tile.h = tile.targetH;
      } else {
        // Smooth settling motion
        tile.x = lerp(tile.x, tile.targetX, tile.settleProgress);
        tile.y = lerp(tile.y, tile.targetY, tile.settleProgress);
        tile.w = lerp(tile.w, tile.targetW, tile.settleProgress);
        tile.h = lerp(tile.h, tile.targetH, tile.settleProgress);
      }
    }

    // Draw the tile with woodblock ink aesthetic
    push();
    translate(tile.x, tile.y);
    rotate(tile.rotation);
    
    // Tile body with soft shadow effect
    fill(tile.hue, 80, 90, 0.8);
    rectMode(CENTER);
    rect(0, 0, tile.w, tile.h);

    // Tile boundary lines (woodblock style)
    noFill();
    stroke(tile.hue, 100, 100, 0.6);
    strokeWeight(2);
    rect(0, 0, tile.w, tile.h);

    // Subtle texture lines
    stroke(tile.hue, 80, 80, 0.3);
    strokeWeight(1);
    for (let j = 0; j < 5; j++) {
      let offset = map(j, 0, 4, -tile.w/2, tile.w/2);
      line(offset, -tile.h/2, offset, tile.h/2);
    }
    pop();
  }

  // Limit tiles to prevent overflow
  if (tileCount > maxTiles) {
    tiles.splice(0, tileCount - maxTiles);
    tileCount = maxTiles;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
