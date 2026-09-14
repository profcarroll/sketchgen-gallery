let time = 0;
let hueShift = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 10);
  time += 0.005;
  hueShift = (hueShift + 0.2) % 360;

  let hexSize = 40 + sin(time * 0.5) * 10;
  let spacing = hexSize * 1.75;
  
  for (let x = -spacing; x < width + spacing; x += spacing) {
    for (let y = -spacing; y < height + spacing; y += spacing) {
      let offset = sin(time + x * 0.01 + y * 0.01) * 20;
      let angle = time * 0.5 + offset * 0.1;
      
      push();
      translate(x, y);
      rotate(angle);
      
      // Draw hexagon with shifting color
      let h = (hueShift + (x + y) * 0.1) % 360;
      fill(h, 80, 90, 0.7);
      
      beginShape();
      for (let i = 0; i < 6; i++) {
        let a = angle + i * TWO_PI / 6;
        let px = cos(a) * hexSize;
        let py = sin(a) * hexSize;
        vertex(px, py);
      }
      endShape(CLOSE);
      
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
