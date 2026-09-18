let lines = [];
let time = 0;
const numLines = 200;
const waveSpeed = 0.02;
const waveAmplitude = 150;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1);

  for (let i = 0; i < numLines; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      length: random(50, 200)
    });
  }
}

function draw() {
  background(0, 0, 10);
  time += waveSpeed;

  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    l.angle += l.speed;
    
    const x1 = l.x + cos(l.angle) * l.length * 0.5;
    const y1 = l.y + sin(l.angle) * l.length * 0.5;
    const x2 = l.x - cos(l.angle) * l.length * 0.5;
    const y2 = l.y - sin(l.angle) * l.length * 0.5;

    const waveOffset = sin(time + i * 0.1) * waveAmplitude;
    const waveOffset2 = cos(time * 0.7 + i * 0.15) * waveAmplitude * 0.5;

    const x1w = x1 + waveOffset * cos(l.angle + PI/2);
    const y1w = y1 + waveOffset * sin(l.angle + PI/2);
    const x2w = x2 + waveOffset2 * cos(l.angle + PI/2);
    const y2w = y2 + waveOffset2 * sin(l.angle + PI/2);

    stroke((time * 20 + i * 3) % 360, 80, 90, 0.7);
    line(x1w, y1w, x2w, y2w);
  }

  // Add some connecting lines between nearby lines
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const dx = lines[i].x - lines[j].x;
      const dy = lines[i].y - lines[j].y;
      const dist = sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        stroke((time * 10 + i * 2 + j * 3) % 360, 70, 80, 0.3);
        line(lines[i].x, lines[i].y, lines[j].x, lines[j].y);
      }
    }
  }

  // Add central wave motion
  push();
  translate(width/2, height/2);
  const waveRadius = 100 + sin(time * 0.5) * 50;
  stroke(200, 80, 90, 0.4);
  noFill();
  ellipse(0, 0, waveRadius * 2, waveRadius * 2);
  pop();
}
