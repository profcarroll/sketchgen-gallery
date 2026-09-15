let lavaRivers = [];
let rockChunks = [];
let flowSpeed = 0.02;
let time = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial lava rivers
  for (let i = 0; i < 5; i++) {
    lavaRivers.push({
      x: random(width),
      y: random(height),
      width: random(200, 400),
      height: random(50, 150),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: color(random(10, 30), 100, 100, 0.8)
    });
  }

  // Create initial rock chunks
  for (let i = 0; i < 30; i++) {
    rockChunks.push({
      x: random(width),
      y: random(height),
      size: random(10, 40),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: color(random(20, 40), 60, 50, 0.9),
      glow: random(0.5, 1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Draw lava rivers
  for (let river of lavaRivers) {
    river.x += sin(time * river.speed) * flowSpeed;
    river.y += cos(time * river.speed) * flowSpeed;

    // Draw river with gradient glow
    fill(river.color);
    beginShape();
    for (let i = 0; i < 100; i++) {
      let angle = river.angle + map(i, 0, 100, -PI/4, PI/4);
      let x = river.x + cos(angle) * river.width/2;
      let y = river.y + sin(angle) * river.height/2;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Add glowing effect
    fill(river.color);
    ellipse(river.x, river.y, river.width * 0.3, river.height * 0.3);
  }

  // Draw rock chunks
  for (let chunk of rockChunks) {
    chunk.x += sin(time * chunk.speed) * flowSpeed;
    chunk.y += cos(time * chunk.speed) * flowSpeed;

    // Draw chunk with glow
    fill(chunk.color);
    ellipse(chunk.x, chunk.y, chunk.size, chunk.size);

    // Add inner glow
    fill(255, 100, 80, 0.3);
    ellipse(chunk.x, chunk.y, chunk.size * 0.7, chunk.size * 0.7);
  }

  // Occasionally add new chunks
  if (random() < 0.01) {
    rockChunks.push({
      x: random(width),
      y: random(height),
      size: random(10, 40),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      color: color(random(20, 40), 60, 50, 0.9),
      glow: random(0.5, 1)
    });
  }

  // Remove old chunks
  if (rockChunks.length > 50) {
    rockChunks.shift();
  }
}
