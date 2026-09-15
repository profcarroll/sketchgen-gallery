let particles = [];
let forms = [];
let palette = [];
let deepPalette = [];
let cameraZ;
let dragStart = { x: 0, y: 0 };
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cameraZ = height / (2 * tan(PI / 6));
  
  // Initialize color palettes
  palette = [
    [255, 240, 230], [240, 220, 210], [220, 200, 190],
    [200, 180, 170], [180, 160, 150], [160, 140, 130]
  ];
  
  deepPalette = [
    [100, 50, 80], [80, 30, 60], [60, 20, 40],
    [40, 10, 30], [20, 5, 20], [10, 2, 10]
  ];
  
  // Create particles
  for (let i = 0; i < 2000; i++) {
    particles.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-cameraZ * 2, cameraZ * 2),
      size: random(1, 3),
      speed: random(0.001, 0.005),
      color: palette[floor(random(palette.length))]
    });
  }
  
  // Create geometric forms
  for (let i = 0; i < 3; i++) {
    forms.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-cameraZ * 2, cameraZ * 2),
      size: random(50, 150),
      visible: false,
      pulse: 0,
      pulseSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  background(0);
  
  // Update and draw particles
  for (let p of particles) {
    p.y += sin(frameCount * p.speed) * 0.5;
    p.x += cos(frameCount * p.speed) * 0.3;
    
    // Adjust color based on position
    let colorIndex = floor(map(p.y, -height/2, height/2, 0, palette.length));
    colorIndex = constrain(colorIndex, 0, palette.length - 1);
    p.color = palette[colorIndex];
    
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(p.color[0], p.color[1], p.color[2], 150);
    sphere(p.size);
    pop();
  }
  
  // Update and draw forms
  let formCount = 0;
  for (let f of forms) {
    f.pulse += f.pulseSpeed;
    
    if (dist(mouseX, mouseY, f.x, f.y) < f.size * 0.7) {
      f.visible = true;
      formCount++;
    } else {
      f.visible = false;
    }
    
    if (f.visible) {
      push();
      translate(f.x, f.y, f.z);
      noFill();
      stroke(255, 100);
      rotateX(frameCount * 0.005);
      rotateY(frameCount * 0.003);
      box(f.size + sin(f.pulse) * 20);
      pop();
    }
  }
  
  // Deepen palette when all forms are visible
  if (formCount === 3) {
    for (let i = 0; i < palette.length; i++) {
      palette[i] = deepPalette[i];
    }
  } else {
    // Reset to original palette
    palette = [
      [255, 240, 230], [240, 220, 210], [220, 200, 190],
      [200, 180, 170], [180, 160, 150], [160, 140, 130]
    ];
  }
  
  // Handle mouse drag for camera movement
  if (isDragging) {
    cameraZ += (mouseX - dragStart.x) * 0.1;
    cameraZ = constrain(cameraZ, height / 4, height * 2);
    dragStart.x = mouseX;
  }
  
  // Update camera position
  perspective(PI/3, width/height, 1, cameraZ * 4);
}

function mousePressed() {
  isDragging = true;
  dragStart.x = mouseX;
  dragStart.y = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
