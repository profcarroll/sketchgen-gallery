let pyramids = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of pyramids
  for (let x = -200; x <= 200; x += 40) {
    for (let z = -200; z <= 200; z += 40) {
      pyramids.push({
        x: x,
        z: z,
        height: random(30, 80),
        baseSize: random(15, 30),
        hue: random(360)
      });
    }
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.2) * 200;
  let camZ = cos(time * 0.3) * 200;
  camera(camX, 150, camZ, 0, 0, 0, 0, 1, 0);
  
  // Ambient light
  ambientLight(20);
  
  // Directional light that pulses
  let pulse = sin(time * 2) * 0.5 + 0.5;
  pointLight(255, 255, 255, 0, -200, 0);
  
  // Draw pyramids
  for (let i = 0; i < pyramids.length; i++) {
    let p = pyramids[i];
    
    // Color animation
    let hue = (p.hue + time * 10) % 360;
    let saturation = 80 + sin(time + i) * 20;
    let brightness = 60 + sin(time * 0.5 + i) * 30;
    
    push();
    translate(p.x, 0, p.z);
    
    // Base of pyramid
    fill(hue, saturation, brightness, 0.8);
    noStroke();
    beginShape();
    vertex(-p.baseSize/2, 0, -p.baseSize/2);
    vertex(p.baseSize/2, 0, -p.baseSize/2);
    vertex(p.baseSize/2, 0, p.baseSize/2);
    vertex(-p.baseSize/2, 0, p.baseSize/2);
    endShape(CLOSE);
    
    // Pyramid faces
    fill(hue, saturation, brightness * 1.2, 0.9);
    beginShape(TRIANGLES);
    vertex(0, -p.height, 0);  // apex
    vertex(-p.baseSize/2, 0, -p.baseSize/2);
    vertex(p.baseSize/2, 0, -p.baseSize/2);
    
    vertex(0, -p.height, 0);
    vertex(p.baseSize/2, 0, -p.baseSize/2);
    vertex(p.baseSize/2, 0, p.baseSize/2);
    
    vertex(0, -p.height, 0);
    vertex(p.baseSize/2, 0, p.baseSize/2);
    vertex(-p.baseSize/2, 0, p.baseSize/2);
    
    vertex(0, -p.height, 0);
    vertex(-p.baseSize/2, 0, p.baseSize/2);
    vertex(-p.baseSize/2, 0, -p.baseSize/2);
    endShape();
    
    pop();
  }
  
  // Pulsing glow effect
  let glow = sin(time * 3) * 0.5 + 0.5;
  for (let i = 0; i < pyramids.length; i++) {
    let p = pyramids[i];
    let pulse = sin(time * 2 + i) * 0.5 + 0.5;
    
    push();
    translate(p.x, -p.height/2, p.z);
    noStroke();
    fill(180, 80, 100, 0.1 * pulse);
    sphere(p.baseSize * 0.7);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
