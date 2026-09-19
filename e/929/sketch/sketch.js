let hexagons = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize hexagon lattice
  let spacing = 80;
  let cols = ceil(width / spacing) + 2;
  let rows = ceil(height / spacing) + 2;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      hexagons.push({
        x: i * spacing - spacing/2,
        y: j * spacing - spacing/2,
        size: 30 + random(10),
        angle: random(TWO_PI),
        speed: random(0.01, 0.03),
        phase: random(TWO_PI),
        stability: random(0.5, 1),
        collapse: 0,
        collapseTime: 0
      });
    }
  }
}

function draw() {
  background(10);
  
  time += 0.02;
  
  // Draw all hexagons
  for (let h of hexagons) {
    updateHexagon(h);
    drawHexagon(h);
  }
}

function updateHexagon(h) {
  h.angle += h.speed;
  h.collapseTime += 0.01;
  
  // Random collapse events
  if (random() < 0.001) {
    h.collapse = random(0.5, 1);
  }
  
  if (h.collapse > 0) {
    h.collapse -= 0.02;
    if (h.collapse < 0) h.collapse = 0;
  }
}

function drawHexagon(h) {
  push();
  translate(h.x, h.y);
  rotate(h.angle);
  
  // Base hexagon
  let baseSize = h.size * h.stability;
  let currentSize = baseSize * (1 - h.collapse * 0.8);
  
  fill(255, 100);
  
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = cos(angle) * currentSize;
    let y = sin(angle) * currentSize;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Inner structure
  fill(255, 50);
  let innerSize = currentSize * 0.6;
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i + PI/6;
    let x = cos(angle) * innerSize;
    let y = sin(angle) * innerSize;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Fracture effect
  if (h.collapse > 0) {
    fill(255, 150);
    for (let i = 0; i < 3; i++) {
      let a = h.angle + random(-PI/6, PI/6);
      let size = currentSize * random(0.2, 0.4);
      let x = cos(a) * currentSize * 0.5;
      let y = sin(a) * currentSize * 0.5;
      
      push();
      translate(x, y);
      rotate(random(TWO_PI));
      beginShape();
      for (let j = 0; j < 5; j++) {
        let angle = TWO_PI / 5 * j;
        let x = cos(angle) * size;
        let y = sin(angle) * size;
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    }
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
