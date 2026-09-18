let ribbons = [];
const numRibbons = 12;
const ribbonLength = 100;
const speed = 0.01;
const helixRadius = 200;
const helixHeight = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create ribbons with initial positions and colors
  for (let i = 0; i < numRibbons; i++) {
    let ribbon = [];
    for (let j = 0; j < ribbonLength; j++) {
      ribbon.push({
        x: 0,
        y: 0,
        z: 0,
        hue: (i * 30 + j * 2) % 360
      });
    }
    ribbons.push(ribbon);
  }
}

function draw() {
  background(0, 0, 0, 1);

  // Center the scene
  translate(0, 0, -500);

  // Rotate slowly for dynamic effect
  rotateY(frameCount * 0.002);

  // Draw all ribbons
  for (let i = 0; i < ribbons.length; i++) {
    drawRibbon(ribbons[i], i);
  }
}

function drawRibbon(ribbon, index) {
  beginShape();
  noFill();

  // Use a consistent color palette with phosphorescent hues
  stroke(ribbon[0].hue, 100, 100, 0.8);

  for (let j = 0; j < ribbon.length; j++) {
    let t = (frameCount * speed + index * 0.2 + j * 0.05) % 1;
    
    // Helical path
    let angle = t * TWO_PI * 3;
    let radius = helixRadius + sin(t * TWO_PI * 2) * 50;
    let y = t * helixHeight - helixHeight / 2;

    ribbon[j].x = cos(angle) * radius;
    ribbon[j].y = y;
    ribbon[j].z = sin(angle) * radius;

    // Add a subtle pulsing effect
    let pulse = sin(t * TWO_PI * 4 + frameCount * 0.02) * 0.5 + 0.5;
    let size = 3 + pulse * 2;

    vertex(ribbon[j].x, ribbon[j].y, ribbon[j].z);
  }

  endShape();
}
