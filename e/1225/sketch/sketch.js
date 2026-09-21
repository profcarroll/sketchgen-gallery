let waves = [];
let grids = [];
let time = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize seismic waves
  for (let i = 0; i < 5; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(0.5, 2),
      hue: 270 + random(-30, 30)
    });
  }
  
  // Initialize hexagonal grids
  for (let i = 0; i < 3; i++) {
    grids.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      speed: random(0.01, 0.03),
      rotation: random(TWO_PI),
      hue: 270 + random(-30, 30)
    });
  }
}

function draw() {
  background(360);
  
  time += 0.01;
  
  // Update and draw seismic waves
  for (let wave of waves) {
    wave.radius += wave.speed;
    
    if (wave.radius > wave.maxRadius) {
      wave.radius = 0;
      wave.x = random(width);
      wave.y = random(height);
    }
    
    stroke(wave.hue, 80, 90, 0.3);
    noFill();
    ellipse(wave.x, wave.y, wave.radius * 2);
  }
  
  // Update and draw hexagonal grids
  for (let grid of grids) {
    grid.size = 20 + sin(time * grid.speed) * 20;
    grid.rotation += grid.speed * 0.5;
    
    push();
    translate(grid.x, grid.y);
    rotate(grid.rotation);
    
    stroke(grid.hue, 80, 90, 0.7);
    noFill();
    
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x1 = cos(angle) * grid.size;
      let y1 = sin(angle) * grid.size;
      let x2 = cos(angle + TWO_PI / 6) * grid.size;
      let y2 = sin(angle + TWO_PI / 6) * grid.size;
      
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Draw fracturing lines
  stroke(270, 80, 90, 0.5);
  noFill();
  
  for (let i = 0; i < 100; i++) {
    let angle = time * 0.5 + i * 0.1;
    let x1 = width/2 + cos(angle) * 100;
    let y1 = height/2 + sin(angle) * 100;
    let x2 = width/2 + cos(angle + PI) * 100;
    let y2 = height/2 + sin(angle + PI) * 100;
    
    line(x1, y1, x2, y2);
  }
}
