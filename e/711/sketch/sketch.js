let angle = 0;
let hueOffset = 0;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 100);
  noStroke();
}

function draw() {
  background(0, 0, 0, 10);

  let numArcs = 20;
  let maxRadius = min(width, height) * 0.45;
  let gap = map(sin(angle), -1, 1, 0.01, 0.05);
  
  for (let i = 0; i < numArcs; i++) {
    let radius = map(i, 0, numArcs - 1, maxRadius, 0);
    let arcSize = map(i, 0, numArcs - 1, 0.5, 0.05);
    let h = (hueOffset + i * 2) % 100;
    
    fill(h, 100, 100, 80);
    arc(
      width / 2,
      height / 2,
      radius * 2,
      radius * 2,
      angle + i * gap,
      angle + i * gap + arcSize
    );
  }

  angle += 0.02;
  hueOffset = (hueOffset + 0.3) % 100;
}
