let fields = [];
let sculptures = [];
let clickTime = 0;
let isClicking = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  
  // Create fluid light fields
  for (let i = 0; i < 1000; i++) {
    fields.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(20, 80),
      speed: random(0.001, 0.005),
      color: color(random(100, 255), random(100, 255), random(200, 255), 100)
    });
  }
  
  // Create sculptural forms
  for (let i = 0; i < 5; i++) {
    sculptures.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(40, 100),
      color: color(random(50, 150), random(50, 150), random(200, 255), 200)
    });
  }
}

function draw() {
  background(0);
  
  // Animate light fields
  for (let field of fields) {
    field.z += field.speed;
    if (field.z > 100) field.z = -100;
    
    let brightness = sin(frameCount * 0.01 + field.z * 0.02) * 50 + 100;
    fill(red(field.color), green(field.color), blue(field.color), brightness);
    
    push();
    translate(field.x, field.y, field.z);
    sphere(field.size * (0.5 + sin(frameCount * 0.01 + field.z * 0.02) * 0.3));
    pop();
  }
  
  // Draw sculptural forms
  for (let sculpture of sculptures) {
    fill(sculpture.color);
    
    push();
    translate(sculpture.x, sculpture.y, sculpture.z);
    
    // Add subtle highlight and shadow
    if (isClicking && millis() - clickTime < 1000) {
      fill(red(sculpture.color), green(sculpture.color), blue(sculpture.color) + 50);
    }
    
    box(sculpture.size);
    pop();
  }
  
  // If clicked, shift the fields and sculptures
  if (isClicking && millis() - clickTime < 1000) {
    for (let field of fields) {
      field.x += sin(frameCount * 0.02) * 2;
      field.y += cos(frameCount * 0.02) * 2;
    }
    
    for (let sculpture of sculptures) {
      sculpture.z += sin(frameCount * 0.01) * 0.5;
    }
  }
}

function mousePressed() {
  isClicking = true;
  clickTime = millis();
  
  // Shift light fields and sculptural forms
  for (let field of fields) {
    field.x += random(-20, 20);
    field.y += random(-20, 20);
  }
  
  for (let sculpture of sculptures) {
    sculpture.x += random(-30, 30);
    sculpture.y += random(-30, 30);
  }
}
