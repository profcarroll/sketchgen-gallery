let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create overlapping planes with varying colors and opacities
  for (let i = 0; i < 15; i++) {
    planes.push({
      y: random(height),
      speed: random(0.001, 0.003),
      amplitude: random(20, 60),
      frequency: random(0.005, 0.02),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(60, 90),
      opacity: random(30, 80)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw each plane with its own wave motion
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    fill(p.hue, p.saturation, p.brightness, p.opacity);
    
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      // Create undulating wave motion
      let y = p.y + sin(x * p.frequency + time * p.speed) * p.amplitude;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Gradually shift hue for continuous color transition
    p.hue = (p.hue + 0.2) % 360;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
