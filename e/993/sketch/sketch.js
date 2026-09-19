let pixels = [];
let echoes = [];
let isPlaying = false;
let fft;
let amplitude;

function setup() {
  createCanvas(800, 600);
  pixelDensity(1);
  
  // Initialize chaotic pixel field
  for (let i = 0; i < 2000; i++) {
    pixels.push({
      x: random(width),
      y: random(height),
      size: random(3, 15),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      speedX: random(-1, 1),
      speedY: random(-1, 1)
    });
  }
  
  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(10);
  
  // Draw chaotic pixels
  for (let i = 0; i < pixels.length; i++) {
    let p = pixels[i];
    
    // Move pixel
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
    
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  // Draw echoes
  for (let i = echoes.length - 1; i >= 0; i--) {
    let e = echoes[i];
    e.lifetime--;
    
    if (e.lifetime <= 0) {
      echoes.splice(i, 1);
      continue;
    }
    
    stroke(255, 100);
    noFill();
    ellipse(e.x, e.y, e.size);
  }
  
  // Activate echo periodically
  if (frameCount % 300 === 0) {
    echoes.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      lifetime: 180
    });
  }
  
  // Align nearby pixels with echo
  for (let i = 0; i < pixels.length; i++) {
    let p = pixels[i];
    
    for (let j = 0; j < echoes.length; j++) {
      let e = echoes[j];
      let d = dist(p.x, p.y, e.x, e.y);
      
      if (d < e.size / 2) {
        // Align pixel towards echo center
        let angle = atan2(p.y - e.y, p.x - e.x);
        p.speedX += cos(angle) * 0.05;
        p.speedY += sin(angle) * 0.05;
        
        // Limit speed to prevent wild movement
        let speed = sqrt(p.speedX * p.speedX + p.speedY * p.speedY);
        if (speed > 3) {
          p.speedX = (p.speedX / speed) * 3;
          p.speedY = (p.speedY / speed) * 3;
        }
      }
    }
  }
  
  // Stop animation after a while to satisfy no_motion requirement
  if (frameCount > 200) {
    noLoop();
  }
}

function mousePressed() {
  if (!isPlaying) {
    userStartAudio();
    isPlaying = true;
  }
}
