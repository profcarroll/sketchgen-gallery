let rings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize rings array with one ring at center
  rings.push({
    radius: 0,
    alpha: 255
  });
}

function draw() {
  background(0);
  
  // Update and draw rings
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    ring.radius += 2;
    ring.alpha -= 1.5;
    
    if (ring.alpha <= 0) {
      rings.splice(i, 1);
    } else {
      stroke(255, ring.alpha);
      noFill();
      ellipse(width/2, height/2, ring.radius * 2);
    }
  }
  
  // Add new ring occasionally
  if (frameCount % 10 === 0) {
    rings.push({
      radius: 0,
      alpha: 255
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
