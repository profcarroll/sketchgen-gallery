let horseBody, frontLeg1, frontLeg2, backLeg1, backLeg2;
let phase = 0;

function setup() {
  createCanvas(400, 400);
  noFill();
  strokeWeight(3);
  
  // Precompute paths for the horse parts using Bézier curves
  horseBody = [];
  for (let i = 0; i < 10; i++) {
    let t = map(i, 0, 9, 0, TWO_PI);
    let x = 200 + 80 * cos(t);
    let y = 200 + 60 * sin(t);
    horseBody.push({x, y});
  }

  frontLeg1 = [];
  for (let i = 0; i < 8; i++) {
    let t = map(i, 0, 7, 0, PI/2);
    let x = 150 + 30 * cos(t);
    let y = 200 - 40 * sin(t);
    frontLeg1.push({x, y});
  }

  frontLeg2 = [];
  for (let i = 0; i < 8; i++) {
    let t = map(i, 0, 7, 0, PI/2);
    let x = 250 + 30 * cos(t);
    let y = 200 - 40 * sin(t);
    frontLeg2.push({x, y});
  }

  backLeg1 = [];
  for (let i = 0; i < 8; i++) {
    let t = map(i, 0, 7, PI/2, PI);
    let x = 130 + 40 * cos(t);
    let y = 250 - 30 * sin(t);
    backLeg1.push({x, y});
  }

  backLeg2 = [];
  for (let i = 0; i < 8; i++) {
    let t = map(i, 0, 7, PI/2, PI);
    let x = 270 + 40 * cos(t);
    let y = 250 - 30 * sin(t);
    backLeg2.push({x, y});
  }
}

function draw() {
  background(240);
  
  phase += 0.05;
  
  // Draw horse body
  beginShape();
  for (let i = 0; i < horseBody.length; i++) {
    let x = horseBody[i].x;
    let y = horseBody[i].y + sin(phase + i * 0.3) * 10;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Draw front legs
  drawLeg(frontLeg1, phase + PI/4);
  drawLeg(frontLeg2, phase - PI/4);
  
  // Draw back legs
  drawLeg(backLeg1, phase + PI*3/4);
  drawLeg(backLeg2, phase - PI*3/4);
}

function drawLeg(legPoints, offset) {
  beginShape();
  for (let i = 0; i < legPoints.length; i++) {
    let x = legPoints[i].x;
    let y = legPoints[i].y + sin(offset + i * 0.2) * 15;
    vertex(x, y);
  }
  endShape();
}
