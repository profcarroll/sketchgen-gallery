let cornStalks = [];
let husks = [];
let ufo;
let beam1, beam2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create corn field
  for (let i = 0; i < 500; i++) {
    cornStalks.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      h: random(30, 60),
      w: random(2, 5)
    });
  }
  
  // Create husks
  for (let i = 0; i < 1000; i++) {
    husks.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      size: random(2, 8),
      angle: random(TWO_PI)
    });
  }
  
  // UFO
  ufo = {
    x: width / 2,
    y: height * 0.2,
    r: 30,
    glow: 0
  };
  
  // Beams
  beam1 = {
    x: ufo.x - 15,
    y: ufo.y + ufo.r,
    length: 200,
    intensity: 0.8
  };
  
  beam2 = {
    x: ufo.x + 15,
    y: ufo.y + ufo.r,
    length: 200,
    intensity: 0.8
  };
}

function draw() {
  background(220, 20, 10); // Sky
  
  // Draw ground
  fill(30, 40, 20);
  noStroke();
  rect(0, height * 0.8, width, height * 0.2);
  
  // Draw corn stalks
  stroke(60, 50, 40);
  for (let stalk of cornStalks) {
    line(stalk.x, stalk.y, stalk.x, stalk.y - stalk.h);
  }
  
  // Draw husks
  fill(30, 20, 30);
  noStroke();
  for (let husk of husks) {
    push();
    translate(husk.x, husk.y);
    rotate(husk.angle);
    rect(-husk.size/2, -husk.size/2, husk.size, husk.size);
    pop();
  }
  
  // Draw beams
  noStroke();
  fill(0, 100, 100, 0.3);
  rect(beam1.x, beam1.y, 5, beam1.length);
  rect(beam2.x, beam2.y, 5, beam2.length);
  
  // Draw UFO
  ufo.glow = (sin(frameCount * 0.02) + 1) * 0.2 + 0.3;
  
  fill(200, 100, 100, ufo.glow);
  noStroke();
  ellipse(ufo.x, ufo.y, ufo.r * 2, ufo.r * 2);
  
  // Add a subtle inner glow
  fill(200, 100, 100, ufo.glow * 0.5);
  ellipse(ufo.x, ufo.y, ufo.r * 1.5, ufo.r * 1.5);
  
  // Add a subtle light reflection
  fill(240, 100, 100, 0.2);
  ellipse(ufo.x - ufo.r/3, ufo.y - ufo.r/3, ufo.r/2, ufo.r/2);
}
