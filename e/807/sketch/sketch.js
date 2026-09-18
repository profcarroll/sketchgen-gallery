let planes = [];
const numPlanes = 15;
const maxRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create overlapping planes with varying colors and sizes
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      radius: random(100, maxRadius),
      hue: random(360),
      speed: random(0.002, 0.005),
      timeOffset: random(1000)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  // Draw each plane with subtle color shifts
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    
    // Calculate dynamic hue shift based on position and time
    const time = millis() * p.speed + p.timeOffset;
    const hueShift = sin(time) * 20;
    const currentHue = (p.hue + hueShift) % 360;
    
    // Create gradient effect from center outward
    const steps = 50;
    for (let j = 0; j < steps; j++) {
      const radius = map(j, 0, steps - 1, 0, p.radius);
      const alpha = map(j, 0, steps - 1, 0.8, 0.05);
      
      // Calculate color with hue shift
      const hue = (currentHue + j * 2) % 360;
      fill(hue, 80, 90, alpha);
      
      // Draw a circle segment to create soft edges
      noStroke();
      ellipse(width / 2, height / 2, radius * 2, radius * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
