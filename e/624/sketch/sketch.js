let lines = [];
let numLines = 1000;
let coreX, coreY;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  coreX = width / 2;
  coreY = height / 2;
  
  for (let i = 0; i < numLines; i++) {
    lines.push({
      angle: random(TWO_PI),
      radius: random(50, 300),
      speed: random(0.001, 0.005),
      color: color(random(100, 255), random(100, 255), random(200, 255), 150)
    });
  }
}

function draw() {
  background(0);
  translate(-coreX, -coreY);
  
  time += 0.01;
  
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line.angle += line.speed;
    line.radius += sin(time * 0.5 + i * 0.01) * 0.2;
    
    let x1 = coreX + cos(line.angle) * line.radius;
    let y1 = coreY + sin(line.angle) * line.radius;
    
    let x2 = coreX + cos(line.angle + PI) * (line.radius + 20);
    let y2 = coreY + sin(line.angle + PI) * (line.radius + 20);
    
    stroke(line.color);
    vertex(x1, y1);
    vertex(x2, y2);
  }
  endShape();
  
  // Add some dynamic particles
  for (let i = 0; i < 50; i++) {
    let angle = time * 0.5 + i * 0.1;
    let radius = 100 + sin(time + i) * 50;
    let x = coreX + cos(angle) * radius;
    let y = coreY + sin(angle) * radius;
    
    stroke(255, 200);
    point(x, y);
  }
}
