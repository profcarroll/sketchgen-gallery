let inkSpots = [];
let paperTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create paper texture
  paperTexture = createGraphics(width, height);
  paperTexture.background(240);
  paperTexture.noiseDetail(2, 0.5);
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const n = paperTexture.noise(x * 0.01, y * 0.01) * 10;
      if (n > 5) {
        paperTexture.stroke(230 + n);
        paperTexture.point(x, y);
      }
    }
  }
  
  // Initialize ink spots
  for (let i = 0; i < 20; i++) {
    inkSpots.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(50, 150),
      speed: random(0.3, 1.0),
      color: color(70, 20, 100, 180),
      branches: [],
      isGrowing: true
    });
  }
}

function draw() {
  // Draw textured paper background
  image(paperTexture, 0, 0);
  
  // Update and draw ink spots
  for (let i = 0; i < inkSpots.length; i++) {
    const spot = inkSpots[i];
    
    if (spot.isGrowing) {
      spot.radius += spot.speed;
      
      // Add branches when radius reaches certain threshold
      if (spot.radius > spot.maxRadius * 0.3 && spot.branches.length < 8) {
        if (random() < 0.3) {
          spot.branches.push({
            x: spot.x + random(-20, 20),
            y: spot.y + random(-20, 20),
            radius: 0,
            speed: random(0.5, 1.5)
          });
        }
      }
      
      // Stop growing when reaches max
      if (spot.radius >= spot.maxRadius) {
        spot.isGrowing = false;
      }
    }
    
    // Draw main spot
    noStroke();
    fill(spot.color);
    ellipse(spot.x, spot.y, spot.radius * 2, spot.radius * 2);
    
    // Draw branches
    for (let j = 0; j < spot.branches.length; j++) {
      const branch = spot.branches[j];
      if (branch.radius < 30) {
        branch.radius += branch.speed;
        fill(red(spot.color), green(spot.color), blue(spot.color), 150);
        ellipse(branch.x, branch.y, branch.radius * 2, branch.radius * 2);
      }
    }
    
    // Fade out old spots
    if (spot.radius > spot.maxRadius * 0.8 && random() < 0.01) {
      spot.color.setAlpha(alpha(spot.color) - 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
