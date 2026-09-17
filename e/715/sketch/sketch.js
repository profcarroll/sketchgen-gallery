let cornStalks = [];
let ufo;
let beams = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create corn stalks
  for (let i = 0; i < 1000; i++) {
    cornStalks.push({
      x: random(width),
      y: random(height * 0.3, height),
      h: random(20, 60),
      angle: random(TWO_PI)
    });
  }
  
  ufo = {
    x: width / 2,
    y: height * 0.25,
    r: 40
  };
  
  // Initialize beams
  for (let i = 0; i < 2; i++) {
    beams.push({
      id: i,
      baseY: ufo.y + ufo.r,
      length: 300,
      width: 10,
      phase: i * PI,
      speed: 0.02
    });
  }
}

function draw() {
  background(30, 80, 20);
  
  // Draw corn field
  for (let stalk of cornStalks) {
    stroke(40, 120, 30);
    strokeWeight(2);
    line(stalk.x, stalk.y, stalk.x, stalk.y - stalk.h);
  }
  
  // Update and draw beams
  for (let beam of beams) {
    beam.phase += beam.speed;
    
    // Calculate dynamic width
    let w = map(sin(beam.phase), -1, 1, 5, 30);
    
    // Draw beam
    noStroke();
    fill(0, 255, 255, 100);
    beginShape();
    vertex(beam.baseY + beam.length, ufo.x - w/2);
    vertex(beam.baseY + beam.length, ufo.x + w/2);
    vertex(ufo.x + w/2, ufo.y + ufo.r);
    vertex(ufo.x - w/2, ufo.y + ufo.r);
    endShape(CLOSE);
    
    // Draw light effect on corn
    for (let stalk of cornStalks) {
      let d = dist(stalk.x, stalk.y, ufo.x, ufo.y + ufo.r);
      if (d < 100 && d > 20) {
        let intensity = map(d, 20, 100, 1, 0.2);
        fill(0, 255, 255, 30 * intensity);
        noStroke();
        ellipse(stalk.x, stalk.y, 10 * intensity, 10 * intensity);
      }
    }
  }
  
  // Draw UFO
  fill(60, 60, 80);
  stroke(120, 120, 180);
  strokeWeight(2);
  ellipse(ufo.x, ufo.y, ufo.r * 2, ufo.r * 0.8);
  
  // Draw UFO top
  fill(100, 100, 150);
  noStroke();
  ellipse(ufo.x, ufo.y - ufo.r/2, ufo.r * 0.7, ufo.r * 0.3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
