let cells = [];
let chromosomeGroups = [];

function setup() {
  createCanvas(480, 360);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial cells
  for (let i = 0; i < 3; i++) {
    cells.push({
      x: random(width),
      y: random(height),
      size: random(20, 40),
      hue: random(360),
      phase: 0,
      speed: random(0.005, 0.01),
      chromosomes: []
    });
  }

  // Initialize chromosomes for each cell
  for (let cell of cells) {
    let numChromosomes = floor(random(4, 8));
    for (let i = 0; i < numChromosomes; i++) {
      cell.chromosomes.push({
        x: cell.x,
        y: cell.y,
        size: random(5, 10),
        angle: random(TWO_PI),
        phase: 0,
        hue: cell.hue
      });
    }
  }
}

function draw() {
  background(220, 10, 95);

  // Update and display cells and their chromosomes
  for (let cell of cells) {
    // Animate cell phase
    cell.phase += cell.speed;
    
    // Draw cell membrane
    fill(cell.hue, 80, 90);
    ellipse(cell.x, cell.y, cell.size);

    // Update and draw chromosomes
    let chromSize = cell.size * 0.4;
    for (let chrom of cell.chromosomes) {
      chrom.phase += 0.02;
      
      // Chromosome phases: condense -> align -> separate -> reform
      let phase = (cell.phase + chrom.phase) % 1;
      
      if (phase < 0.25) {
        // Condensing phase
        chrom.size = map(phase, 0, 0.25, 2, chromSize);
        chrom.angle = cell.phase * 3;
      } else if (phase < 0.5) {
        // Aligning phase
        chrom.size = chromSize;
        chrom.angle = 0;
      } else if (phase < 0.75) {
        // Separating phase
        chrom.size = chromSize;
        chrom.angle = cell.phase * 10;
      } else {
        // Reforming phase
        chrom.size = map(phase, 0.75, 1, chromSize, 2);
        chrom.angle = 0;
      }

      // Draw chromosome
      push();
      translate(chrom.x, chrom.y);
      rotate(chrom.angle);
      fill(chrom.hue, 90, 80);
      ellipse(0, 0, chrom.size, chrom.size * 0.5);
      pop();
    }
  }

  // Add a little more visual interest
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    fill(200, 30, 80);
    ellipse(x, y, 1, 1);
  }
}
