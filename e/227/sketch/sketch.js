let nodes = [];
let connections = [];
const nodeCount = 100;
const connectionCount = 300;
const time = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(10, 30),
      hue: random(360)
    });
  }

  for (let i = 0; i < connectionCount; i++) {
    const a = floor(random(nodeCount));
    let b;
    do {
      b = floor(random(nodeCount));
    } while (b === a);
    connections.push({ a, b });
  }
}

function draw() {
  background(0, 0, 10);

  const t = millis() * 0.001;

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > width) n.vx *= -1;
    if (n.y < 0 || n.y > height) n.vy *= -1;

    n.hue = (n.hue + 0.2) % 360;
  }

  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = nodes[c.a];
    const b = nodes[c.b];

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = sqrt(dx * dx + dy * dy);

    const maxDist = 150;
    if (dist < maxDist) {
      const alpha = map(dist, 0, maxDist, 1, 0);
      const hue = (a.hue + b.hue) / 2;

      stroke(hue, 80, 90, alpha * 0.5);
      line(a.x, a.y, b.x, b.y);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    fill(n.hue, 80, 90);
    noStroke();
    ellipse(n.x, n.y, n.size + sin(t * 2 + i) * 5);
  }
}
