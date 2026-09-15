let cells = [];
let filaments = [];

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  // Start with one parent cell
  cells.push({
    x: width / 2,
    y: height / 2,
    radius: 80,
    hue: random(360),
    saturation: 90,
    brightness: 80,
    alpha: 1,
    growing: true,
    growthRate: 0.1,
    phase: 0 // 0: normal, 1: condensing, 2: dividing
  });
}

function draw() {
  background(0, 0, 0, 1);

  // Update and display cells
  for (let i = cells.length - 1; i >= 0; i--) {
    let cell = cells[i];
    updateCell(cell);
    displayCell(cell);

    // Remove dead cells
    if (cell.radius < 5) {
      cells.splice(i, 1);
    }
  }

  // Update and display filaments
  for (let i = filaments.length - 1; i >= 0; i--) {
    let filament = filaments[i];
    updateFilament(filament);
    displayFilament(filament);

    if (filament.life <= 0) {
      filaments.splice(i, 1);
    }
  }

  // Occasionally add new filaments or split cells
  if (frameCount % 60 === 0 && cells.length > 0) {
    let cell = cells[0];
    if (cell.phase === 0 && cell.radius > 50) {
      cell.phase = 1;
    } else if (cell.phase === 1 && cell.radius < 30) {
      cell.phase = 2;
      splitCell(cell);
    }
  }

  // Add new filaments occasionally
  if (frameCount % 30 === 0 && cells.length > 0) {
    let cell = cells[0];
    if (cell.phase === 1) {
      addFilament(cell);
    }
  }
}

function updateCell(cell) {
  if (cell.growing) {
    cell.radius += cell.growthRate;
    if (cell.radius > 100) {
      cell.growing = false;
    }
  }

  // Change color slowly
  cell.hue = (cell.hue + 0.2) % 360;
}

function displayCell(cell) {
  fill(cell.hue, cell.saturation, cell.brightness, cell.alpha);
  ellipse(cell.x, cell.y, cell.radius * 2, cell.radius * 2);
}

function addFilament(cell) {
  let angle = random(TWO_PI);
  let startX = cell.x + cos(angle) * cell.radius;
  let startY = cell.y + sin(angle) * cell.radius;

  filaments.push({
    x: startX,
    y: startY,
    angle: angle,
    speed: 1.5,
    length: 0,
    maxLength: random(30, 80),
    hue: (cell.hue + 60) % 360,
    life: 100
  });
}

function updateFilament(filament) {
  filament.length += filament.speed;
  filament.life--;
  if (filament.length > filament.maxLength) {
    filament.length = filament.maxLength;
  }
}

function displayFilament(filament) {
  let endX = filament.x + cos(filament.angle) * filament.length;
  let endY = filament.y + sin(filament.angle) * filament.length;

  stroke(filament.hue, 90, 90, 0.7);
  strokeWeight(2);
  line(filament.x, filament.y, endX, endY);
}

function splitCell(parentCell) {
  // Create two daughter cells
  for (let i = 0; i < 2; i++) {
    let angle = random(TWO_PI);
    let distance = parentCell.radius * 0.8;
    let newX = parentCell.x + cos(angle) * distance;
    let newY = parentCell.y + sin(angle) * distance;

    cells.push({
      x: newX,
      y: newY,
      radius: parentCell.radius / 2,
      hue: (parentCell.hue + random(-30, 30)) % 360,
      saturation: parentCell.saturation,
      brightness: parentCell.brightness,
      alpha: 1,
      growing: true,
      growthRate: random(0.05, 0.1),
      phase: 0
    });
  }

  // Reset parent cell
  parentCell.radius = 0;
}
