let heartbeats = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Generate a highly irregular EKG waveform with predictable groupings
  for (let i = 0; i < 3000; i++) {
    let x = i * 1.5;
    let y = 0;
    
    // Main heartbeat peak - regular grouping pattern
    if (i % random(80, 120) === 0) {
      y += random(100, 150);
    }
    
    // Additional spikes for chaotic pattern
    if (i % random(30, 70) === 0) {
      y += random(-50, -20);
    }
    
    // Add groupings of spikes and dips
    if (i % random(100, 150) < 20) {
      for (let j = 0; j < 3; j++) {
        if (i + j * 10 < 3000) {
          // Ensure we don't access undefined elements
          if (heartbeats[i + j * 10]) {
            heartbeats[i + j * 10].y += random(-40, 40);
          }
        }
      }
    }
    
    // Random irregularities for natural variation
    if (random() > 0.98) {
      y += random(-60, 60);
    }
    
    // Add some smooth but unpredictable waves
    y += sin(i * 0.05 + time * 0.01) * random(10, 30);
    
    // Add chaotic noise for unpredictability
    y += random(-15, 15);
    
    heartbeats.push({ x, y });
  }
}

function draw() {
  background(0);
  
  // Animate the scrolling effect
  time += 2;
  
  strokeWeight(3);
  noFill();
  
  // Draw main EKG line with intense neon glow
  drawingContext.shadowBlur = 25;
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
    let x = heartbeats[i].x - time * 0.6;
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
    let x = heartbeats[i].x - time * 0.8;
    let y = heartbeats[i].y;
    
    if (x < -100) x += width + 200;
    
    vertex(x, height/2 + y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
