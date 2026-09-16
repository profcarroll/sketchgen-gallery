let horseShape;
let step = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
  
  // Create a stylized horse shape using multiple ellipses and rectangles
  horseShape = createGraphics(200, 200);
  horseShape.noStroke();
  horseShape.fill(255, 100, 100); // Reddish color for body
  horseShape.ellipse(100, 80, 60, 40); // Body
  horseShape.ellipse(130, 70, 20, 25); // Neck
  horseShape.ellipse(140, 60, 15, 10); // Head
  horseShape.fill(255, 150, 100); // Lighter color for legs
  horseShape.rect(80, 100, 10, 40); // Leg 1
  horseShape.rect(100, 100, 10, 40); // Leg 2
  horseShape.rect(120, 100, 10, 40); // Leg 3
  horseShape.rect(140, 100, 10, 40); // Leg 4
}

function draw() {
  background(50, 150, 200); // Sky blue background
  
  // Animate the horse by shifting its position and rotation
  let x = 100 + sin(step * 0.05) * 30;
  let y = 200 + cos(step * 0.03) * 20;
  let angle = sin(step * 0.04) * 0.2;

  push();
  translate(x, y);
  rotate(angle);
  
  // Draw the horse using precomputed shape
  image(horseShape, -100, -100);
  
  pop();
  
  step++;
}
