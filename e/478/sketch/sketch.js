let particles = [];
let grid = [];
const gridSize = 20;
const particleCount = 800;
const springStrength = 0.01;
const mouseInfluence = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles with random positions and velocities
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 8),
      hue: random(100, 300),
      saturation: random(60, 90),
      brightness: random(70, 95),
      targetSize: random(2, 8),
      age: 0
    });
  }

  // Initialize spatial grid for efficient neighbor search
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  grid = new Array(cols * rows).fill(null).map(() => []);
}

function draw() {
  background(0, 0, 100, 0.02); // Very subtle fade effect

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Apply spring force to maintain structure
    let fx = 0;
    let fy = 0;
    
    // Find neighbors in spatial grid
    const col = Math.floor(p.x / gridSize);
    const row = Math.floor(p.y / gridSize);
    const neighbors = [];
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const neighborCol = col + dx;
        const neighborRow = row + dy;
        if (neighborCol >= 0 && neighborCol < Math.ceil(width / gridSize) &&
            neighborRow >= 0 && neighborRow < Math.ceil(height / gridSize)) {
          const index = neighborCol + neighborRow * Math.ceil(width / gridSize);
          if (grid[index]) {
            grid[index].forEach(other => {
              if (other !== p) {
                const d = dist(p.x, p.y, other.x, other.y);
                if (d < 60) {
                  neighbors.push({p: other, d});
                }
              }
            });
          }
        }
      }
    }

    // Sort neighbors by distance and apply spring forces
    neighbors.sort((a, b) => a.d - b.d);
    const maxNeighbors = 5;
    for (let j = 0; j < min(maxNeighbors, neighbors.length); j++) {
      const other = neighbors[j].p;
      const dx = other.x - p.x;
      const dy = other.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = springStrength * (60 - distance);
        fx += (dx / distance) * force;
        fy += (dy / distance) * force;
      }
    }

    // Mouse influence
    const mx = mouseX;
    const my = mouseY;
    const d = dist(p.x, p.y, mx, my);
    if (d < mouseInfluence) {
      const angle = atan2(p.y - my, p.x - mx);
      const force = (mouseInfluence - d) / mouseInfluence;
      fx += cos(angle) * force * 0.5;
      fy += sin(angle) * force * 0.5;
    }

    // Update velocity and position
    p.vx += fx;
    p.vy += fy;
    
    // Apply damping
    p.vx *= 0.95;
    p.vy *= 0.95;
    
    p.x += p.vx;
    p.y += p.vy;

    // Boundary check
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Age particle and change its properties
    p.age++;
    if (p.age > 300) {
      p.hue = (p.hue + 0.5) % 360;
      p.targetSize = random(2, 8);
    }

    // Animate size toward target
    p.size += (p.targetSize - p.size) * 0.05;

    // Draw particle as a soft blob with gradient
    const alpha = map(p.age, 0, 300, 0.3, 0.8);
    noStroke();
    fill(p.hue, p.saturation, p.brightness, alpha);
    
    // Create a subtle glow effect
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(p.hue, p.saturation, p.brightness, alpha * 0.5);
    
    ellipse(p.x, p.y, p.size, p.size);
    
    // Reset shadow for next draw
    drawingContext.shadowBlur = 0;
  }

  // Update spatial grid
  updateGrid();
}

function updateGrid() {
  // Clear grid
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }
  
  // Rebuild grid with current particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const col = Math.floor(p.x / gridSize);
    const row = Math.floor(p.y / gridSize);
    
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      const index = col + row * cols;
      grid[index].push(p);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
