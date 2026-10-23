let gasClouds = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create volumetric gas clouds with neon glow
  for (let i = 0; i < 20; i++) {
    gasClouds.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(50, 150),
      hue: random(360),
      speed: random(0.002, 0.008),
      pulse: random(0.5, 2),
      phase: random(TWO_PI),
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Draw gas clouds with volumetric effect and neon glow
  for (let i = 0; i < gasClouds.length; i++) {
    let cloud = gasClouds[i];
    
    push();
    
    // Slow, continuous movement
    cloud.x += sin(time * cloud.speed) * 0.5;
    cloud.y += cos(time * cloud.speed * 0.7) * 0.3;
    cloud.z += sin(time * cloud.speed * 0.5) * 0.2;
    
    // Position cloud in 3D space
    translate(cloud.x, cloud.y, cloud.z);
    
    // Pulsating glow effect
    let pulse = sin(time * cloud.pulse + cloud.phase) * 0.3 + 0.7;
    
    // Create soft volumetric glow with multiple layers
    for (let j = 0; j < 5; j++) {
      let layerSize = cloud.size * (1 - j * 0.15);
      let layerAlpha = cloud.alpha * pulse * (1 - j * 0.15);
      
      // Use a color that shifts between electric blues, magentas, and cyans
      let hue = (cloud.hue + time * 20 + j * 30) % 360;
      
      noStroke();
      fill(hue, 100, 100, layerAlpha);
      
      // Draw a sphere for each layer to create volume
      sphere(layerSize / 2, 8, 6);
    }
    
    pop();
    
    // Update hue for subtle color shift over time
    cloud.hue += 0.1;
    if (cloud.hue > 360) cloud.hue -= 360;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
