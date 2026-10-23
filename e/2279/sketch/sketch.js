let layers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create layered rock strata with warm earth tones and cool blues
  for (let i = 0; i < 30; i++) {
    const z = -i * 200 - 600;
    const height = random(300, 500);
    const width = random(1000, 1400);
    const depth = random(80, 200);
    
    // Warm ochre and deep cool blues for the environment
    const r = random(120, 180);
    const g = random(70, 120);
    const b = random(30, 90);
    
    layers.push({
      x: random(-600, 600),
      y: random(-300, 300),
      z,
      width,
      height,
      depth,
      color: [r, g, b],
      tilt: random(-0.5, 0.5),
      foldPhase: random(PI * 2)
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  // Slowly drift through the cavern
  time += 0.003;
  
  // Set up camera with slow, organic movement
  const camX = sin(time * 0.15) * 300;
  const camY = cos(time * 0.1) * 150;
  const camZ = -time * 70;
  
  const targetX = camX + sin(time * 0.06) * 120;
  const targetY = camY + cos(time * 0.1) * 120;
  const targetZ = camZ - 2000;
  
  perspective(PI / 3, width / height, 1, 5000);
  camera(camX, camY, camZ, targetX, targetY, targetZ, 0, 1, 0);
  
  // Draw each rock layer
  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    
    push();
    translate(l.x, l.y, l.z);
    rotateX(l.tilt + sin(time * 0.4 + l.foldPhase) * 0.3);
    
    // Layered rock with subtle bioluminescent glow
    fill(l.color[0], l.color[1], l.color[2]);
    box(l.width, l.height, l.depth);
    
    // Add some bioluminescent highlights
    const highlight = color(40, 220, 255, 100);
    fill(highlight);
    for (let j = 0; j < 3; j++) {
      const hX = random(-l.width/2 + 20, l.width/2 - 20);
      const hY = random(-l.height/2 + 20, l.height/2 - 20);
      const hSize = random(10, 40);
      
      push();
      translate(hX, hY, l.depth/2 - 3);
      sphere(hSize);
      pop();
    }
    
    pop();
  }
  
  // Add some pulsing bioluminescent pockets in the cavern walls
  for (let i = 0; i < 20; i++) {
    const x = random(-1500, 1500);
    const y = random(-700, 700);
    const z = -time * 70 - random(1000, 4000);
    const size = random(30, 100);
    const pulse = sin(time * 2.5 + i) * 20;
    
    push();
    translate(x, y, z);
    noStroke();
    fill(0, 240, 255, 120);
    sphere(size + pulse);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
