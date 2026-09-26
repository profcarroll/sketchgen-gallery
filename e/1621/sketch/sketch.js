let footprints = [];
let snowflakes = [];
let footprintDensity = 150;
let snowflakeCount = 300;
let groundY;
let snowIntensity = 0;
let snowAccumulation = 0;
let pauseTimer = 0;
let pauseDuration = 120; // frames to pause
let isPaused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height * 0.7;
  
  // Create initial footprints
  for (let i = 0; i < footprintDensity; i++) {
    footprints.push({
      x: random(width),
      y: groundY,
      size: random(15, 30),
      opacity: 255,
      age: 0,
      depth: random(0.5, 1.5)
    });
  }
  
  // Create snowflakes
  for (let i = 0; i < snowflakeCount; i++) {
    snowflakes.push({
      x: random(width),
      y: random(-100, -10),
      size: random(1, 3),
      speed: random(0.5, 1.5),
      sway: random(-0.5, 0.5),
      swaySpeed: random(0.01, 0.03),
      swayOffset: random(TWO_PI),
      fallStart: random(100)
    });
  }
}

function draw() {
  background(240);
  
  // Draw ground
  fill(220);
  noStroke();
  rect(0, groundY, width, height - groundY);
  
  // Update and display footprints
  for (let i = 0; i < footprints.length; i++) {
    let fp = footprints[i];
    fp.age += 0.01;
    
    // Gradually fade the footprint
    if (fp.age > 1) {
      fp.opacity -= 1;
      if (fp.opacity <= 0) {
        fp.opacity = 0;
      }
    }
    
    // Draw footprint
    fill(30, fp.opacity);
    noStroke();
    ellipse(fp.x, fp.y, fp.size, fp.size * 0.6);
  }
  
  // Update snow intensity and pause logic
  if (!isPaused && frameCount > 100) {
    snowIntensity = min(snowIntensity + 0.005, 1);
    snowAccumulation += 0.1;
    
    if (snowIntensity >= 1 && pauseTimer === 0) {
      isPaused = true;
    }
  }
  
  if (isPaused) {
    pauseTimer++;
    if (pauseTimer > pauseDuration) {
      // Resume snowfall
      isPaused = false;
      pauseTimer = 0;
      snowIntensity = 1; // Maintain peak intensity
    }
  }
  
  // Update and display snowflakes
  for (let i = 0; i < snowflakes.length; i++) {
    let flake = snowflakes[i];
    
    // Apply gravity with some randomness
    flake.y += flake.speed * (1 + snowIntensity * 0.5);
    
    // Add horizontal sway based on time and position
    flake.x += sin(flake.swayOffset + frameCount * flake.swaySpeed) * flake.sway * (1 + snowIntensity * 0.3);
    
    // Reset if it goes off screen or accumulated enough
    if (flake.y > height + 10 || (isPaused && flake.y > groundY - 50)) {
      flake.y = random(-10, -100);
      flake.x = random(width);
      flake.fallStart = frameCount;
    }
    
    // Draw snowflake
    fill(255);
    noStroke();
    ellipse(flake.x, flake.y, flake.size, flake.size);
  }
  
  // Accumulate snow on footprints
  for (let i = 0; i < footprints.length; i++) {
    let fp = footprints[i];
    
    if (fp.opacity > 0) {
      // Snow accumulation effect - create a small snow pile around each footprint
      fill(245, 245, 245, 100);
      noStroke();
      
      // Draw snow pile
      let snowRadius = fp.size * 0.3;
      ellipse(fp.x, fp.y + snowRadius, snowRadius * 2, snowRadius * 2);
    }
  }
  
  // Draw snow accumulation at ground level
  if (snowAccumulation > 0) {
    fill(245, 245, 245, 150);
    noStroke();
    
    // Draw a layer of snow across the ground
    rect(0, groundY - snowAccumulation * 0.5, width, snowAccumulation);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height * 0.7;
}
