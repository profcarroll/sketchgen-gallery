let trace = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  
  // Initialize the trace with a few hundred points for ECG-like rhythm
  for (let i = 0; i < 800; i++) {
    trace.push({
      x: i * 2,
      y: height / 2 + sin(i * 0.05 + time * 0.01) * 30,
      age: i
    });
  }
}

function draw() {
  background(0);
  
  // Draw the glowing trace
  strokeWeight(3);
  noFill();
  
  // Create a dynamic color that pulses gently
  let hue = (time * 0.3) % 100;
  stroke(hue, 100, 100);
  
  beginShape();
  for (let i = 0; i < trace.length; i++) {
    let p = trace[i];
    
    // Add some rhythm to the trace
    let offset = sin(p.age * 0.1 + time * 0.02) * 15;
    vertex(p.x, p.y + offset);
  }
  endShape();
  
  // Update the trace positions
  for (let i = 0; i < trace.length; i++) {
    trace[i].x -= 3; // Move from left to right
    
    // Reset points that go off screen
    if (trace[i].x < -10) {
      trace[i].x = width + 10;
      trace[i].y = height / 2 + sin(trace[i].age * 0.05 + time * 0.01) * 30;
    }
    
    // Add subtle variation to the y position
    trace[i].y += sin(trace[i].age * 0.03 + time * 0.01) * 0.2;
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
