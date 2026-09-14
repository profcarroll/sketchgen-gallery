let titleText = "CINEMATIC OPENING";
let subtitleText = "A Visual Spectacle";
let titles = [];
let colors = [
  [255, 215, 0],   // Gold
  [0, 0, 139],     // Dark Blue
  [255, 255, 255], // White
  [139, 0, 0],     // Dark Red
  [0, 100, 0]      // Dark Green
];
let currentColorIndex = 0;
let fadeSpeed = 0.02;
let scaleSpeed = 0.005;
let panSpeed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(100);
  textFont('Georgia');
  
  titles.push({
    text: titleText,
    x: width / 2,
    y: height / 2 - 50,
    scale: 0,
    alpha: 0,
    fadeDirection: 1
  });
  
  titles.push({
    text: subtitleText,
    x: width / 2,
    y: height / 2 + 50,
    scale: 0,
    alpha: 0,
    fadeDirection: 1
  });
}

function draw() {
  background(0);
  
  // Cycle through color palettes
  if (frameCount % 300 === 0) {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
  }
  
  let c = colors[currentColorIndex];
  fill(c[0], c[1], c[2]);
  noStroke();
  
  // Animate each title
  for (let i = 0; i < titles.length; i++) {
    let t = titles[i];
    
    // Fade in/out
    t.alpha += fadeSpeed * t.fadeDirection;
    
    if (t.alpha > 255) {
      t.alpha = 255;
      t.fadeDirection = -1;
    } else if (t.alpha < 0) {
      t.alpha = 0;
      t.fadeDirection = 1;
    }
    
    // Scale up/down
    t.scale += scaleSpeed * (t.fadeDirection > 0 ? 1 : -1);
    
    if (t.scale > 1.5) t.scale = 1.5;
    if (t.scale < 0.5) t.scale = 0.5;
    
    // Pan across the screen
    t.x += panSpeed;
    
    if (t.x > width + 200) {
      t.x = -200;
    }
    
    fill(c[0], c[1], c[2], t.alpha);
    textSize(100 * t.scale);
    text(t.text, t.x, t.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
