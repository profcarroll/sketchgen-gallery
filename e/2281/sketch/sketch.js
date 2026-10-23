let stripes = [];
const numStripes = 30;
const colorPalette = [
  [255, 51, 51],    // Crimson
  [255, 153, 0],    // Orange
  [255, 255, 51],   // Yellow
  [51, 204, 51],    // Green
  [51, 153, 255],   // Blue
  [153, 51, 204]    // Purple
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.01),
      width: random(30, 150),
      color: random(colorPalette),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 15);
  
  for (let i = 0; i < stripes.length; i++) {
    const s = stripes[i];
    
    const time = frameCount * s.speed;
    const offset = sin(time + s.offset) * 30;
    
    drawingContext.globalCompositeOperation = 'screen';
    
    const gradient = drawingContext.createLinearGradient(
      0, 0, width, height
    );
    
    const color1 = s.color;
    const color2 = [
      color1[0] * 0.6,
      color1[1] * 0.6,
      color1[2] * 0.6
    ];
    
    gradient.addColorStop(0, `rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.7)`);
    gradient.addColorStop(0.5, `rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 0.3)`);
    gradient.addColorStop(1, `rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.7)`);
    
    drawingContext.fillStyle = gradient;
    
    push();
    translate(width / 2, height / 2);
    rotate(s.angle + sin(time * 0.5) * 0.1);
    rect(-width / 2, -s.width / 2 + offset, width, s.width);
    pop();
  }
  
  drawingContext.globalCompositeOperation = 'source-over';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
