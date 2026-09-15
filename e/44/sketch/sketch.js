let textElements = [];
let camera;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera = createCamera();
  
  // Preload some text elements with different depths and styles
  const texts = [
    "NEBULA",
    "VOID",
    "STELLAR",
    "CONSTELLATION",
    "ASTRONOMY",
    "SPACE",
    "QUANTUM"
  ];
  
  for (let i = 0; i < 12; i++) {
    textElements.push({
      text: random(texts),
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, -2000),
      size: random(40, 120),
      speed: random(0.001, 0.005),
      color: color(random(50, 200), random(50, 200), random(100, 255), 200),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Slowly rotate the camera for immersive effect
  time += 0.001;
  camera.setPosition(
    sin(time * 0.3) * 500,
    cos(time * 0.2) * 300,
    800 + sin(time * 0.1) * 200
  );
  camera.lookAt(0, 0, 0);
  
  // Draw stars in background
  drawStars();
  
  // Update and display text elements
  for (let element of textElements) {
    element.z += element.speed;
    
    // Reset if out of view
    if (element.z > 100) {
      element.z = random(-2000, -500);
      element.x = random(-width/2, width/2);
      element.y = random(-height/2, height/2);
    }
    
    push();
    translate(element.x, element.y, element.z);
    rotateY(element.rotation + time * 0.5);
    rotateX(sin(time * 0.3 + element.x) * 0.1);
    
    // Depth-of-field effect
    let blur = map(element.z, -2000, 100, 0, 10);
    filter(BLUR, blur);
    
    fill(element.color);
    noStroke();
    textSize(element.size);
    textAlign(CENTER, CENTER);
    text(element.text, 0, 0);
    pop();
  }
}

function drawStars() {
  // Draw a few background stars to simulate space
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    fill(255, 255, 255, 180);
    noStroke();
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
