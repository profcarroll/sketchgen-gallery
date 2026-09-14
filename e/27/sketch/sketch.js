let time = 0;
let sun;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  sun = { x: 0, y: 0, z: 0 };
}

function draw() {
  time += 0.002;
  
  background(0);
  
  // Create dynamic sky color based on time
  let skyHue = (time * 30) % 360;
  let skySat = 80;
  let skyBri = 50 + 40 * sin(time * 2);
  
  // Draw sky gradient
  for (let i = 0; i < height; i++) {
    let t = map(i, 0, height, 0, 1);
    let h = lerp(200, 30, t); // Blue to orange
    let s = lerp(80, 50, t);
    let b = lerp(60, 20, t);
    stroke(h, s, b);
    line(-width/2, i - height/2, width/2, i - height/2);
  }
  
  // Draw reflective wet surface
  push();
  translate(0, height/4, 0);
  rotateX(PI/2);
  fill(180, 20, 50, 0.7);
  plane(width, height/2);
  pop();
  
  // Draw cityscape
  drawCityscape();
  
  // Update sun position based on time
  sun.x = sin(time) * width/2;
  sun.y = cos(time) * height/4;
  sun.z = 0;
  
  // Add lighting effects from sun
  pointLight(255, 255, 255, sun.x, sun.y, sun.z);
}

function drawCityscape() {
  // Draw buildings
  for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
      let x = i * 100;
      let z = j * 100;
      
      // Building height based on position
      let h = 50 + 100 * noise(i * 0.1, j * 0.1, time);
      
      // Draw building with varying colors
      push();
      translate(x, -h/2, z);
      fill(30, 30, 70, 0.8);
      box(60, h, 60);
      
      // Add windows
      fill(60, 80, 90, 0.7);
      for (let k = 0; k < h/10; k++) {
        if (k % 3 === 0) {
          push();
          translate(0, -h/2 + k * 10, 30);
          box(50, 8, 5);
          pop();
        }
      }
      pop();
    }
  }
  
  // Draw plants
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let h = random(10, 30);
    
    push();
    translate(x, -h/2, z);
    fill(120, 70, 50, 0.9);
    box(5, h, 5);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
