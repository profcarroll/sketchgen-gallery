let horse;
let t = 0;

function setup() {
  createCanvas(400, 400);
  horse = createGraphics(400, 400);
  horse.background(255);
  horse.noStroke();
}

function draw() {
  background(240);
  
  // Simulate galloping motion with slow, rhythmic movement
  t += 0.02;
  
  // Draw the horse body with exaggerated musculature
  horse.clear();
  horse.translate(200, 200);
  
  // Horse body (main muscle groups)
  horse.fill(139, 69, 19);
  horse.push();
  horse.rotate(sin(t) * 0.1);
  horse.ellipse(0, 0, 150, 80); // Body
  horse.pop();
  
  // Neck and head
  horse.fill(139, 69, 19);
  horse.push();
  horse.rotate(-sin(t * 0.8) * 0.2);
  horse.translate(60, -20);
  horse.ellipse(0, 0, 40, 30); // Head
  horse.pop();
  
  // Legs (animated)
  for (let i = 0; i < 4; i++) {
    let legAngle = sin(t + i * 0.5) * 0.3;
    let legX = (i % 2 === 0 ? -40 : 40);
    let legY = (i < 2 ? 30 : -30);
    
    horse.fill(139, 69, 19);
    horse.push();
    horse.translate(legX, legY);
    horse.rotate(legAngle);
    horse.rectMode(CENTER);
    horse.rect(0, 0, 10, 50); // Leg
    horse.pop();
  }
  
  // Mane
  horse.fill(139, 69, 19);
  for (let i = 0; i < 10; i++) {
    let angle = -0.2 + sin(t + i * 0.3) * 0.1;
    horse.push();
    horse.translate(50, -30);
    horse.rotate(angle);
    horse.rect(0, 0, 3, 20);
    horse.pop();
  }
  
  image(horse, 0, 0);
}
