let strata = [];
let threads = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create geological strata
  for (let i = 0; i < 20; i++) {
    strata.push({
      y: map(i, 0, 19, height/2, -height/2),
      color: color(10 + i * 5, 30 + i * 3, 60 + i * 2, 200)
    });
  }
  
  // Create glowing thread deposits
  for (let i = 0; i < 100; i++) {
    threads.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(2, 8),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Rotate view slowly
  rotateY(time * 0.02);
  
  // Draw strata
  for (let stratum of strata) {
    push();
    translate(0, stratum.y, 0);
    fill(stratum.color);
    noStroke();
    plane(width, 50);
    pop();
  }
  
  // Draw glowing threads
  for (let thread of threads) {
    push();
    translate(thread.x, thread.y, thread.z);
    
    // Create pulsing glow effect
    let pulse = sin(time * thread.speed + thread.phase) * 0.5 + 0.5;
    let size = thread.size * pulse;
    
    // Color with deep blues and cyans
    let c = lerpColor(color(0, 100, 200), color(0, 255, 255), pulse);
    fill(c);
    noStroke();
    
    // Draw thread as a glowing cylinder
    sphere(size, 4, 2);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
