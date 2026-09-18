let threads = [];
let colors = [];
let saturation = 50;
let noiseScale = 0.02;
let noiseStrength = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Generate thread paths
  for (let i = 0; i < 100; i++) {
    let path = [];
    let x = random(width);
    let y = random(height);
    for (let j = 0; j < 200; j++) {
      path.push({x, y});
      x += noise(x * noiseScale, y * noiseScale) * noiseStrength * 10 - 5;
      y += noise((x + 1000) * noiseScale, (y + 1000) * noiseScale) * noiseStrength * 10 - 5;
    }
    threads.push(path);
  }
  
  // Precompute colors
  for (let i = 0; i < 20; i++) {
    colors.push(color(random(100, 255), random(100, 255), random(100, 255), 100));
  }
}

function draw() {
  background(20);
  
  // Draw threads
  for (let i = 0; i < threads.length; i++) {
    let path = threads[i];
    let c = colors[i % colors.length];
    fill(red(c), green(c), blue(c), 30);
    
    beginShape();
    for (let j = 0; j < path.length; j++) {
      let point = path[j];
      let n = noise(point.x * noiseScale, point.y * noiseScale, frameCount * 0.001);
      vertex(point.x + n * 20 - 10, point.y + n * 20 - 10);
    }
    endShape();
  }
  
  // Dynamic color wash
  let wash = color(saturation, 80, 100, 5);
  fill(wash);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 100);
    ellipse(x, y, size, size);
  }
}

function mouseDragged() {
  saturation = map(mouseX, 0, width, 0, 100);
}
