let facets = [];
let hexagonMask;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create crystalline facets
  for (let i = 0; i < 2000; i++) {
    facets.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(5, 30),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
  
  // Create hexagon mask
  hexagonMask = createGraphics(width, height);
  hexagonMask.noStroke();
  hexagonMask.fill(0);
  hexagonMask.triangle(-width/2, -height/2, width/2, -height/2, 0, height/2);
}

function draw() {
  background(0);
  
  // Slow camera movement
  time += 0.002;
  
  // Camera position with breathing effect
  let camZ = map(sin(time), -1, 1, -500, -1500);
  let camX = sin(time * 0.5) * 100;
  let camY = cos(time * 0.3) * 50;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw facets
  for (let i = 0; i < facets.length; i++) {
    let f = facets[i];
    
    // Animate each facet
    let pulse = sin(time * 2 + i * 0.01) * 0.5 + 0.5;
    let scale = 1 + pulse * 0.3;
    
    push();
    translate(f.x, f.y, f.z);
    rotateX(time * 0.1 + i * 0.02);
    rotateY(time * 0.15 + i * 0.03);
    
    // Color based on position
    fill(red(f.color), green(f.color), blue(f.color), 200);
    
    // Draw crystalline facet (a simple shape)
    sphere(f.size * scale, 4, 3);
    pop();
  }
  
  // Apply hexagon mask to entire canvas
  blendMode(DIFFERENCE);
  image(hexagonMask, -width/2, -height/2);
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
