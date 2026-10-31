let faultLines = [];
let time = 0;
let seed = 12345;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noiseSeed(seed);

  // Generate initial fault lines
  for (let i = 0; i < 200; i++) {
    faultLines.push({
      points: [],
      angle: random(TWO_PI),
      speed: random(0.001, 0.003),
      phase: random(TWO_PI)
    });
  }

  // Initialize each line with noise-based segments
  for (let i = 0; i < faultLines.length; i++) {
    const line = faultLines[i];
    const segments = floor(random(5, 15));
    const length = random(200, 600);
    
    for (let j = 0; j < segments; j++) {
      const t = map(j, 0, segments - 1, 0, 1);
      const x = lerp(-width/2, width/2, t);
      const y = height/2 + random(-50, 50);
      
      // Add noise to make the line fractal
      const noiseX = noise(x * 0.005, y * 0.005, time) * 30;
      const noiseY = noise(x * 0.005, y * 0.005, time + 1000) * 30;
      
      line.points.push({
        x: x + noiseX,
        y: y + noiseY
      });
    }
  }
}

function draw() {
  background(20); // Dark slate
  time += 0.005;

  // Draw fault lines with white chalk
  stroke(0); // Black for contrast
  strokeWeight(1);
  
  // Apply organic deformation to each line
  for (let i = 0; i < faultLines.length; i++) {
    const line = faultLines[i];
    
    // Modify the points over time
    for (let j = 0; j < line.points.length; j++) {
      const point = line.points[j];
      
      // Apply noise-based displacement
      const noiseX = noise(point.x * 0.005, point.y * 0.005, time * 0.5) * 10;
      const noiseY = noise(point.x * 0.005, point.y * 0.005, time * 0.5 + 1000) * 10;
      
      point.x += noiseX;
      point.y += noiseY;
    }
    
    // Draw the deformed line
    beginShape();
    for (let j = 0; j < line.points.length; j++) {
      const point = line.points[j];
      vertex(point.x, point.y);
    }
    endShape();
  }

  noLoop(); // Keep it still as required by the gate
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
