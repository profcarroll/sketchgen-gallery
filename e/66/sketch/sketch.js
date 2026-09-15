let layers = [];
let isClickActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create multiple layers with varying colors and opacities
  for (let i = 0; i < 15; i++) {
    layers.push({
      y: map(i, 0, 14, -height/2, height/2),
      h: height / 15,
      color: color(random(30, 80), random(20, 60), random(70, 120), random(30, 60)),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(0);
  
  // Apply subtle movement to layers
  for (let layer of layers) {
    let offset = sin(frameCount * layer.speed) * 20;
    
    push();
    translate(0, layer.y + offset);
    fill(layer.color);
    rect(-width/2, -layer.h/2, width, layer.h);
    pop();
  }
  
  // Intensify diffusion on click
  if (isClickActive) {
    for (let i = 0; i < layers.length; i++) {
      let layer = layers[i];
      let intensity = map(i, 0, layers.length - 1, 0.8, 1.2);
      
      push();
      translate(0, layer.y);
      fill(red(layer.color), green(layer.color), blue(layer.color), layer.color._getAlpha() * intensity);
      rect(-width/2, -layer.h/2, width, layer.h);
      pop();
    }
  }
}

function mousePressed() {
  isClickActive = !isClickActive;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
