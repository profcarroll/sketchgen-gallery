let stripes = [];
const numStripes = 20;
const maxRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);
  
  // Initialize stripes with random properties
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      radius: random(maxRadius * 0.3, maxRadius * 0.8),
      width: random(20, 60),
      hue: random(100)
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  // Center the drawing
  translate(width/2, height/2);
  
  // Rotate the whole scene slowly
  rotateZ(frameCount * 0.002);
  
  // Draw each stripe as a warped radial arc
  for (let i = 0; i < stripes.length; i++) {
    const s = stripes[i];
    
    // Update angle with speed and time
    s.angle += s.speed;
    
    // Create a dynamic warp effect using sine waves
    const warp = sin(frameCount * 0.01 + s.angle) * 0.5;
    const arcRadius = s.radius + warp * 50;
    
    // Calculate start and end angles for the arc
    const startAngle = s.angle - s.width * 0.02;
    const endAngle = s.angle + s.width * 0.02;
    
    // Draw a filled arc using vertices
    beginShape();
    fill(s.hue, 80, 90);
    
    // Create a circular arc with radial distortion
    for (let a = startAngle; a <= endAngle; a += 0.05) {
      const x = cos(a) * arcRadius;
      const y = sin(a) * arcRadius;
      vertex(x, y);
    }
    
    // Close the shape by connecting to center
    vertex(0, 0);
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
