let speaker;
let magnet;
let ripples = [];
let cone;

function setup() {
  createCanvas(windowWidth, windowHeight);
  speaker = { x: width/2, y: height/2 };
  cone = { x: width/2, y: height/2, radius: 30 };
  magnet = { x: width/2 - 80, y: height/2, radius: 15 };
}

function draw() {
  background(20);
  
  // Draw speaker
  fill(50);
  rect(speaker.x - 60, speaker.y - 30, 120, 60);
  
  // Draw cone
  fill(80);
  ellipse(cone.x, cone.y, cone.radius * 2, cone.radius * 2);
  
  // Draw magnet
  fill(150, 0, 0);
  ellipse(magnet.x, magnet.y, magnet.radius * 2, magnet.radius * 2);
  
  // Simulate vibration
  let time = millis() / 100;
  let vibration = sin(time) * 3;
  cone.y += vibration;
  magnet.y += vibration;
  
  // Create ripples
  if (frameCount % 5 === 0) {
    ripples.push({
      x: cone.x,
      y: cone.y,
      radius: 0,
      alpha: 255,
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
  
  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.radius += 2;
    ripple.alpha -= 2;
    
    noFill();
    stroke(ripple.color);
    strokeWeight(2);
    ellipse(ripple.x, ripple.y, ripple.radius * 2);
    
    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
