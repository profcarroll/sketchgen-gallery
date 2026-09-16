let roadSegments = [];
let sidePaths = [];
let roadWidth = 200;
let segmentLength = 100;
let numSegments = 20;
let cameraZ = 0;
let steer = 0;
let targetSteer = 0;
let speed = 5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Generate road segments
  for (let i = 0; i < numSegments; i++) {
    let z = -i * segmentLength;
    let curve = sin(i * 0.2) * 50;
    roadSegments.push({ z, curve });
  }

  // Generate side paths
  for (let i = 0; i < 10; i++) {
    let z = -random(0, numSegments * segmentLength);
    let x = random(-roadWidth/2 + 20, roadWidth/2 - 20);
    let length = random(30, 80);
    sidePaths.push({ z, x, length });
  }
}

function draw() {
  background(220, 10, 90);

  // Update steering with smoothing
  steer += (targetSteer - steer) * 0.05;

  // Move camera forward
  cameraZ += speed;

  // Draw road
  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < roadSegments.length; i++) {
    let segment = roadSegments[i];
    let x = segment.curve + steer * 10;
    let z = segment.z - cameraZ;
    vertex(x, 0, z);
  }
  endShape();

  // Draw road edges
  stroke(255);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < roadSegments.length; i++) {
    let segment = roadSegments[i];
    let x = segment.curve + steer * 10 - roadWidth/2;
    let z = segment.z - cameraZ;
    vertex(x, 0, z);
  }
  endShape();

  beginShape();
  for (let i = 0; i < roadSegments.length; i++) {
    let segment = roadSegments[i];
    let x = segment.curve + steer * 10 + roadWidth/2;
    let z = segment.z - cameraZ;
    vertex(x, 0, z);
  }
  endShape();

  // Draw side paths
  stroke(80, 50, 30);
  strokeWeight(1);
  for (let path of sidePaths) {
    let z = path.z - cameraZ;
    if (z > -segmentLength && z < 0) {
      let x = path.x + steer * 10;
      line(x, 0, z, x, 0, z + path.length);
    }
  }

  // Draw roadside details
  stroke(40, 30, 20);
  strokeWeight(1);
  for (let i = 0; i < roadSegments.length; i++) {
    let segment = roadSegments[i];
    if (i % 5 === 0) {
      let x = segment.curve + steer * 10 - roadWidth/2 - 5;
      let z = segment.z - cameraZ;
      point(x, 0, z);
    }
  }

  for (let i = 0; i < roadSegments.length; i++) {
    let segment = roadSegments[i];
    if (i % 5 === 0) {
      let x = segment.curve + steer * 10 + roadWidth/2 + 5;
      let z = segment.z - cameraZ;
      point(x, 0, z);
    }
  }

  // Draw horizon
  noStroke();
  fill(180, 30, 80);
  beginShape();
  vertex(-width/2, height/2, -segmentLength*2);
  vertex(width/2, height/2, -segmentLength*2);
  vertex(width/2, height/2, 0);
  vertex(-width/2, height/2, 0);
  endShape(CLOSE);

  // Draw sky
  noStroke();
  fill(180, 50, 90);
  beginShape();
  vertex(-width/2, -height/2, -segmentLength*2);
  vertex(width/2, -height/2, -segmentLength*2);
  vertex(width/2, height/2, -segmentLength*2);
  vertex(-width/2, height/2, -segmentLength*2);
  endShape(CLOSE);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) targetSteer = -1;
  if (keyCode === RIGHT_ARROW) targetSteer = 1;
  if (keyCode === UP_ARROW) speed = min(speed + 0.5, 10);
  if (keyCode === DOWN_ARROW) speed = max(speed - 0.5, 2);
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) targetSteer = 0;
}
