let clouds = [];
let lights = [];
let gradient;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create gradient background
  gradient = createGraphics(width, height);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(220, 80, 20), color(270, 90, 10), inter);
    gradient.stroke(c);
    gradient.line(0, y, width, y);
  }
  
  // Create cloud formations
  for (let i = 0; i < 15; i++) {
    clouds.push({
      x: random(width),
      y: random(height),
      size: random(200, 600),
      speed: random(0.001, 0.003),
      angle: random(TWO_PI),
      opacity: random(0.3, 0.7)
    });
  }
  
  // Create glowing lights within clouds
  for (let i = 0; i < 200; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      hue: random(360),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  // Draw gradient background
  image(gradient, 0, 0);
  
  // Update and draw clouds
  for (let cloud of clouds) {
    cloud.angle += cloud.speed;
    
    push();
    translate(cloud.x, cloud.y);
    rotate(cloud.angle);
    
    // Draw flowing cloud shape with pulsing opacity
    noFill();
    stroke(250, 10, 80, cloud.opacity);
    strokeWeight(2);
    
    beginShape();
    for (let i = 0; i < 100; i++) {
      let angle = map(i, 0, 99, 0, TWO_PI);
      let radius = cloud.size * (0.7 + 0.3 * sin(angle * 3 + cloud.angle));
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw secondary flow
    stroke(240, 15, 70, cloud.opacity * 0.6);
    beginShape();
    for (let i = 0; i < 100; i++) {
      let angle = map(i, 0, 99, 0, TWO_PI);
      let radius = cloud.size * 0.5 * (0.8 + 0.2 * cos(angle * 4 + cloud.angle * 1.5));
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw glowing lights
  for (let light of lights) {
    light.pulsePhase += light.pulseSpeed;
    let pulse = abs(sin(light.pulsePhase));
    
    push();
    translate(light.x, light.y);
    
    // Create colored reflection
    noStroke();
    fill(light.hue, 100, 100, pulse * 0.8);
    ellipse(0, 0, light.size * 3);
    
    // Inner glow
    fill(light.hue, 100, 100, pulse * 0.5);
    ellipse(0, 0, light.size * 1.5);
    
    pop();
  }
  
  // Add subtle motion to lights
  for (let light of lights) {
    light.x += sin(frameCount * 0.001 + light.hue) * 0.2;
    light.y += cos(frameCount * 0.001 + light.hue) * 0.2;
    
    // Keep lights on screen
    if (light.x < 0) light.x = width;
    if (light.x > width) light.x = 0;
    if (light.y < 0) light.y = height;
    if (light.y > height) light.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
