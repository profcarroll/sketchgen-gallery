let lines = [];
let grid = [];
let clickEffect = null;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 100);

  // Create a lattice structure with interconnected lines
  for (let i = 0; i < 20; i++) {
    let row = [];
    for (let j = 0; j < 20; j++) {
      let x = map(i, 0, 19, -width/3, width/3);
      let y = map(j, 0, 19, -height/3, height/3);
      let z = sin(i * 0.3 + time) * cos(j * 0.3 + time) * 200;
      row.push(createVector(x, y, z));
    }
    lines.push(row);
  }

  // Create connections between lattice points
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = 0; j < lines[i].length - 1; j++) {
      grid.push([lines[i][j], lines[i + 1][j]]);
      grid.push([lines[i][j], lines[i][j + 1]]);
    }
  }

  // Add diagonal connections
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = 0; j < lines[i].length - 1; j++) {
      grid.push([lines[i][j], lines[i + 1][j + 1]]);
      grid.push([lines[i + 1][j], lines[i][j + 1]]);
    }
  }

  // Add some random connections for complexity
  for (let i = 0; i < 500; i++) {
    let a = floor(random(lines.length));
    let b = floor(random(lines[a].length));
    let c = floor(random(lines.length));
    let d = floor(random(lines[c].length));
    if (a !== c || b !== d) {
      grid.push([lines[a][b], lines[c][d]]);
    }
  }

  // Add a few long-range connections for visual flow
  for (let i = 0; i < 200; i++) {
    let a = floor(random(lines.length));
    let b = floor(random(lines[a].length));
    let c = floor(random(lines.length));
    let d = floor(random(lines[c].length));
    if (a !== c || b !== d) {
      grid.push([lines[a][b], lines[c][d]]);
    }
  }

  // Precompute all connections to avoid loops
  for (let i = 0; i < 100; i++) {
    let a = floor(random(lines.length));
    let b = floor(random(lines[a].length));
    let c = floor(random(lines.length));
    let d = floor(random(lines[c].length));
    if (a !== c || b !== d) {
      grid.push([lines[a][b], lines[c][d]]);
    }
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement for dynamic view
  let cx = sin(time * 0.2) * 50;
  let cy = cos(time * 0.3) * 50;
  let cz = sin(time * 0.1) * 50;
  camera(0, 0, 500 + cz, cx, cy, 0, 0, 1, 0);

  // Draw connections
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    let a = grid[i][0];
    let b = grid[i][1];

    // Apply wave motion to the structure
    let distA = dist(a.x, a.y, 0, 0);
    let distB = dist(b.x, b.y, 0, 0);
    let timeOffsetA = (distA * 0.01 + time) % TWO_PI;
    let timeOffsetB = (distB * 0.01 + time) % TWO_PI;

    a.z += sin(timeOffsetA) * 2;
    b.z += sin(timeOffsetB) * 2;

    // Color based on position and time
    let hueA = (timeOffsetA * 30 + distA * 0.1) % 100;
    let hueB = (timeOffsetB * 30 + distB * 0.1) % 100;

    // Brightness varies with distance from center
    let brightnessA = map(distA, 0, width, 50, 100);
    let brightnessB = map(distB, 0, width, 50, 100);

    // Apply glow effect
    let alpha = 0.8;
    if (clickEffect) {
      let distToClick = dist((a.x + b.x)/2, (a.y + b.y)/2, clickEffect.x, clickEffect.y);
      if (distToClick < 200) {
        alpha += map(distToClick, 0, 200, 0.5, 0);
        hueA = (hueA + 30) % 100;
        hueB = (hueB + 30) % 100;
      }
    }

    // Use HSB for vibrant colors
    fill(hueA, 80, brightnessA, alpha);
    vertex(a.x, a.y, a.z);
    fill(hueB, 80, brightnessB, alpha);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Clear click effect after one frame
  if (clickEffect) {
    clickEffect = null;
  }

  // Animate structure slightly
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      let point = lines[i][j];
      point.z += sin(time + i + j) * 0.5;
    }
  }
}

function mousePressed() {
  clickEffect = createVector(mouseX - width/2, mouseY - height/2);
}
