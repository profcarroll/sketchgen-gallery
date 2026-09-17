let hexPoints;
let particles = [];
let stationaryPockets = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Precompute hexagon vertices
  const radius = min(width, height) * 0.4;
  hexPoints = [];
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    hexPoints.push(createVector(
      width/2 + radius * cos(angle),
      height/2 + radius * sin(angle)
    ));
  }

  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(1, 3),
      color: color(random(100, 255), random(100, 255), random(100, 255), 150)
    });
  }

  // Initialize stationary pockets
  for (let i = 0; i < 5; i++) {
    stationaryPockets.push({
      center: createVector(random(width), random(height)),
      radius: 0,
      maxRadius: random(30, 80),
      color: color(random(200, 255), random(100, 200), random(100, 200), 200)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Draw hexagon boundary
  stroke(255);
  noFill();
  beginShape();
  for (let p of hexPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  // Update and draw particles
  for (let p of particles) {
    // Apply velocity
    p.pos.add(p.vel);

    // Boundary check - bounce off hexagon
    if (!isInsideHex(p.pos)) {
      // Simple reflection
      let closest = getClosestEdge(p.pos);
      let normal = createVector(-closest.y, closest.x).normalize();
      p.vel.reflect(normal);
      p.pos.add(p.vel);
    }

    // Draw particle with organic motion
    fill(p.color);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size + sin(time + p.pos.x * 0.01) * 0.5);
  }

  // Update and draw stationary pockets
  for (let pocket of stationaryPockets) {
    if (pocket.radius < pocket.maxRadius) {
      pocket.radius += 0.2;
    }

    fill(pocket.color);
    noStroke();
    ellipse(pocket.center.x, pocket.center.y, pocket.radius * 2);

    // Draw a subtle glow effect
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(red(pocket.color), green(pocket.color), blue(pocket.color));
    ellipse(pocket.center.x, pocket.center.y, pocket.radius * 2);
    drawingContext.shadowBlur = 0;
  }

  // Draw connecting lines between nearby particles
  beginShape(LINES);
  stroke(255, 50);
  noFill();
  
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
      if (d < 80) {
        vertex(p1.pos.x, p1.pos.y);
        vertex(p2.pos.x, p2.pos.y);
      }
    }
  }
  
  endShape();
}

function isInsideHex(point) {
  // Simple point-in-polygon check using ray casting
  let inside = false;
  for (let i = 0, j = hexPoints.length - 1; i < hexPoints.length; j = i++) {
    if (((hexPoints[i].y > point.y) !== (hexPoints[j].y > point.y)) &&
        (point.x < (hexPoints[j].x - hexPoints[i].x) * (point.y - hexPoints[i].y) / (hexPoints[j].y - hexPoints[i].y) + hexPoints[i].x)) {
      inside = !inside;
    }
  }
  return inside;
}

function getClosestEdge(point) {
  // Return the closest edge normal vector
  let minDist = Infinity;
  let closestEdge = null;
  
  for (let i = 0; i < hexPoints.length; i++) {
    const a = hexPoints[i];
    const b = hexPoints[(i + 1) % hexPoints.length];
    
    // Vector from a to b
    const ab = p5.Vector.sub(b, a);
    // Vector from a to point
    const ap = p5.Vector.sub(point, a);
    
    // Project ap onto ab
    const t = ap.dot(ab) / ab.magSq();
    
    let closest;
    if (t < 0) {
      closest = a;
    } else if (t > 1) {
      closest = b;
    } else {
      closest = p5.Vector.add(a, ab.copy().mult(t));
    }
    
    const dist = point.dist(closest);
    if (dist < minDist) {
      minDist = dist;
      closestEdge = closest;
    }
  }
  
  return p5.Vector.sub(point, closestEdge).normalize();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
