let streams = [];
let points = [];
const NUM_STREAMS = 50;
const NUM_POINTS_PER_STREAM = 100;
const MAX_TRAIL_LENGTH = 200;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize streams
  for (let i = 0; i < NUM_STREAMS; i++) {
    let stream = [];
    for (let j = 0; j < NUM_POINTS_PER_STREAM; j++) {
      stream.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-500, 500),
        hue: random(180, 240), // Blue-green hues
        alpha: 0,
        size: random(1, 3)
      });
    }
    streams.push(stream);
  }
  
  // Initialize points for phosphorescent trails
  for (let i = 0; i < MAX_TRAIL_LENGTH * 5; i++) {
    points.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      hue: random(180, 240),
      alpha: 0,
      size: random(0.5, 2)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement for depth perception
  let time = millis() * 0.0002;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  
  // Draw streams
  for (let i = 0; i < streams.length; i++) {
    let stream = streams[i];
    beginShape(LINES);
    noFill();
    strokeWeight(1);
    
    for (let j = 0; j < stream.length; j++) {
      let p = stream[j];
      
      // Update position slowly
      p.x += random(-0.5, 0.5);
      p.y += random(-0.3, 0.3);
      p.z += random(0.2, 0.8);
      
      // Fade in and out
      if (j === 0) {
        p.alpha = min(p.alpha + 0.01, 1);
      } else {
        p.alpha *= 0.99;
      }
      
      // Reset stream if it goes off screen or is too faded
      if (p.z > 500 || p.alpha < 0.01) {
        p.x = random(-width/2, width/2);
        p.y = random(-height/2, height/2);
        p.z = -500;
        p.alpha = 0;
      }
      
      stroke(p.hue, 80, 90, p.alpha);
      vertex(p.x, p.y, p.z);
    }
    endShape();
  }
  
  // Draw phosphorescent trails
  beginShape(POINTS);
  noStroke();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    
    // Slow movement
    p.x += random(-0.2, 0.2);
    p.y += random(-0.1, 0.1);
    p.z += random(0.1, 0.3);
    
    // Fade out
    p.alpha *= 0.98;
    
    // Reset if faded or off-screen
    if (p.alpha < 0.01 || abs(p.x) > width/2 + 100 || abs(p.y) > height/2 + 100 || p.z > 500) {
      p.x = random(-width/2, width/2);
      p.y = random(-height/2, height/2);
      p.z = -500;
      p.alpha = 0;
    }
    
    fill(p.hue, 80, 90, p.alpha);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
