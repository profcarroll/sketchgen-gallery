let robots = [];
let sheepClusters = [];
let cursorX, cursorY;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Create robotic figures
  for (let i = 0; i < 8; i++) {
    robots.push({
      x: random(width),
      y: random(height),
      size: random(20, 50),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      hue: random(30, 90)
    });
  }

  // Create sheep clusters
  for (let i = 0; i < 6; i++) {
    sheepClusters.push({
      x: random(width),
      y: random(height),
      size: random(40, 120),
      speed: random(0.1, 0.3),
      hue: random(200, 280)
    });
  }
}

function draw() {
  background(0);

  // Update cursor position
  cursorX = mouseX;
  cursorY = mouseY;

  // Draw and update robots
  for (let robot of robots) {
    robot.x += cos(robot.angle) * robot.speed;
    robot.y += sin(robot.angle) * robot.speed;

    // Bounce off edges
    if (robot.x < 0 || robot.x > width) robot.angle = PI - robot.angle;
    if (robot.y < 0 || robot.y > height) robot.angle = -robot.angle;

    // React to cursor
    let d = dist(robot.x, robot.y, cursorX, cursorY);
    if (d < 150) {
      robot.angle += (mouseX - pmouseX) * 0.01;
      robot.size = map(d, 0, 150, 60, 20);
    } else {
      robot.size = lerp(robot.size, random(20, 50), 0.05);
    }

    // Draw robot body
    push();
    translate(robot.x, robot.y);
    rotate(robot.angle);

    fill(robot.hue, 80, 90);
    rectMode(CENTER);
    rect(0, 0, robot.size * 0.6, robot.size * 0.2);

    // Robot head
    fill(robot.hue, 100, 80);
    ellipse(0, -robot.size * 0.3, robot.size * 0.4, robot.size * 0.4);

    // Eyes
    fill(0, 0, 0);
    ellipse(-robot.size * 0.15, -robot.size * 0.35, robot.size * 0.1, robot.size * 0.1);
    ellipse(robot.size * 0.15, -robot.size * 0.35, robot.size * 0.1, robot.size * 0.1);

    // Legs
    fill(robot.hue, 80, 70);
    rect(-robot.size * 0.2, robot.size * 0.2, robot.size * 0.1, robot.size * 0.3);
    rect(robot.size * 0.2, robot.size * 0.2, robot.size * 0.1, robot.size * 0.3);

    pop();
  }

  // Draw and update sheep clusters
  for (let cluster of sheepClusters) {
    cluster.x += cos(cluster.angle) * cluster.speed;
    cluster.y += sin(cluster.angle) * cluster.speed;

    if (cluster.x < 0 || cluster.x > width) cluster.angle = PI - cluster.angle;
    if (cluster.y < 0 || cluster.y > height) cluster.angle = -cluster.angle;

    // React to cursor
    let d = dist(cluster.x, cluster.y, cursorX, cursorY);
    if (d < 200) {
      cluster.size = map(d, 0, 200, 150, 40);
      cluster.hue += 0.5;
    } else {
      cluster.size = lerp(cluster.size, random(40, 120), 0.05);
    }

    // Draw cluster of glowing orbs
    fill(cluster.hue, 100, 100);
    noStroke();
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let radius = cluster.size * 0.5;
      let x = cluster.x + cos(angle) * radius;
      let y = cluster.y + sin(angle) * radius;
      ellipse(x, y, cluster.size * 0.3, cluster.size * 0.3);
    }

    // Pulsing effect
    fill(cluster.hue, 100, 100, 0.5);
    ellipse(cluster.x, cluster.y, cluster.size, cluster.size);
  }
}
