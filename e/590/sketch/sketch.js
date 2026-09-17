let fields = [];
let mountains = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Generate rolling green fields with subtle color variations
  for (let i = 0; i < 200; i++) {
    fields.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      w: random(50, 300),
      h: random(10, 50),
      color: color(30 + random(40), 100 + random(60), 40 + random(50))
    });
  }
  
  // Generate distant mountains
  for (let i = 0; i < 15; i++) {
    mountains.push({
      x: i * (width / 15),
      h: height * 0.3 + random(height * 0.1),
      color: color(80 + random(40), 90 + random(40), 100 + random(40))
    });
  }
  
  // Generate fluffy clouds
  for (let i = 0; i < 20; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.1, height * 0.3),
      size: random(40, 80)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(100, 180, 255), color(200, 230, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Distant mountains
  noStroke();
  for (let m of mountains) {
    fill(m.color);
    beginShape();
    vertex(m.x - 50, height);
    vertex(m.x + 50, height);
    vertex(m.x, m.h);
    endShape(CLOSE);
  }
  
  // Clouds
  noStroke();
  for (let c of clouds) {
    fill(255, 255, 255, 180);
    ellipse(c.x, c.y, c.size, c.size * 0.6);
    ellipse(c.x + c.size * 0.3, c.y - c.size * 0.2, c.size * 0.7, c.size * 0.4);
    ellipse(c.x - c.size * 0.3, c.y - c.size * 0.1, c.size * 0.6, c.size * 0.5);
  }
  
  // Rolling fields
  for (let f of fields) {
    fill(f.color);
    noStroke();
    ellipse(f.x, f.y, f.w, f.h);
  }
  
  // Foreground grass detail - subtle texture
  stroke(20, 80, 30);
  strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    line(x, y, x, y - random(5, 15));
  }
  
  noLoop();
}
