let blobs = [];
let connections = [];
let grid = [];
const GRID_SIZE = 20;
const BLOB_COUNT = 50;
const CONNECTION_THRESHOLD = 100;
const MAX_CONNECTIONS_PER_BLOB = 5;

class Blob {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = random(-50, 50);
    this.size = random(20, 60);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.vz = random(-0.2, 0.2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    if (this.z < -100 || this.z > 100) this.vz *= -1;

    // Slowly change direction
    this.vx += random(-0.05, 0.05);
    this.vy += random(-0.05, 0.05);
    this.vz += random(-0.02, 0.02);

    // Keep within bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
    this.z = constrain(this.z, -100, 100);
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    fill(this.color);
    sphere(this.size);
    pop();
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize blobs
  for (let i = 0; i < BLOB_COUNT; i++) {
    blobs.push(new Blob(random(width), random(height)));
  }

  // Setup grid for spatial hashing
  const cols = ceil(width / GRID_SIZE);
  const rows = ceil(height / GRID_SIZE);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(0);

  // Update and display blobs
  for (let blob of blobs) {
    blob.update();
    blob.display();
  }

  // Spatial hashing
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }

  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const col = floor(blob.x / GRID_SIZE);
    const row = floor(blob.y / GRID_SIZE);
    if (col >= 0 && col < width / GRID_SIZE && row >= 0 && row < height / GRID_SIZE) {
      grid[row * (width / GRID_SIZE) + col].push(i);
    }
  }

  // Find nearby blobs and draw connections
  for (let i = 0; i < blobs.length; i++) {
    const blob1 = blobs[i];
    const col = floor(blob1.x / GRID_SIZE);
    const row = floor(blob1.y / GRID_SIZE);

    // Check neighbors in grid cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const neighborCol = col + dx;
        const neighborRow = row + dy;
        if (neighborCol >= 0 && neighborCol < width / GRID_SIZE &&
            neighborRow >= 0 && neighborRow < height / GRID_SIZE) {
          const index = neighborRow * (width / GRID_SIZE) + neighborCol;
          for (let j of grid[index]) {
            if (i !== j) {
              const blob2 = blobs[j];
              const d = dist(blob1.x, blob1.y, blob2.x, blob2.y);
              if (d < CONNECTION_THRESHOLD) {
                // Draw connection
                stroke(255, 30);
                noFill();
                strokeWeight(1);
                line(blob1.x, blob1.y, blob1.z, blob2.x, blob2.y, blob2.z);
              }
            }
          }
        }
      }
    }
  }

  // Add some subtle animation to the entire scene
  rotateY(frameCount * 0.001);
  rotateX(sin(frameCount * 0.002) * 0.1);
}
