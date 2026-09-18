let channels = [];
let flowTime = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Create initial channels
  for (let i = 0; i < 12; i++) {
    channels.push({
      id: i,
      y: map(i, 0, 11, 50, height - 50),
      width: random(30, 80),
      speed: random(0.5, 2),
      color: color(
        random(30, 100),
        random(60, 120),
        random(150, 255),
        180
      )
    });
  }
}

function draw() {
  background(10, 20, 40);
  
  flowTime += 0.02;
  
  // Draw the tidal zone base
  fill(15, 30, 60);
  rect(0, 0, width, height);
  
  // Draw flowing channels
  for (let i = 0; i < channels.length; i++) {
    let c = channels[i];
    
    // Calculate channel position with wave motion
    let offset = sin(flowTime * c.speed + i) * 15;
    let x = width / 2 + offset;
    
    // Draw gradient channel
    drawChannel(x, c.y, c.width, c.color);
  }
  
  // Add some water reflections
  for (let i = 0; i < 8; i++) {
    let y = map(i, 0, 7, 50, height - 50);
    let alpha = map(y, 50, height - 50, 30, 10);
    
    drawReflection(y, alpha);
  }
}

function drawChannel(x, y, width, col) {
  // Draw a flowing channel with gradient
  let gradient = drawingContext.createLinearGradient(
    x - width/2, y - 20,
    x + width/2, y + 20
  );
  
  gradient.addColorStop(0, color(red(col), green(col), blue(col), 180));
  gradient.addColorStop(0.5, color(red(col), green(col), blue(col), 100));
  gradient.addColorStop(1, color(red(col), green(col), blue(col), 0));
  
  drawingContext.fillStyle = gradient;
  
  // Draw the channel shape with flowing effect
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 4, -PI/3, PI/3);
    let wave = sin(flowTime * 2 + i) * 8;
    let px = x + cos(angle) * (width/2 + wave);
    let py = y + sin(angle) * 15;
    vertex(px, py);
  }
  endShape(CLOSE);
  
  // Draw flowing water pattern
  for (let i = 0; i < 30; i++) {
    let waveOffset = (flowTime * 2 + i * 0.3) % TWO_PI;
    let waveHeight = sin(waveOffset) * 4;
    let px = x - width/2 + (i * width/30);
    let py = y + waveHeight;
    
    fill(red(col), green(col), blue(col), 150);
    ellipse(px, py, 3, 3);
  }
}

function drawReflection(y, alpha) {
  // Draw subtle water reflection
  let refY = y + random(2, 8);
  let w = width * (0.7 + sin(flowTime * 0.5 + y * 0.01) * 0.3);
  
  fill(255, 255, 255, alpha);
  rect(0, refY, w, 2);
}
