let threads = [];
let grid = [];
const GRID_SIZE = 20;
const THREAD_COUNT = 100;
const MAX_CONNECTIONS = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid for spatial hashing
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create initial threads
  for (let i = 0; i < THREAD_COUNT; i++) {
    threads.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(360),
      saturation: random(50, 100),
      brightness: random(70, 100),
      tension: random(0.1, 0.5),
      connections: [],
      history: []
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for motion trails
  
  // Clear grid
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw threads
  for (let i = 0; i < threads.length; i++) {
    let thread = threads[i];
    
    // Update position with tension effect
    thread.x += thread.vx * thread.tension;
    thread.y += thread.vy * thread.tension;
    
    // Bounce off edges
    if (thread.x < 0 || thread.x > width) thread.vx *= -1;
    if (thread.y < 0 || thread.y > height) thread.vy *= -1;
    
    // Store position for history trail
    thread.history.push({x: thread.x, y: thread.y});
    if (thread.history.length > 30) {
      thread.history.shift();
    }
    
    // Add to grid
    let gridX = floor(thread.x / (width / GRID_SIZE));
    let gridY = floor(thread.y / (height / GRID_SIZE));
    if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
      grid[gridX][gridY].push(i);
    }
    
    // Draw history trail
    noFill();
    stroke(thread.hue, thread.saturation, thread.brightness, 0.5);
    strokeWeight(1);
    beginShape();
    for (let h = 0; h < thread.history.length; h++) {
      vertex(thread.history[h].x, thread.history[h].y);
    }
    endShape();
    
    // Draw main thread
    noStroke();
    fill(thread.hue, thread.saturation, thread.brightness, 1);
    ellipse(thread.x, thread.y, 3, 3);
  }
  
  // Find connections between threads in adjacent grid cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid[i][j];
      
      // Connect to neighbors
      for (let k = 0; k < cell.length; k++) {
        let a = cell[k];
        
        // Check adjacent cells
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            
            let ni = i + di;
            let nj = j + dj;
            
            if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
              for (let l = 0; l < grid[ni][nj].length; l++) {
                let b = grid[ni][nj][l];
                
                // Connect only once
                if (a < b) {
                  let threadA = threads[a];
                  let threadB = threads[b];
                  
                  let dx = threadA.x - threadB.x;
                  let dy = threadA.y - threadB.y;
                  let distance = sqrt(dx * dx + dy * dy);
                  
                  // Only connect if within range
                  if (distance < 100 && threadA.connections.length < MAX_CONNECTIONS) {
                    stroke(threadA.hue, threadA.saturation, threadA.brightness, 0.7);
                    strokeWeight(0.5);
                    line(threadA.x, threadA.y, threadB.x, threadB.y);
                    
                    // Add to connections
                    if (!threadA.connections.includes(b)) {
                      threadA.connections.push(b);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Occasionally form geometric motifs by adjusting tensions
  if (frameCount % 120 === 0) {
    for (let i = 0; i < threads.length; i++) {
      let thread = threads[i];
      thread.tension = random(0.1, 0.5);
      
      // Occasionally make a thread form a geometric pattern
      if (random() < 0.2) {
        let targetX = random(width);
        let targetY = random(height);
        let dx = targetX - thread.x;
        let dy = targetY - thread.y;
        let dist = sqrt(dx * dx + dy * dy);
        
        // Apply attraction to target with some randomness
        if (dist > 5) {
          thread.vx += dx / dist * 0.02;
          thread.vy += dy / dist * 0.02;
        }
      }
    }
  }
  
  // Occasionally change thread colors for dynamic patterns
  if (frameCount % 60 === 0) {
    for (let i = 0; i < threads.length; i++) {
      let thread = threads[i];
      thread.hue = (thread.hue + random(5, 15)) % 360;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
