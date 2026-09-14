function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  noStroke();
  
  // Create a sense of vastness with distant, repeating structures
  for (let i = 0; i < 50; i++) {
    push();
    // Position elements further back in space
    translate(0, 0, -i * 200);
    
    // Create rusted steel appearance using hue variation and subtle lighting
    let hue = 10 + sin(frameCount * 0.005 + i) * 5;
    let saturation = 40 + sin(frameCount * 0.003 + i) * 10;
    fill(hue, saturation, 20, 0.9);
    
    // Create large, rusted steel beams
    rotateY(frameCount * 0.001 + i * 0.1);
    box(300, 20, 500);
    
    pop();
  }
  
  // Add a dramatic perpendicular buttress at the end of the path
  push();
  translate(0, 0, -1000);
  rotateY(HALF_PI);
  fill(10, 30, 10, 0.95);
  box(200, 800, 20);
  pop();
  
  // Add subtle texture to the walls
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, -1000);
    fill(0, 0, 0, 0.1);
    noStroke();
    ellipse(x, y, 3, 3);
  }
}
