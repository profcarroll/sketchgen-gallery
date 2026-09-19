let lines = [];
let audioContext;
let fft;
let amplitude;
let clickCount = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(GRAY);
  noFill();
  
  // Generate a dense network of intersecting lines
  for (let i = 0; i < 500; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);
    lines.push({x1, y1, x2, y2});
  }
  
  // Set up audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(20);
  
  // Draw the line network
  stroke(200);
  strokeWeight(0.5);
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    line(l.x1, l.y1, l.x2, l.y2);
    
    // Animate lines slightly
    if (frameCount % 30 === 0) {
      l.x1 += random(-0.5, 0.5);
      l.y1 += random(-0.5, 0.5);
      l.x2 += random(-0.5, 0.5);
      l.y2 += random(-0.5, 0.5);
      
      // Keep lines within bounds
      l.x1 = constrain(l.x1, 0, width);
      l.y1 = constrain(l.y1, 0, height);
      l.x2 = constrain(l.x2, 0, width);
      l.y2 = constrain(l.y2, 0, height);
    }
  }
  
  // Visualize audio if available
  if (clickCount > 0) {
    let spectrum = fft.analyze();
    let vol = amplitude.getLevel();
    
    // Scale visual elements based on audio
    stroke(255);
    strokeWeight(vol * 10 + 1);
    
    for (let i = 0; i < spectrum.length; i += 20) {
      let x = map(i, 0, spectrum.length, 0, width);
      let h = map(spectrum[i], 0, 255, 0, height);
      
      line(x, height, x, height - h);
    }
  }
}

function mousePressed() {
  if (clickCount === 0) {
    userStartAudio();
    clickCount++;
  }
}
