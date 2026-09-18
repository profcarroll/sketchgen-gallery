let planes = [];
let shadowLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create geometric planes with varying orientations and depths
  for (let i = 0; i < 8; i++) {
    const depth = map(i, 0, 7, -300, 300);
    const size = 200 + i * 20;
    const angle = map(i, 0, 7, 0, TWO_PI);
    planes.push({
      x: sin(angle) * 100,
      y: cos(angle) * 100,
      z: depth,
      size: size,
      rotX: angle,
      rotY: angle * 0.5,
      hue: (i * 45) % 360
    });
  }

  // Generate shadow lines for each plane
  generateShadowLines();
}

function draw() {
  background(0);
  noStroke();

  // Light source from top-left
  const lightX = -width / 3;
  const lightY = -height / 3;

  // Draw planes with dynamic lighting
  for (let i = 0; i < planes.length; i++) {
    push();
    translate(planes[i].x, planes[i].y, planes[i].z);
    rotateX(planes[i].rotX);
    rotateY(planes[i].rotY);

    // Draw the main plane
    fill(planes[i].hue, 80, 90, 0.9);
    rectMode(CENTER);
    rect(0, 0, planes[i].size, planes[i].size);

    // Add highlight and shadow effects
    const highlight = color(planes[i].hue, 100, 100, 0.5);
    const shadow = color(planes[i].hue, 80, 20, 0.7);
    
    fill(highlight);
    rect(0, -planes[i].size/4, planes[i].size * 0.6, planes[i].size * 0.2);

    fill(shadow);
    rect(0, planes[i].size/4, planes[i].size * 0.7, planes[i].size * 0.15);

    pop();
  }

  // Draw shadow lines
  stroke(0, 0, 0, 0.3);
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < shadowLines.length; i++) {
    const line = shadowLines[i];
    vertex(line.start.x, line.start.y, line.start.z);
    vertex(line.end.x, line.end.y, line.end.z);
  }
  endShape();
}

function generateShadowLines() {
  // Precompute shadow lines for each plane
  for (let i = 0; i < planes.length; i++) {
    const plane = planes[i];
    const size = plane.size;

    // Generate edges of the rectangle
    const corners = [
      createVector(-size/2, -size/2, 0),
      createVector(size/2, -size/2, 0),
      createVector(size/2, size/2, 0),
      createVector(-size/2, size/2, 0)
    ];

    // Connect corners to form edges
    for (let j = 0; j < corners.length; j++) {
      const start = corners[j];
      const end = corners[(j + 1) % corners.length];

      shadowLines.push({
        start: createVector(
          start.x + plane.x,
          start.y + plane.y,
          start.z + plane.z
        ),
        end: createVector(
          end.x + plane.x,
          end.y + plane.y,
          end.z + plane.z
        )
      });
    }

    // Add diagonal lines for more complexity
    shadowLines.push({
      start: createVector(
        corners[0].x + plane.x,
        corners[0].y + plane.y,
        corners[0].z + plane.z
      ),
      end: createVector(
        corners[2].x + plane.x,
        corners[2].y + plane.y,
        corners[2].z + plane.z
      )
    });

    shadowLines.push({
      start: createVector(
        corners[1].x + plane.x,
        corners[1].y + plane.y,
        corners[1].z + plane.z
      ),
      end: createVector(
        corners[3].x + plane.x,
        corners[3].y + plane.y,
        corners[3].z + plane.z
      )
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
