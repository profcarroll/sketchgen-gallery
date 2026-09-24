let footprints = [];
let snowflakes = [];
let footprintDensity = 150;
let snowflakeCount = 300;
let groundY;

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
      age: 0
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
      swayOffset: random(TWO_PI)
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
  
  // Update and display snowflakes
  for (let i = 0; i < snowflakes.length; i++) {
    let flake = snowflakes[i];
    
    // Move snowflake down
    flake.y += flake.speed;
    
    // Add some horizontal sway
    flake.x += sin(flake.swayOffset + frameCount * flake.swaySpeed) * flake.sway;
    
    // Reset if it goes off screen
    if (flake.y > height + 10) {
      flake.y = random(-10, -100);
      flake.x = random(width);
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height * 0.7;
}
