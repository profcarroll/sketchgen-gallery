let hexagons = [];
let time = 0;
const CHANNEL_WIDTH = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create honeycomb pattern with hexagons
  const hexSize = 40;
  const cols = ceil(width / (hexSize * 1.5));
  const rows = ceil(height / (hexSize * sqrt(3)));
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
      const y = row * hexSize * sqrt(3);
      
      // Only create hexagons within canvas bounds
      if (x > -hexSize && x < width + hexSize && y > -hexSize && y < height + hexSize) {
        hexagons.push({
          x,
          y,
          size: hexSize,
          hue: random(10, 40), // Warm red/orange range
          saturation: 80,
          brightness: 70,
          speed: random(0.001, 0.005),
          phase: random(TWO_PI)
        });
      }
    }
  }
}

function draw() {
  background(10, 15, 30);
  
  time += 0.01;
  
  // Draw the main honeycomb pattern
  for (let hex of hexagons) {
    const pulse = sin(time * hex.speed + hex.phase) * 0.5 + 0.5;
    
    // Calculate dynamic hue based on position and time
    const hueShift = (time * 10 + hex.x * 0.02 + hex.y * 0.02 + pulse * 20) % 360;
    
    // Base warm colors: deep reds, oranges, and some blues for temperature variation
    let h = (hueShift + hex.hue) % 360;
    
    // Shift towards blue in the channel area for thermal effect
    const channelEffect = abs((hex.y - hex.x * 0.5) / CHANNEL_WIDTH);
    if (channelEffect < 1) {
      const intensity = map(channelEffect, 0, 1, 1, 0);
      // Blend towards cooler blues in the channel
      h = lerp(h, 200, intensity * 0.7); // Mix with blue
    }
    
    fill(h, hex.saturation, hex.brightness + pulse * 30, 180);
    
    push();
    translate(hex.x, hex.y);
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI / 6 * i;
      const px = cos(angle) * hex.size * (0.9 + pulse * 0.2);
      const py = sin(angle) * hex.size * (0.9 + pulse * 0.2);
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add subtle pulsing channel effect
  const channelOffset = time * 30;
  for (let i = 0; i < 5; i++) {
    const y = (channelOffset + i * 200) % (height + 400) - 200;
    
    // Draw a glowing line along the channel
    const alpha = map(sin(time * 3 + i), -1, 1, 50, 150);
    const width = map(sin(time * 5 + i), -1, 1, 80, 120);
    
    // Channel line with gradient
    for (let j = 0; j < 30; j++) {
      const progress = j / 30;
      const channelX = y * 0.5 + sin(progress * TWO_PI) * 100;
      
      // Dynamic color along the channel
      const channelHue = (time * 20 + progress * 100) % 360;
      const channelSat = 80;
      const channelBri = 70 + sin(time + progress * 5) * 20;
      
      fill(channelHue, channelSat, channelBri, alpha * (1 - progress));
      ellipse(channelX, y, width * (1 - progress), 20);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
