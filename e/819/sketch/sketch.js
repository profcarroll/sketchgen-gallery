let hexagons = [];
const numHexagons = 100;
const hexRadius = 60;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize hexagons with random positions and rotations
  for (let i = 0; i < numHexagons; i++) {
    hexagons.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-200, 200),
      rotation: random(TWO_PI),
      speed: random(0.005, 0.015),
      hue: random(360)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Center camera
  translate(0, 0, -500);
  rotateX(time * 0.2);
  rotateY(time * 0.3);

  // Draw all hexagons
  for (let i = 0; i < hexagons.length; i++) {
    const h = hexagons[i];
    
    push();
    translate(h.x, h.y, h.z);
    rotateZ(h.rotation);
    
    // Update rotation and position
    h.rotation += h.speed;
    h.x += sin(time * 0.5 + i) * 0.2;
    h.y += cos(time * 0.3 + i) * 0.2;
    h.z += sin(time * 0.1 + i) * 0.2;

    // Draw hexagon with sharp edges
    stroke(h.hue, 80, 90);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let j = 0; j < 6; j++) {
      const angle = TWO_PI / 6 * j + time;
      const x = hexRadius * cos(angle);
      const y = hexRadius * sin(angle);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw connecting lines between nearby hexagons
  stroke(200, 50, 80, 0.3);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < hexagons.length; i++) {
    for (let j = i + 1; j < hexagons.length; j++) {
      const dx = hexagons[i].x - hexagons[j].x;
      const dy = hexagons[i].y - hexagons[j].y;
      const dz = hexagons[i].z - hexagons[j].z;
      const distance = sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < 200) {
        vertex(hexagons[i].x, hexagons[i].y, hexagons[i].z);
        vertex(hexagons[j].x, hexagons[j].y, hexagons[j].z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
