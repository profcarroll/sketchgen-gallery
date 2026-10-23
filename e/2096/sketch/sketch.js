let heartbeats = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Generate a more regular EKG waveform with predictable groupings
  for (let i = 0; i < 2000; i++) {
    let x = i * 2;
    let y = 0;
    
    // Main heartbeat peak - regular grouping pattern
    if (i % 100 === 0) {
      y += 120;
    }
    
    // Additional spikes for chaotic pattern
    if (i % 40 === 0) {
      y += random(-30, -10);
    }
    
    // Add groupings of spikes and dips
    if (i % 120 < 15) {
      for (let j = 0; j < 3; j++) {
        if (i + j * 8 < 2000) {
          heartbeats.push({ x, y: random(-20, 20) });
        }
      }
    }
    
    // Add some smooth but unpredictable waves
    y += sin(i * 0.05) * random(15, 25);
    
    // Add chaotic noise for unpredictability
    y += random(-10, 10);
    
    heartbeats.push({ x, y });
  }
}

function draw() {
  background(0);
  
  // Animate the scrolling effect
  time += 3;
  
  strokeWeight(3);
  noFill();
  
  // Draw main EKG line with intense neon glow
  drawingContext.shadowBlur = 30;
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
  stroke(0, 255, 255, 80);
  strokeWeight(1.5);
  
  beginShape();
  for (let i = 0; i < heartbeats.length; i++) {
    let x = heartbeats[i].x - time * 0.7;
    let y = heartbeats[i].y;
    
    if (x < -100) x += width + 200;
    
    vertex(x, height/2 + y);
  }
  endShape();
  
  // Draw a third, even fainter line for depth
  stroke(0, 255, 255, 40);
  strokeWeight(1);
  
  beginShape();
  for (let i = 0; i < heartbeats.length; i++) {
    let x = heartbeats[i].x - time * 0.9;
    let y = heartbeats[i].y;
    
    if (x < -100) x += width + 200;
    
    vertex(x, height/2 + y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
