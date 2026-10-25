let stars = [];
let time = 0;
const GRID_SIZE = 50;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize grid
  for (let x = 0; x < width; x += GRID_SIZE) {
    grid[x] = [];
    for (let y = 0; y < height; y += GRID_SIZE) {
      grid[x][y] = [];
    }
  }
  
  // Create many stars that form constellations
  for (let i = 0; i < 1500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      hue: random(180, 240), // Iridescent blue-green
      saturation: random(60, 90),
      brightness: random(70, 95),
      alpha: random(100, 200),
      speedX: random(-0.05, 0.05),
      speedY: random(-0.05, 0.05),
      phase: random(TWO_PI),
      life: random(1000, 3000),
      age: 0
    });
  }
  
  // Distribute stars to grid cells
  for (let star of stars) {
    let gridX = floor(star.x / GRID_SIZE) * GRID_SIZE;
    let gridY = floor(star.y / GRID_SIZE) * GRID_SIZE;
    if (grid[gridX] && grid[gridX][gridY]) {
      grid[gridX][gridY].push(star);
    }
  }
}

function draw() {
  background(10, 15, 20);
  
  time += 0.0005;
  
  // Update and draw all stars
  for (let star of stars) {
    // Update position
    star.x += star.speedX;
    star.y += star.speedY;
    
    // Add subtle drift based on time
    star.x += sin(time * 0.1 + star.phase) * 0.2;
    star.y += cos(time * 0.1 + star.phase) * 0.2;
    
    // Age the star
    star.age++;
    
    // Fade out as it ages
    star.alpha = map(star.age, 0, star.life, 255, 0);
    
    // Reset if too old
    if (star.age > star.life) {
      star.x = random(width);
      star.y = random(height);
      star.age = 0;
      star.phase = random(TWO_PI);
    }
    
    // Draw the star
    fill(star.hue + sin(time * 2 + star.age * 0.01) * 30, 
         star.saturation, 
         star.brightness, 
         star.alpha);
    
    ellipse(star.x, star.y, star.size);
  }
  
  // Draw constellations using grid
  let connections = [];
  for (let star of stars) {
    let gridX = floor(star.x / GRID_SIZE) * GRID_SIZE;
    let gridY = floor(star.y / GRID_SIZE) * GRID_SIZE;
    
    // Check nearby grid cells
    for (let dx = -GRID_SIZE; dx <= GRID_SIZE; dx += GRID_SIZE) {
      for (let dy = -GRID_SIZE; dy <= GRID_SIZE; dy += GRID_SIZE) {
        let checkX = gridX + dx;
        let checkY = gridY + dy;
        
        if (grid[checkX] && grid[checkX][checkY]) {
          for (let otherStar of grid[checkX][checkY]) {
            if (star !== otherStar) {
              let dx = star.x - otherStar.x;
              let dy = star.y - otherStar.y;
              let distance = sqrt(dx * dx + dy * dy);
              
              if (distance < 80 && connections.length < 500) {
                connections.push({
                  x1: star.x,
                  y1: star.y,
                  x2: otherStar.x,
                  y2: otherStar.y,
                  alpha: map(distance, 0, 80, 50, 0)
                });
              }
            }
          }
        }
      }
    }
  }
  
  // Draw all connections at once
  for (let conn of connections) {
    let c = color(
      sin(time + conn.x1 * 0.01) * 20 + 180,
      60,
      90,
      conn.alpha
    );
    stroke(c);
    line(conn.x1, conn.y1, conn.x2, conn.y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
