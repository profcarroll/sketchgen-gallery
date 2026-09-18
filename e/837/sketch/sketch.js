let horsePoints = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize horse points with a stylized galloping form
  for (let i = 0; i < 200; i++) {
    horsePoints.push({
      x: 0,
      y: 0,
      ox: 0,
      oy: 0,
      angle: 0
    });
  }
}

function draw() {
  background(240);
  
  time += 0.03;
  
  // Update points to simulate galloping motion
  for (let i = 0; i < horsePoints.length; i++) {
    let p = horsePoints[i];
    
    // Base body shape with fluid curves
    let baseX = width / 2 + sin(time + i * 0.1) * 50;
    let baseY = height / 2 + cos(time * 0.7 + i * 0.05) * 30;
    
    // Head and neck
    if (i < 30) {
      p.x = baseX + sin(time + i * 0.1) * 40;
      p.y = baseY + cos(time + i * 0.1) * 20;
    }
    // Body segments
    else if (i < 80) {
      p.x = baseX + sin(time * 1.2 + i * 0.1) * 60;
      p.y = baseY + cos(time * 1.2 + i * 0.1) * 40;
    }
    // Legs
    else if (i < 150) {
      let legOffset = (i - 80) % 2 === 0 ? 1 : -1;
      p.x = baseX + sin(time * 1.5 + i * 0.2) * 70 + legOffset * 30;
      p.y = baseY + cos(time * 1.5 + i * 0.2) * 60 + 50;
    }
    // Tail
    else {
      p.x = baseX - sin(time * 1.8 + i * 0.1) * 40;
      p.y = baseY - cos(time * 1.8 + i * 0.1) * 30;
    }
    
    // Store original positions for drawing connections
    if (frameCount === 1) {
      p.ox = p.x;
      p.oy = p.y;
    }
  }
  
  // Draw horse with continuous, sweeping curves
  noFill();
  stroke(30);
  strokeWeight(2);
  
  beginShape();
  for (let i = 0; i < horsePoints.length; i++) {
    let p = horsePoints[i];
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  
  // Draw connections between points to emphasize organic flow
  stroke(180);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < horsePoints.length - 1; i++) {
    let p1 = horsePoints[i];
    let p2 = horsePoints[i + 1];
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
