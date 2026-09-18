let rings = [];
let hueOffset = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create concentric arcs
  for (let i = 0; i < 15; i++) {
    rings.push({
      radius: 20 + i * 20,
      strokeWidth: 2 + i * 0.3,
      speed: 0.01 + i * 0.002
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  // Update hue offset for color cycling
  hueOffset = (hueOffset + 0.5) % 360;
  
  // Draw each ring
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    
    // Calculate pulsation
    let pulse = sin(frameCount * ring.speed) * 0.3 + 1;
    let radius = ring.radius * pulse;
    
    // Calculate color based on hue offset and ring index
    let hue = (hueOffset + i * 24) % 360;
    stroke(hue, 100, 100, 0.7);
    noFill();
    strokeWeight(ring.strokeWidth);
    
    // Draw arc
    arc(width/2, height/2, radius*2, radius*2, 0, PI);
  }
}
