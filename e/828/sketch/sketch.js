let grid = [];
let cellSize = 20;
let cols, rows;
let pulse = 0;
let waves = [];

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  background(0);

  cols = width / cellSize;
  rows = height / cellSize;

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        hue: 20,
        saturation: 100,
        brightness: 50,
        alpha: 0.8,
        pulseOffset: random(TWO_PI),
        shadow: 0,
        shadowTime: 0
      };
    }
  }

  noStroke();
}

function draw() {
  // Update pulse
  pulse += 0.02;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = grid[y][x];
      
      // Pulsing effect
      let pulseValue = sin(pulse + cell.pulseOffset) * 0.3 + 0.7;
      let brightness = cell.brightness * pulseValue;

      // Shadow effect
      if (cell.shadow > 0) {
        cell.shadow -= 0.01;
        if (cell.shadow < 0) cell.shadow = 0;
        brightness += cell.shadow * 20;
      }

      fill(cell.hue, cell.saturation, brightness, cell.alpha);
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Update waves
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    wave.radius += wave.speed;
    if (wave.radius > width) {
      waves.splice(i, 1);
    }
  }

  // Draw waves
  for (let wave of waves) {
    fill(20, 100, 80, 0.3);
    ellipse(wave.x, wave.y, wave.radius * 2);
  }
}

function mousePressed() {
  let wave = {
    x: mouseX,
    y: mouseY,
    radius: 0,
    speed: 3
  };
  waves.push(wave);

  // Apply impact to nearby cells
  let gridX = floor(mouseX / cellSize);
  let gridY = floor(mouseY / cellSize);
  let impactRadius = 5;

  for (let y = max(0, gridY - impactRadius); y < min(rows, gridY + impactRadius); y++) {
    for (let x = max(0, gridX - impactRadius); x < min(cols, gridX + impactRadius); x++) {
      let d = dist(gridX, gridY, x, y);
      if (d < impactRadius) {
        let cell = grid[y][x];
        cell.shadow = 1 - (d / impactRadius);
        cell.shadowTime = millis();
      }
    }
  }
}
