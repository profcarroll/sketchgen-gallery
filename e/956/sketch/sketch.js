let streams = [];
let crystals = [];
let sparks = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create data streams
  for (let i = 0; i < 8; i++) {
    streams.push({
      points: [],
      hue: (i * 45) % 360,
      speed: random(0.002, 0.005),
      amplitude: random(100, 200),
      frequency: random(0.01, 0.03)
    });
  }

  // Create crystalline formations
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(10, 40),
      hue: random(200, 300)
    });
  }

  // Initialize sparks
  for (let i = 0; i < 500; i++) {
    sparks.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(1, 3),
      hue: random(60, 120),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Set camera
  let camX = sin(time * 0.2) * 500;
  let camY = cos(time * 0.1) * 300;
  let camZ = sin(time * 0.15) * 400;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw crystalline formations
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    fill(crystal.hue, 80, 90, 0.7);
    noStroke();
    sphere(crystal.size, 6, 4);
    pop();
  }

  // Draw data streams
  for (let stream of streams) {
    let points = [];
    for (let i = 0; i < 100; i++) {
      let t = i * 0.1 + time * stream.speed;
      let x = sin(t * 2) * stream.amplitude;
      let y = cos(t * 3) * stream.amplitude;
      let z = sin(t) * stream.amplitude * 0.5;
      
      // Add helical motion
      let helixX = cos(t) * 100;
      let helixY = sin(t) * 100;
      let helixZ = t * 20;

      points.push({
        x: x + helixX,
        y: y + helixY,
        z: z + helixZ
      });
    }

    // Draw the ribbon
    stroke(stream.hue, 100, 100, 0.8);
    noFill();
    beginShape();
    for (let point of points) {
      vertex(point.x, point.y, point.z);
    }
    endShape();

    // Add glowing edges
    stroke(stream.hue, 100, 100, 0.3);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < points.length; i += 5) {
      vertex(points[i].x, points[i].y, points[i].z);
    }
    endShape();

    // Add sparks
    if (frameCount % 3 === 0) {
      let sparkIndex = floor(random(sparks.length));
      let spark = sparks[sparkIndex];
      spark.x = points[floor(random(points.length))].x;
      spark.y = points[floor(random(points.length))].y;
      spark.z = points[floor(random(points.length))].z;
      spark.life = random(100, 300);
    }
  }

  // Update and draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let spark = sparks[i];
    if (spark.life > 0) {
      spark.life -= 2;
      push();
      translate(spark.x, spark.y, spark.z);
      noStroke();
      fill(spark.hue, 100, 100, spark.life / 300);
      sphere(spark.size, 3, 2);
      pop();
    } else {
      // Reset spark
      spark.x = random(-width/2, width/2);
      spark.y = random(-height/2, height/2);
      spark.z = random(-300, 300);
      spark.life = random(100, 300);
    }
  }

  // Add subtle background glow
  noStroke();
  fill(0, 0, 10, 0.05);
  sphere(width * 2, 16, 16);
}
