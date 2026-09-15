let planes = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  
  // Create multiple geometric planes
  for (let i = 0; i < 20; i++) {
    planes.push({
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-500, 500),
      size: random(50, 150),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(30, 120, 100, 180)
    });
  }
}

function draw() {
  background(10, 20, 25);
  
  // Ambient lighting
  ambientLight(60);
  pointLight(200, 230, 255, 0, 0, 300);
  pointLight(100, 180, 200, 0, 0, -300);
  
  // Slow time progression
  time += 0.002;
  
  // Rotate entire scene slowly
  rotateY(time * 0.1);
  
  for (let i = 0; i < planes.length; i++) {
    push();
    
    let p = planes[i];
    
    // Move planes in subtle patterns
    let offsetX = sin(time + i) * 20;
    let offsetY = cos(time * 0.7 + i) * 15;
    let offsetZ = sin(time * 0.5 + i) * 30;
    
    translate(p.x + offsetX, p.y + offsetY, p.z + offsetZ);
    
    // Rotate each plane independently
    rotateX(p.rotX + time * 0.2);
    rotateY(p.rotY + time * 0.15);
    rotateZ(p.rotZ + time * 0.1);
    
    // Create a dynamic color effect
    let c = lerpColor(p.color, color(40, 140, 120, 180), sin(time * 0.5 + i) * 0.5 + 0.5);
    fill(c);
    
    // Draw the geometric plane
    box(p.size);
    
    pop();
  }
}
