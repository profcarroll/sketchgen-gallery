let gradients = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create multiple gradient layers
  for (let i = 0; i < 5; i++) {
    gradients.push({
      angle: random(TWO_PI),
      speed: random(0.001, 0.003),
      radius: random(100, 200),
      hueOffset: random(360)
    });
  }
}

function draw() {
  background(0);
  
  // Draw each gradient layer
  for (let i = 0; i < gradients.length; i++) {
    let g = gradients[i];
    
    // Update rotation
    g.angle += g.speed;
    
    // Draw the rotating gradient
    push();
    translate(width/2, height/2);
    rotate(g.angle);
    
    // Create a radial gradient effect using multiple arcs
    noStroke();
    for (let j = 0; j < 12; j++) {
      let angleStep = TWO_PI / 12;
      let startAngle = j * angleStep;
      let endAngle = startAngle + angleStep;
      
      // Create a gradient from green to cyan
      let hueStart = (g.hueOffset + j * 30) % 360;
      let hueEnd = (hueStart + 120) % 360; // Cyan
      
      // Use multiple segments for smooth transition
      beginShape();
      for (let a = startAngle; a <= endAngle; a += angleStep/4) {
        let x = cos(a) * g.radius;
        let y = sin(a) * g.radius;
        
        // Interpolate hue based on position in the arc
        let t = map(a, startAngle, endAngle, 0, 1);
        let hue = lerp(hueStart, hueEnd, t);
        fill(hue, 80, 70, 0.1);
        
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Add a subtle geometric overlay
  stroke(200, 50, 80, 0.3);
  noFill();
  for (let i = 0; i < 3; i++) {
    let size = 100 + sin(frameCount * 0.005 + i) * 30;
    rectMode(CENTER);
    rect(width/2, height/2, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
