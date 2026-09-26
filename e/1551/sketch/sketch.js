let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10);
  
  // Create new ripple every frame from center
  if (frameCount % 2 === 0) {
    ripples.push({
      x: width/2,
      y: height,
      radius: 0,
      alpha: 255,
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
  
  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.radius += 3;
    ripple.alpha -= 1.5;
    
    noFill();
    stroke(ripple.color);
    strokeWeight(1);
    ellipse(ripple.x, ripple.y, ripple.radius * 2);
    
    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
