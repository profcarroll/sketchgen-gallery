let grid = [];
let connections = [];
let time = 0;
const GRID_SIZE = 40;
const CELL_SIZE = 20;
const MAX_CONNECTIONS = 1500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid points
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid.push({
        x: i * CELL_SIZE + random(-2, 2),
        y: j * CELL_SIZE + random(-2, 2),
        originalX: i * CELL_SIZE,
        originalY: j * CELL_SIZE,
        phase: random(TWO_PI)
      });
    }
  }
  
  // Create connections between nearby points
  for (let i = 0; i < grid.length; i++) {
    for (let j = i + 1; j < grid.length; j++) {
      const dx = grid[i].x - grid[j].x;
      const dy = grid[i].y - grid[j].y;
      const distance = sqrt(dx * dx + dy * dy);
      
      if (distance < CELL_SIZE * 2.5) {
        connections.push({
          a: i,
          b: j,
          length: distance,
          strength: map(distance, 0, CELL_SIZE * 2.5, 1, 0.1)
        });
      }
    }
  }
  
  // Limit connections to prevent overdraw
  if (connections.length > MAX_CONNECTIONS) {
    connections = connections.slice(0, MAX_CONNECTIONS);
  }
}

function draw() {
  background(220, 5, 5); // Deep night sky color
  
  time += 0.02;
  
  // Update grid points with dynamic movement
  for (let i = 0; i < grid.length; i++) {
    const point = grid[i];
    const pulse = sin(time + point.phase) * 0.5 + 0.5;
    const noiseOffset = map(noise(point.originalX * 0.01, point.originalY * 0.01, time * 0.3), 0, 1, -1, 1);
    
    point.x = point.originalX + sin(time * 0.7 + i) * 3 * pulse;
    point.y = point.originalY + cos(time * 0.5 + i) * 3 * pulse;
    
    // Add some chaotic movement
    point.x += noiseOffset * 2;
    point.y += noiseOffset * 2;
  }
  
  // Draw connections with dynamic opacity and color
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = grid[c.a];
    const b = grid[c.b];
    
    const distance = dist(a.x, a.y, b.x, b.y);
    const intensity = map(distance, 0, CELL_SIZE * 2.5, 1, 0.1);
    
    // Flashing electric blue and white
    const hue = (time * 20 + i * 3) % 360;
    const saturation = 100;
    const brightness = map(sin(time * 3 + i) * 0.5 + 0.5, 0, 1, 70, 100);
    
    stroke(hue, saturation, brightness, intensity * 0.8);
    strokeWeight(0.5);
    
    vertex(a.x, a.y);
    vertex(b.x, b.y);
  }
  endShape();
  
  // Draw points with glowing effect
  noStroke();
  for (let i = 0; i < grid.length; i++) {
    const point = grid[i];
    const pulse = sin(time + point.phase) * 0.5 + 0.5;
    
    const hue = (time * 10 + i * 2) % 360;
    const saturation = 80;
    const brightness = map(pulse, 0, 1, 40, 90);
    
    fill(hue, saturation, brightness, 0.7);
    ellipse(point.x, point.y, 2 + pulse * 3);
  }
  
  // Add occasional lightning flashes
  if (random() < 0.02) {
    stroke(200, 100, 100, 0.8);
    strokeWeight(2);
    line(random(width), random(height), random(width), random(height));
  }
  
  // Occasionally reset some connections to create instability
  if (frameCount % 30 === 0) {
    for (let i = 0; i < connections.length; i++) {
      if (random() < 0.05) {
        const c = connections[i];
        c.strength = random(0.1, 1);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
