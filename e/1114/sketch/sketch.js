let noodles = [];
let hueVal = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100);
  
  // Create initial noodles
  for (let i = 0; i < 20; i++) {
    noodles.push({
      x: random(width),
      y: random(height),
      points: [],
      speed: random(0.5, 2),
      hueOffset: random(360)
    });
  }
  
  // Initialize points for each noodle
  for (let noodle of noodles) {
    for (let j = 0; j < 50; j++) {
      noodle.points.push({
        x: noodle.x + j * 10,
        y: noodle.y + random(-20, 20),
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  // Cycle background hue through warm yellows
  let bgHue = (hueVal + 30) % 360;
  background(bgHue, 80, 15);
  
  // Update hue for next frame
  hueVal = (hueVal + 0.5) % 360;
  
  // Update and draw noodles
  for (let noodle of noodles) {
    // Move the noodle
    for (let point of noodle.points) {
      point.x += noodle.speed * 0.5;
      point.y += sin(frameCount * 0.01 + point.phase) * 0.3;
      
      // Wrap around screen
      if (point.x > width) point.x = 0;
      if (point.x < 0) point.x = width;
      if (point.y > height) point.y = random(-50, 50);
      if (point.y < -50) point.y = height + random(0, 50);
    }
    
    // Draw the noodle as a smooth curve
    noFill();
    stroke(noodle.hueOffset, 80, 90);
    strokeWeight(2);
    
    beginShape();
    for (let point of noodle.points) {
      curveVertex(point.x, point.y);
    }
    endShape();
  }
}

function mousePressed() {
  // Add a new noodle at mouse position
  noodles.push({
    x: mouseX,
    y: mouseY,
    points: [],
    speed: random(0.5, 2),
    hueOffset: (hueVal + 180) % 360
  });
  
  for (let j = 0; j < 50; j++) {
    noodles[noodles.length - 1].points.push({
      x: mouseX + j * 10,
      y: mouseY + random(-20, 20),
      phase: random(TWO_PI)
    });
  }
}
