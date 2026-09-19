let particles = [];
const particleCount = 1500;
let fft;
let amplitude;
let audioContextStarted = false;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      hue: random(360),
      size: random(2, 6),
      trail: []
    });
  }
  
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0, 0, 0, 0.1);
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check with bounce
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Add current position to trail
    p.trail.push({x: p.x, y: p.y});
    if (p.trail.length > 20) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, 100, 100, 0.7);
    beginShape();
    for (let pos of p.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw particle
    fill(p.hue, 100, 100);
    noStroke();
    ellipse(p.x, p.y, p.size);
    
    // Apply forces from other particles
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        let other = particles[j];
        let dx = p.x - other.x;
        let dy = p.y - other.y;
        let distance = sqrt(dx * dx + dy * dy);
        
        // Repulsion when too close
        if (distance < 50 && distance > 0) {
          let force = map(distance, 0, 50, 1, 0);
          p.vx += dx * force * 0.001;
          p.vy += dy * force * 0.001;
        }
        
        // Attraction when far apart
        if (distance > 100 && distance < 200) {
          let force = map(distance, 100, 200, 0.5, 0);
          p.vx -= dx * force * 0.0001;
          p.vy -= dy * force * 0.0001;
        }
      }
    }
    
    // Slowly adjust hue for color cycling
    p.hue = (p.hue + 0.2) % 360;
  }
  
  // Use audio to influence the particles if available
  if (audioContextStarted && fft && amplitude) {
    let spectrum = fft.analyze();
    let vol = amplitude.getLevel();
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      let index = floor(map(i, 0, particles.length, 0, spectrum.length));
      let value = spectrum[index] / 255;
      
      // Modify particle velocity based on audio
      p.vx += (value - 0.5) * 0.1;
      p.vy += (value - 0.5) * 0.1;
    }
  }
}

function mousePressed() {
  if (!audioContextStarted) {
    userStartAudio();
    audioContextStarted = true;
  }
}
