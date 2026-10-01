let cells = [];
let maxCells = 50;
let pulseSpeed = 0.03;
let splitThreshold = 100;
let contractionSpeed = 0.02;
let pinchPointRadius = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Start with one cell
  cells.push({
    x: width / 2,
    y: height / 2,
    radius: 20,
    hue: random(360),
    pulse: 0,
    isSplitting: false,
    contractionProgress: 0,
    speedX: random(-0.5, 0.5),
    speedY: random(-0.5, 0.5)
  });
}

function draw() {
  background(0, 0, 10, 0.05); // Semi-transparent background for trail effect

  for (let i = cells.length - 1; i >= 0; i--) {
    let cell = cells[i];

    // Update pulse
    cell.pulse += pulseSpeed;

    // Apply movement
    cell.x += cell.speedX;
    cell.y += cell.speedY;

    // Bounce off edges
    if (cell.x < 0 || cell.x > width) cell.speedX *= -1;
    if (cell.y < 0 || cell.y > height) cell.speedY *= -1;

    // Grow the cell
    if (!cell.isSplitting) {
      cell.radius += 0.2;
    }

    // Check for splitting
    if (cell.radius >= splitThreshold && !cell.isSplitting) {
      cell.isSplitting = true;
      cell.speedX = 0;
      cell.speedY = 0;
      cell.contractionProgress = 0;
    }

    // Handle contraction and pinching
    if (cell.isSplitting) {
      cell.contractionProgress += contractionSpeed;

      // Contraction animation
      let contractedRadius = cell.radius * (1 - cell.contractionProgress * 0.9);
      
      // Draw the parent cell in contraction phase with visible membrane boundary
      fill(cell.hue, 80, 90, 0.8);
      ellipse(cell.x, cell.y, contractedRadius * 2);

      // Draw pinch point with pulsing light
      if (cell.contractionProgress > 0.6) {
        let pulseIntensity = sin(frameCount * 0.3) * 0.5 + 0.5;
        let glowIntensity = 100 * pulseIntensity;
        
        // Draw bright inner core at pinch point
        fill(60, 100, 100, 0.9);
        ellipse(cell.x, cell.y, pinchPointRadius * 2 * 0.3);
        
        // Draw glowing ring around pinch point
        noFill();
        stroke(60, 100, 100, 0.7);
        strokeWeight(2);
        ellipse(cell.x, cell.y, pinchPointRadius * 4);
      }

      // Split when fully contracted
      if (cell.contractionProgress >= 1) {
        let angle1 = random(TWO_PI);
        let angle2 = angle1 + PI;
        let distance = 60;

        cells.push({
          x: cell.x + cos(angle1) * distance,
          y: cell.y + sin(angle1) * distance,
          radius: 20,
          hue: (cell.hue + random(-30, 30)) % 360,
          pulse: 0,
          isSplitting: false,
          speedX: cos(angle1) * 0.5,
          speedY: sin(angle1) * 0.5
        });

        cells.push({
          x: cell.x + cos(angle2) * distance,
          y: cell.y + sin(angle2) * distance,
          radius: 20,
          hue: (cell.hue + random(-30, 30)) % 360,
          pulse: 0,
          isSplitting: false,
          speedX: cos(angle2) * 0.5,
          speedY: sin(angle2) * 0.5
        });

        // Remove the original cell
        cells.splice(i, 1);
      }
    } else {
      // Normal growth and pulsation
      let pulseRadius = cell.radius * (1 + sin(cell.pulse) * 0.2);
      fill(cell.hue, 80, 90, 0.8);
      ellipse(cell.x, cell.y, pulseRadius * 2);

      // Draw pulse effect
      noFill();
      stroke(cell.hue, 80, 100, 0.3);
      ellipse(cell.x, cell.y, (pulseRadius + 15) * 2);
    }
  }

  // Limit the number of cells to prevent overflow
  if (cells.length > maxCells) {
    cells.splice(0, cells.length - maxCells);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
