let rings = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize concentric rings
  for (let i = 0; i < 15; i++) {
    rings.push({
      radius: 0,
      speed: random(0.2, 0.8),
      direction: random() > 0.5 ? 1 : -1,
      color: color(0)
    });
  }
  
  // Define vibrant color palette
  colors = [
    color(255, 215, 0),   // Gold
    color(0, 128, 0),     // Deep Green
    color(139, 0, 0)      // Rich Red
  ];
}

function draw() {
  background(0);
  
  // Update and draw rings
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Update radius with oscillating motion
    ring.radius += ring.speed * ring.direction;
    
    // Reverse direction when reaching limits
    if (ring.radius > width * 0.8 || ring.radius < 0) {
      ring.direction *= -1;
    }
    
    // Cycle through colors based on ring index
    let colorIndex = floor(i / 3) % colors.length;
    ring.color = lerpColor(colors[colorIndex], colors[(colorIndex + 1) % colors.length], 
                          (i % 3) / 3);
    
    // Draw the ring with transparency
    noFill();
    stroke(ring.color);
    strokeWeight(2);
    ellipse(width/2, height/2, ring.radius * 2);
  }
}
