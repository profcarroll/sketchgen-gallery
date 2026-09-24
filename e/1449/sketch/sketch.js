let stripeHeight = 20;
let fabricHeight = 0;
let stripes = [];
let colors = ['#8B4513', '#CD853F', '#D2691E', '#A0522D'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  fabricHeight = 0;
}

function draw() {
  background(240);
  
  // Grow the fabric upward
  fabricHeight += 0.5;
  
  // Draw existing stripes
  for (let i = 0; i < stripes.length; i++) {
    let stripe = stripes[i];
    fill(stripe.color);
    rect(0, stripe.y, width, stripeHeight);
  }
  
  // Add new stripe at the bottom
  if (fabricHeight > stripeHeight) {
    let newY = height - fabricHeight;
    let color = colors[Math.floor(frameCount / 10) % colors.length];
    stripes.push({y: newY, color: color});
    
    // Keep only visible stripes
    while (stripes.length > 0 && stripes[0].y > height) {
      stripes.shift();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
