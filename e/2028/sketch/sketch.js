let layers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create layered rock strata with warm earth tones
  for (let i = 0; i < 30; i++) {
    const z = -i * 150 - 500;
    const height = random(200, 400);
    const width = random(800, 1200);
    const depth = random(50, 150);
    
    // Warm, earthy colors for rock layers
    const r = random(100, 180);
    const g = random(60, 120);
    const b = random(30, 90);
    
    layers.push({
      x: random(-500, 500),
      y: random(-200, 200),
      z,
      width,
      height,
      depth,
      color: [r, g, b],
      tilt: random(-0.3, 0.3)
    });
  }
}

function draw() {
  background(10, 15, 25);
  
  // Slowly drift through the cavern
  time += 0.002;
  
  // Set up camera with slow, organic movement
  const camX = sin(time * 0.3) * 300;
  const camY = cos(time * 0.2) * 150;
  const camZ = -time * 100;
  
  const targetX = camX + sin(time * 0.1) * 100;
  const targetY = camY + cos(time * 0.15) * 100;
  const targetZ = camZ - 2000;
  
  perspective(PI / 3, width / height, 1, 5000);
  camera(camX, camY, camZ, targetX, targetY, targetZ, 0, 1, 0);
  
  // Draw each rock layer
  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    
    push();
    translate(l.x, l.y, l.z);
    rotateX(l.tilt);
    
    // Layered rock with subtle bioluminescent glow
    fill(l.color[0], l.color[1], l.color[2]);
    box(l.width, l.height, l.depth);
    
    // Add some bioluminescent highlights
    const highlight = color(30, 200, 255, 80);
    fill(highlight);
    for (let j = 0; j < 3; j++) {
      const hX = random(-l.width/2 + 10, l.width/2 - 10);
      const hY = random(-l.height/2 + 10, l.height/2 - 10);
      const hSize = random(5, 30);
      
      push();
      translate(hX, hY, l.depth/2 - 2);
      sphere(hSize);
      pop();
    }
    
    pop();
  }
  
  // Add some pulsing bioluminescent pockets in the cavern walls
  for (let i = 0; i < 20; i++) {
    const x = random(-1000, 1000);
    const y = random(-500, 500);
    const z = -time * 100 - random(1000, 3000);
    const size = random(20, 80);
    const pulse = sin(time * 3 + i) * 10;
    
    push();
    translate(x, y, z);
    noStroke();
    fill(0, 255, 255, 100);
    sphere(size + pulse);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
