let ball;
let funnel;
let gravity;
let slope;

function setup() {
  createCanvas(600, 600, WEBGL);
  gravity = createVector(0, 0.2);
  ball = {
    pos: createVector(0, -200),
    vel: createVector(0, 0),
    radius: 10
  };
  
  funnel = [];
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI);
    let r = 200 - i * 2;
    let x = r * cos(angle);
    let y = r * sin(angle);
    funnel.push({x, y});
  }
  
  slope = {
    start: createVector(-300, 250),
    end: createVector(300, 250)
  };
}

function draw() {
  background(0);
  rotateX(PI/4);
  rotateY(frameCount * 0.01);
  
  // Apply gravity
  ball.vel.add(gravity);
  ball.pos.add(ball.vel);
  
  // Funnel collision detection and response
  let inFunnel = false;
  for (let i = 0; i < funnel.length - 1; i++) {
    let p1 = funnel[i];
    let p2 = funnel[i + 1];
    
    let d = dist(ball.pos.x, ball.pos.y, p1.x, p1.y);
    if (d < ball.radius + 5) {
      // Simple reflection
      let normal = createVector(ball.pos.x - p1.x, ball.pos.y - p1.y);
      normal.normalize();
      let dot = ball.vel.dot(normal);
      ball.vel.sub(normal.mult(2 * dot));
      ball.vel.mult(0.8); // Energy loss
      inFunnel = true;
    }
  }
  
  // Slope transition
  if (ball.pos.y > 200 && !inFunnel) {
    let slopeY = slope.start.y + (slope.end.y - slope.start.y) * (ball.pos.x - slope.start.x) / (slope.end.x - slope.start.x);
    if (ball.pos.y > slopeY - 5) {
      ball.vel.x *= 0.9;
      ball.vel.y *= 0.9;
      ball.vel.y += 0.1; // Gravity on slope
    }
  }
  
  // Draw funnel
  noFill();
  stroke(255);
  beginShape();
  for (let p of funnel) {
    vertex(p.x, p.y, 0);
  }
  endShape(CLOSE);
  
  // Draw slope
  stroke(100);
  line(slope.start.x, slope.start.y, 0, slope.end.x, slope.end.y, 0);
  
  // Draw ball
  noStroke();
  fill(255, 100, 100);
  sphere(ball.radius);
}
