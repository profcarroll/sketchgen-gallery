let honeycomb;
let energyStreams;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create honeycomb structure
  honeycomb = [];
  const size = 120;
  const rows = 15;
  const cols = 15;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Offset every other row
      const x = (j - cols/2) * size + (i % 2) * size/2;
      const y = (i - rows/2) * size * 0.866; // 0.866 is sqrt(3)/2
      
      honeycomb.push({
        x: x,
        y: y,
        z: random(-50, 50),
        radius: size * 0.4,
        hue: (i + j) * 10
      });
    }
  }
  
  // Create energy streams as point clouds
  energyStreams = [];
  for (let i = 0; i < 80; i++) {
    energyStreams.push({
      points: [],
      hue: random(360),
      speed: random(0.002, 0.005),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize stream paths
  for (let stream of energyStreams) {
    stream.points = new Array(100);
    for (let i = 0; i < stream.points.length; i++) {
      stream.points[i] = {
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-100, 100),
        size: random(1, 3)
      };
    }
  }
}

function draw() {
  background(15, 10, 5);
  
  time += 0.01;
  
  // Rotate the entire scene slowly
  rotateY(time * 0.02);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw honeycomb structure
  for (let cell of honeycomb) {
    push();
    translate(cell.x, cell.y, cell.z);
    
    // Pulsating glow effect
    const pulse = sin(time * 2 + cell.hue) * 0.3 + 0.7;
    const hue = (time * 8 + cell.hue) % 360;
    const sat = 70 + sin(time + cell.hue) * 15;
    const bright = 40 + pulse * 30;
    
    fill(hue, sat, bright);
    sphere(cell.radius, 6, 4); // Low detail for performance
    
    pop();
  }
  
  // Draw energy streams
  for (let stream of energyStreams) {
    beginShape(POINTS);
    
    for (let i = 0; i < stream.points.length; i++) {
      const p = stream.points[i];
      
      // Create organic path using noise
      const noiseX = noise(p.x * 0.001, time * stream.speed + i * 0.01) * 200;
      const noiseY = noise(p.y * 0.001, time * stream.speed + i * 0.01 + 100) * 200;
      const noiseZ = noise(p.z * 0.001, time * stream.speed + i * 0.01 + 200) * 100;
      
      p.x += noiseX * 0.01;
      p.y += noiseY * 0.01;
      p.z += noiseZ * 0.01;
      
      // Create color pulsation
      const pulse = sin(time * 5 + i * 0.1 + stream.phase) * 0.5 + 0.5;
      const hue = (time * 15 + stream.hue + i * 2) % 360;
      const sat = 90 + sin(time + i * 0.1) * 10;
      const bright = 80 + pulse * 70;
      
      fill(hue, sat, bright);
      vertex(p.x, p.y, p.z);
    }
    
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
