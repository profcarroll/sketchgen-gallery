let lines = [];
let points = [];
let grid = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines
  for (let i = 0; i < 500; i++) {
    lines.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(360)
    });
  }
  
  // Initialize points
  for (let i = 0; i < 1000; i++) {
    points.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(1, 3)
    });
  }
  
  // Initialize grid
  const gridSize = 20;
  for (let x = -width/2; x < width/2; x += gridSize) {
    for (let y = -height/2; y < height/2; y += gridSize) {
      grid.push({x, y, z: 0});
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Draw lines
  stroke(255, 80, 100, 0.7);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    l.x += l.vx;
    l.y += l.vy;
    l.z += l.vz;
    
    // Bounce off edges
    if (l.x < -width/2 || l.x > width/2) l.vx *= -1;
    if (l.y < -height/2 || l.y > height/2) l.vy *= -1;
    if (l.z < -200 || l.z > 200) l.vz *= -1;
    
    vertex(l.x, l.y, l.z);
    vertex(l.x + sin(time + i * 0.1) * 50, 
           l.y + cos(time + i * 0.1) * 50, 
           l.z + sin(time * 0.5 + i * 0.1) * 30);
  }
  endShape();
  
  // Draw points
  stroke(200, 100, 100, 0.8);
  noFill();
  beginShape(POINTS);
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    
    p.x += sin(time * 0.3 + i * 0.01) * 0.5;
    p.y += cos(time * 0.2 + i * 0.01) * 0.5;
    p.z += sin(time * 0.4 + i * 0.01) * 0.5;
    
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Draw grid
  stroke(180, 60, 90, 0.3);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    let g = grid[i];
    
    vertex(g.x + sin(time * 0.2 + i * 0.01) * 20, 
           g.y + cos(time * 0.2 + i * 0.01) * 20, 
           g.z);
    vertex(g.x + sin(time * 0.3 + i * 0.01) * 20, 
           g.y + cos(time * 0.3 + i * 0.01) * 20, 
           g.z + 50);
  }
  endShape();
  
  // Draw tessellated patterns
  push();
  rotateX(time * 0.1);
  rotateY(time * 0.15);
  stroke(100, 80, 100, 0.6);
  noFill();
  for (let i = 0; i < 30; i++) {
    beginShape(LINES);
    for (let j = 0; j < 20; j++) {
      let angle = map(j, 0, 19, 0, TWO_PI);
      let radius = 100 + sin(time * 2 + i * 0.2) * 50;
      let x = cos(angle + time * 0.2 + i * 0.1) * radius;
      let y = sin(angle + time * 0.2 + i * 0.1) * radius;
      let z = sin(time + i * 0.1) * 50;
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
  pop();
}
