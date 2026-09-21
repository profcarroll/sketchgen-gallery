let pulses = [];
let trails = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
}

function draw() {
  background(0);
  
  // Draw trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.alpha -= 0.02;
    fill(t.hue, 100, 100, t.alpha);
    ellipse(t.x, t.y, t.size);
    if (t.alpha <= 0) {
      trails.splice(i, 1);
    }
  }

  // Update and draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    p.radius += p.speed;
    p.alpha -= 0.01;
    
    if (p.alpha > 0) {
      fill(p.hue, 100, 100, p.alpha);
      ellipse(p.x, p.y, p.radius * 2);
      
      // Add trail
      trails.push({
        x: p.x,
        y: p.y,
        size: p.radius / 4,
        hue: p.hue,
        alpha: p.alpha * 0.5
      });
    } else {
      pulses.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Start audio on first click
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }

  // Add new pulse at mouse position
  pulses.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    speed: random(2, 5),
    alpha: 1,
    hue: random(0, 360)
  });
}
