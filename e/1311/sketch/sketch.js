let facets = [];
let time = 0;
const numFacets = 120;
const tunnelRadius = 150;
const tunnelHeight = 600;
const waveFrequency = 0.02;
const waveAmplitude = 30;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Pre-generate tunnel facets
  for (let i = 0; i < numFacets; i++) {
    const angle = (i / numFacets) * TWO_PI;
    const y = map(i, 0, numFacets - 1, -tunnelHeight / 2, tunnelHeight / 2);
    facets.push({ angle, y });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  rotateY(time * 0.1);
  translate(0, 0, -300);

  // Draw tunnel facets
  beginShape(TRIANGLES);
  for (let i = 0; i < facets.length; i++) {
    const facet = facets[i];
    const next = facets[(i + 1) % facets.length];

    const h = (time * 20 + i * 3) % 360;
    fill(h, 80, 90);

    // Wave displacement
    const wave1 = sin(facet.y * waveFrequency + time) * waveAmplitude;
    const wave2 = cos(facet.y * waveFrequency * 0.7 + time * 1.3) * waveAmplitude * 0.5;

    const x1 = cos(facet.angle) * (tunnelRadius + wave1);
    const z1 = sin(facet.angle) * (tunnelRadius + wave2);

    const x2 = cos(next.angle) * (tunnelRadius + wave1);
    const z2 = sin(next.angle) * (tunnelRadius + wave2);

    // First triangle
    vertex(x1, facet.y, z1);
    vertex(x2, facet.y, z2);
    vertex(x2, next.y, z2);

    // Second triangle
    vertex(x1, facet.y, z1);
    vertex(x2, next.y, z2);
    vertex(x1, next.y, z1);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
