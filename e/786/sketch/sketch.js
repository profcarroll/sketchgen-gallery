let cornStalks = [];
let beamRadius = 200;
let shipHeight = 300;
let shipRadius = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Create corn stalks in a grid pattern
  let spacing = 40;
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      // Only create stalks in the area beneath the ship
      let dx = x - width/2;
      let dy = y - (height/2 + shipHeight);
      if (dx*dx + dy*dy < beamRadius * beamRadius) {
        cornStalks.push({
          x: x,
          y: y,
          height: random(80, 150),
          angle: random(TWO_PI)
        });
      }
    }
  }
}

function draw() {
  background(20, 30, 40); // Dark blue night sky

  // Draw the glowing UFO
  fill(200, 255, 255, 100);
  noStroke();
  ellipse(width/2, height/2 + shipHeight, shipRadius * 2, shipRadius);

  // Draw the light beams
  drawLightBeams();

  // Draw corn stalks with glow effect
  drawCornStalks();
}

function drawLightBeams() {
  // Draw two bright cyan beams
  noStroke();
  for (let i = 0; i < 2; i++) {
    let angle = PI + PI/4 + (i * PI/2);
    let x = width/2 + cos(angle) * beamRadius;
    let y = height/2 + shipHeight + sin(angle) * beamRadius;

    // Create a radial gradient effect
    for (let r = 0; r < beamRadius; r += 5) {
      let alpha = map(r, 0, beamRadius, 100, 0);
      fill(0, 255, 255, alpha);
      ellipse(x, y, r * 2);
    }
  }

  // Draw the glowing semicircle on the ground
  stroke(0, 255, 255, 100);
  noFill();
  arc(width/2, height/2 + shipHeight, beamRadius * 2, beamRadius * 2, 0, PI, OPEN);
}

function drawCornStalks() {
  // Draw each stalk with a glow effect
  for (let stalk of cornStalks) {
    let dx = stalk.x - width/2;
    let dy = stalk.y - (height/2 + shipHeight);
    
    // Only draw if within the beam area
    if (dx*dx + dy*dy < beamRadius * beamRadius) {
      // Draw stalk glow
      fill(0, 255, 255, 50);
      noStroke();
      ellipse(stalk.x, stalk.y, 10, stalk.height);

      // Draw stalk body
      stroke(30, 180, 30);
      strokeWeight(2);
      line(stalk.x, stalk.y, stalk.x, stalk.y - stalk.height);
    }
  }
}
