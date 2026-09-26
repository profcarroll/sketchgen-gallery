let heartbeats = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Generate a realistic EKG waveform pattern with irregular spikes and dips
  for (let i = 0; i < 2000; i++) {
    let x = i * 2;
    let y = 0;
    
    // Main heartbeat peak
    if (i % 100 === 0) {
      y += random(80, 120);
    }
    
    // Irregular spikes and dips
    if (i % 150 === 0) {
      y += random(-50, -20);
    }
    
    if (i % 200 === 0) {
      y += random(-30, 10);
    }
    
    // Random irregularities
    if (random() > 0.9) {
      y += random(-40, 40);
    }
    
    heartbeats.push({ x, y });
  }
}

function draw() {
  background(0);
  
  // Animate the scrolling effect
  time += 3;
  
  strokeWeight(2);
  noFill();
  
  // Draw main EKG line with glow
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(0, 255, 255);
  
  beginShape();
  for (let i = 0; i < heartbeats.length; i++) {
    let x = heartbeats[i].x - time;
    let y = heartbeats[i].y;
    
    // Wrap around the canvas
    if (x < -100) x += width + 200;
    
    vertex(x, height/2 + y);
  }
  endShape();
  
  // Reset shadow
  drawingContext.shadowBlur = 0;
  
  // Draw a second, fainter line for more visual complexity
  stroke(0, 255, 255, 100);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < heartbeats.length; i++) {
    let x = heartbeats[i].x - time * 0.7;
    let y = heartbeats[i].y;
    
    if (x < -100) x += width + 200;
    
    vertex(x, height/2 + y);
  }
  endShape();
}
