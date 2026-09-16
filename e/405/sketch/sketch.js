let dialAngle = 0;
let burners = [];
let flameIntensity = 0;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);

  // Create burners in a circular pattern
  for (let i = 0; i < 4; i++) {
    let angle = (TWO_PI / 4) * i;
    let x = width/2 + cos(angle) * 150;
    let y = height/2 + sin(angle) * 150;
    burners.push({x, y, radius: 30});
  }
}

function draw() {
  background(50);

  // Draw stovetop surface
  fill(80);
  noStroke();
  ellipse(width/2, height/2, 300, 300);

  // Draw burners
  for (let burner of burners) {
    fill(100);
    stroke(0);
    strokeWeight(2);
    ellipse(burner.x, burner.y, burner.radius * 2, burner.radius * 2);
  }

  // Draw control dial
  push();
  translate(width/2, height/2);
  rotate(dialAngle);
  fill(200);
  noStroke();
  ellipse(0, 0, 60, 60);
  stroke(0);
  strokeWeight(3);
  line(0, -25, 0, -10);
  pop();

  // Draw flames
  for (let i = 0; i < burners.length; i++) {
    let burner = burners[i];
    let flameAngle = (TWO_PI / 4) * i + dialAngle;
    let flameX = burner.x + cos(flameAngle) * 35;
    let flameY = burner.y + sin(flameAngle) * 35;

    // Adjust flame intensity based on dial position
    let intensity = map(dialAngle, 0, TWO_PI, 0, 1);
    if (intensity > 0.2) {
      fill(255, 200, 0, 200);
      noStroke();
      ellipse(flameX, flameY, 20 * intensity, 40 * intensity);
      fill(0, 150, 255, 150);
      ellipse(flameX + random(-5, 5), flameY - 10, 10 * intensity, 20 * intensity);
    }
  }

  // Update dial for idle motion
  dialAngle += 0.005;
  if (dialAngle > TWO_PI) {
    dialAngle = 0;
  }
}

function mouseDragged() {
  let dx = mouseX - width/2;
  let dy = mouseY - height/2;
  dialAngle = atan2(dy, dx);
}
