let planes = [];
let wavePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create multiple overlapping color planes
  for (let i = 0; i < 5; i++) {
    planes.push({
      color: color(
        random(100, 255),
        random(100, 255),
        random(100, 255),
        random(200, 255)
      ),
      speed: random(0.001, 0.005),
      amplitude: random(20, 60),
      frequency: random(0.005, 0.02),
      yOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  wavePhase += 0.02;
  
  // Draw each color plane
  for (let i = 0; i < planes.length; i++) {
    let plane = planes[i];
    
    // Create a wave pattern that moves horizontally
    for (let x = 0; x < width; x += 2) {
      // Calculate wave displacement
      let wave = sin((x * plane.frequency) + wavePhase + plane.yOffset) * plane.amplitude;
      
      // Calculate color variation based on wave position and time
      let hueShift = sin(wavePhase * 0.5 + x * 0.01) * 30;
      let saturation = 200 + sin(wavePhase * 0.7 + x * 0.02) * 55;
      let brightness = 150 + sin(wavePhase * 0.3 + x * 0.03) * 55;
      
      fill(
        hue(plane.color) + hueShift,
        saturation,
        brightness,
        alpha(plane.color)
      );
      
      // Draw a vertical strip with wave displacement
      let y = height * (0.2 + i * 0.15);
      rect(x, y + wave, 2, 20);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
