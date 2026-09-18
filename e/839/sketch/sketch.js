let pixels = [];
let grid = [];
let gridSize = 20;
let pulseRadius = 0;
let maxPulseRadius = 100;
let pulseSpeed = 2;
let pulseActive = false;
let patternFormed = false;
let time = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize pixels
  for (let i = 0; i < 800; i++) {
    pixels.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(2, 6),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      targetX: random(width),
      targetY: random(height),
      formed: false,
      pulse: 0
    });
  }
  
  // Initialize grid for spatial hashing
  let cols = Math.ceil(width / gridSize);
  let rows = Math.ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(0, 0, 10);
  time++;
  
  // Update and display pixels
  for (let i = 0; i < pixels.length; i++) {
    let p = pixels[i];
    
    if (!p.formed) {
      // Move toward target
      let dx = p.targetX - p.x;
      let dy = p.targetY - p.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        p.formed = true;
        p.targetX = p.x;
        p.targetY = p.y;
      } else {
        p.x += dx * 0.05;
        p.y += dy * 0.05;
      }
    } else {
      // Oscillate
      p.angle += p.speed * 0.02;
      p.x += Math.cos(p.angle) * 0.5;
      p.y += Math.sin(p.angle) * 0.5;
      
      // Occasionally change target for randomness
      if (random() < 0.01) {
        p.targetX = random(width);
        p.targetY = random(height);
      }
    }
    
    // Draw pixel
    fill(p.hue, 80, 90, 0.8);
    ellipse(p.x, p.y, p.size);
  }
  
  // Check for pattern formation
  if (!patternFormed && time > 200) {
    let formedCount = pixels.filter(p => p.formed).length;
    if (formedCount > 750) {
      patternFormed = true;
      pulseActive = true;
      pulseRadius = 0;
    }
  }
  
  // Handle pulsing effect
  if (pulseActive) {
    pulseRadius += pulseSpeed;
    
    if (pulseRadius < maxPulseRadius) {
      // Draw pulse ring
      noFill();
      stroke(200, 100, 100, 0.5);
      ellipse(width/2, height/2, pulseRadius * 2);
      
      // Fade out pixels from center
      let centerX = width / 2;
      let centerY = height / 2;
      for (let i = 0; i < pixels.length; i++) {
        let p = pixels[i];
        let dx = p.x - centerX;
        let dy = p.y - centerY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < pulseRadius && dist > pulseRadius - 10) {
          fill(p.hue, 80, 90, 0.3);
          ellipse(p.x, p.y, p.size);
        }
      }
    } else {
      // Reset
      pulseActive = false;
      patternFormed = false;
      time = 0;
      
      // Reinitialize
      for (let i = 0; i < pixels.length; i++) {
        let p = pixels[i];
        p.x = random(width);
        p.y = random(height);
        p.hue = random(360);
        p.targetX = random(width);
        p.targetY = random(height);
        p.formed = false;
        p.pulse = 0;
      }
    }
  }
  
  // Spatial hashing for connections
  if (time % 10 === 0) {
    // Clear grid
    let cols = Math.ceil(width / gridSize);
    let rows = Math.ceil(height / gridSize);
    for (let i = 0; i < grid.length; i++) {
      grid[i].length = 0;
    }
    
    // Fill grid
    for (let i = 0; i < pixels.length; i++) {
      let p = pixels[i];
      let col = Math.floor(p.x / gridSize);
      let row = Math.floor(p.y / gridSize);
      
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        let index = row * cols + col;
        grid[index].push(p);
      }
    }
    
    // Draw connections
    stroke(200, 50, 80, 0.3);
    noFill();
    for (let i = 0; i < pixels.length; i++) {
      let p = pixels[i];
      let col = Math.floor(p.x / gridSize);
      let row = Math.floor(p.y / gridSize);
      
      // Check neighbors
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          let neighborCol = col + x;
          let neighborRow = row + y;
          
          if (neighborCol >= 0 && neighborCol < cols && 
              neighborRow >= 0 && neighborRow < rows) {
            let index = neighborRow * cols + neighborCol;
            for (let j = 0; j < grid[index].length; j++) {
              let other = grid[index][j];
              if (other !== p) {
                let dx = p.x - other.x;
                let dy = p.y - other.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 50) {
                  line(p.x, p.y, other.x, other.y);
                }
              }
            }
          }
        }
      }
    }
  }
}
