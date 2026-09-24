let iceBlocks = [];
let liquidPools = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create initial ice blocks
  for (let i = 0; i < 8; i++) {
    let x = random(-200, 200);
    let z = random(-200, 200);
    let size = random(30, 60);
    iceBlocks.push({
      x: x,
      y: 0,
      z: z,
      size: size,
      targetSize: size,
      sharpness: 1,
      meltRate: random(0.005, 0.02),
      color: color(random(180, 240), 80, 90, 0.7)
    });
  }
}

function draw() {
  background(0);
  
  // Ambient lighting
  pointLight(255, 255, 255, 0, -300, 300);
  ambientLight(60);
  
  // Draw floor
  fill(10, 10, 10);
  push();
  translate(0, 100, 0);
  rotateX(HALF_PI);
  plane(800, 800);
  pop();
  
  // Update and draw ice blocks
  for (let i = iceBlocks.length - 1; i >= 0; i--) {
    let block = iceBlocks[i];
    
    // Melt over time
    if (block.size > 5) {
      block.size -= block.meltRate;
      block.sharpness -= 0.01;
      if (block.sharpness < 0) block.sharpness = 0;
      
      // Create liquid pool when block melts
      if (block.size <= 20 && !block.inLiquid) {
        liquidPools.push({
          x: block.x,
          y: 100,
          z: block.z,
          size: 5,
          maxRadius: random(40, 80),
          growthRate: random(0.3, 0.7),
          color: block.color
        });
        block.inLiquid = true;
      }
    } else {
      // Remove completely melted blocks
      iceBlocks.splice(i, 1);
    }
    
    // Draw the ice block with transparency and sharpness effect
    push();
    translate(block.x, block.y, block.z);
    fill(block.color);
    
    if (block.sharpness > 0.5) {
      box(block.size * block.sharpness);
    } else {
      sphere(block.size * block.sharpness * 2);
    }
    pop();
  }
  
  // Update and draw liquid pools
  for (let i = liquidPools.length - 1; i >= 0; i--) {
    let pool = liquidPools[i];
    
    if (pool.size < pool.maxRadius) {
      pool.size += pool.growthRate;
      
      // Draw the liquid pool
      push();
      translate(pool.x, pool.y, pool.z);
      fill(pool.color);
      noStroke();
      sphere(pool.size);
      pop();
    } else {
      liquidPools.splice(i, 1);
    }
  }
  
  // Add some extra shimmering particles to simulate water droplets
  for (let i = 0; i < 5; i++) {
    let x = random(-300, 300);
    let z = random(-300, 300);
    let y = 100 + random(-10, 10);
    
    push();
    translate(x, y, z);
    fill(200, 80, 90, 0.6);
    sphere(random(2, 5));
    pop();
  }
}

function mousePressed() {
  // Apply heat to nearby ice blocks
  for (let block of iceBlocks) {
    let dx = block.x - mouseX;
    let dz = block.z - mouseY;
    let distance = sqrt(dx * dx + dz * dz);
    
    if (distance < 100) {
      block.meltRate += random(0.03, 0.06);
      block.targetSize = block.size * 0.8;
    }
  }
}
