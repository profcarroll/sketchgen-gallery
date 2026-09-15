let terrain;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a simple terrain mesh with noise
  terrain = [];
  for (let x = 0; x < width; x += 20) {
    let y = map(noise(x * 0.01), 0, 1, height * 0.7, height * 0.9);
    terrain.push({x, y});
  }
}

function draw() {
  background(80, 40, 20); // Terracotta base color

  // Draw ground
  noStroke();
  fill(100, 50, 30);
  beginShape();
  vertex(0, height);
  for (let i = 0; i < terrain.length; i++) {
    vertex(terrain[i].x, terrain[i].y);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Draw subtle ripples
  stroke(120, 60, 40, 30);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let offset = sin(time * 0.002 + i) * 2;
    beginShape();
    for (let j = 0; j < terrain.length; j++) {
      let x = terrain[j].x;
      let y = terrain[j].y + offset * sin(x * 0.01 + time * 0.001);
      vertex(x, y);
    }
    endShape();
  }

  // Animate time
  time++;
}
