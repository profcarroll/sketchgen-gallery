let receivers = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create industrial radio receiver structures
  for (let i = 0; i < 80; i++) {
    receivers.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-600, -100),
      size: random(40, 100),
      rotation: random(TWO_PI),
      segments: floor(random(3, 7)),
      color: color(random(200, 240), 80, 70, 0.9)
    });
  }
}

function draw() {
  background(20, 10, 15); // Deep metallic dark

  // Ambient lighting
  ambientLight(30);
  
  // Dynamic point light source that moves in a pattern
  let lightX = sin(time * 0.002) * width/3;
  let lightY = cos(time * 0.0015) * height/3;
  pointLight(180, 90, 95, lightX, lightY, -400);
  
  // Rotate scene slowly
  rotateY(time * 0.0005);
  rotateX(time * 0.0002);

  // Draw tessellated patterns on each receiver
  for (let receiver of receivers) {
    push();
    translate(receiver.x, receiver.y, receiver.z);
    
    stroke(receiver.color);
    noFill();
    strokeWeight(1);
    
    let patternTime = time * 0.01 + receiver.x * 0.01;
    
    // Draw geometric tessellations
    beginShape(LINES);
    for (let i = 0; i < receiver.segments; i++) {
      let angle1 = map(i, 0, receiver.segments - 1, 0, TWO_PI);
      let angle2 = map((i + 1) % receiver.segments, 0, receiver.segments - 1, 0, TWO_PI);
      
      let x1 = sin(angle1) * receiver.size;
      let y1 = cos(angle1) * receiver.size;
      let x2 = sin(angle2) * receiver.size;
      let y2 = cos(angle2) * receiver.size;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    // Add inner tessellation
    beginShape(LINES);
    for (let i = 0; i < receiver.segments; i++) {
      let angle1 = map(i, 0, receiver.segments - 1, 0, TWO_PI) + patternTime;
      let angle2 = map((i + 1) % receiver.segments, 0, receiver.segments - 1, 0, TWO_PI) + patternTime;
      
      let x1 = sin(angle1) * receiver.size * 0.5;
      let y1 = cos(angle1) * receiver.size * 0.5;
      let x2 = sin(angle2) * receiver.size * 0.5;
      let y2 = cos(angle2) * receiver.size * 0.5;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    // Add cross pattern
    beginShape(LINES);
    for (let i = 0; i < 4; i++) {
      let angle = map(i, 0, 3, 0, TWO_PI);
      let x1 = sin(angle) * receiver.size * 0.8;
      let y1 = cos(angle) * receiver.size * 0.8;
      let x2 = -sin(angle) * receiver.size * 0.8;
      let y2 = -cos(angle) * receiver.size * 0.8;
      
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    pop();
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
