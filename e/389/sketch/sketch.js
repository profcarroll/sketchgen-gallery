let strands = [];
let angle = 0;
let radius = 150;
let strandCount = 2;
let baseCount = 20;
let baseRadius = 10;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  
  for (let i = 0; i < strandCount; i++) {
    strands[i] = [];
    for (let j = 0; j < baseCount; j++) {
      let x = radius * cos(angle + j * 0.5 + i * PI);
      let y = j * 10 - 100;
      let z = radius * sin(angle + j * 0.5 + i * PI);
      
      strands[i].push({x, y, z});
    }
  }
}

function draw() {
  background(20);
  
  rotateY(angle * 0.3);
  rotateX(angle * 0.1);
  
  for (let i = 0; i < strandCount; i++) {
    for (let j = 0; j < baseCount; j++) {
      let x = strands[i][j].x;
      let y = strands[i][j].y;
      let z = strands[i][j].z;
      
      push();
      translate(x, y, z);
      
      // Color coding for bases
      switch (j % 4) {
        case 0: fill(255, 100, 100); break; // A - Red
        case 1: fill(100, 255, 100); break; // T - Green
        case 2: fill(100, 100, 255); break; // C - Blue
        case 3: fill(255, 255, 100); break; // G - Yellow
      }
      
      sphere(baseRadius);
      
      pop();
    }
  }
  
  angle += 0.01;
}
