function setup() {
  createCanvas(800, 600);
  noLoop();
}

function draw() {
  background(20);

  // Draw main body panel
  fill(40);
  stroke(30);
  strokeWeight(1);
  rectMode(CENTER);
  rect(width/2, height/2, 400, 500);

  // Draw face panel with patina
  fill(35);
  rect(width/2, height/2 - 50, 250, 300);

  // Draw mechanical eye sockets
  noStroke();
  fill(10);
  ellipse(width/2 - 60, height/2 - 100, 40, 40);
  ellipse(width/2 + 60, height/2 - 100, 40, 40);

  // Draw iris details
  fill(200);
  ellipse(width/2 - 60, height/2 - 100, 15, 15);
  ellipse(width/2 + 60, height/2 - 100, 15, 15);

  // Draw mechanical nose
  fill(30);
  triangle(
    width/2, height/2,
    width/2 - 20, height/2 + 40,
    width/2 + 20, height/2 + 40
  );

  // Draw mouth panel
  fill(25);
  rect(width/2, height/2 + 100, 120, 30);

  // Add structural seams and panels
  stroke(20);
  strokeWeight(0.5);
  for (let i = 0; i < 15; i++) {
    line(width/2 - 120, height/2 - 140 + i * 20, width/2 + 120, height/2 - 140 + i * 20);
  }

  // Add panel misalignment details
  fill(35);
  rect(width/2 - 100, height/2 - 160, 20, 10);
  rect(width/2 + 80, height/2 - 160, 20, 10);

  // Add scratches and wear
  stroke(50);
  strokeWeight(1);
  line(width/2 - 100, height/2 - 100, width/2 - 70, height/2 - 80);
  line(width/2 + 60, height/2 - 120, width/2 + 90, height/2 - 100);
  line(width/2 - 40, height/2 + 50, width/2 - 20, height/2 + 70);

  // Add panel joints
  stroke(30);
  strokeWeight(1);
  for (let x = width/2 - 120; x < width/2 + 120; x += 40) {
    line(x, height/2 - 150, x, height/2 + 150);
  }

  // Add mechanical bolts
  noStroke();
  fill(60);
  for (let i = 0; i < 8; i++) {
    ellipse(width/2 - 90 + i * 30, height/2 - 140, 6, 6);
  }
  for (let i = 0; i < 8; i++) {
    ellipse(width/2 - 90 + i * 30, height/2 + 140, 6, 6);
  }

  // Add subtle highlights
  fill(80);
  ellipse(width/2 - 70, height/2 - 110, 5, 5);
  ellipse(width/2 + 70, height/2 - 110, 5, 5);

  // Draw outer shell structure
  stroke(25);
  strokeWeight(2);
  noFill();
  rect(width/2, height/2, 420, 520);
}
