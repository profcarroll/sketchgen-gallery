function setup() { createCanvas(windowWidth, windowHeight); }
function draw() { background(17); ellipse(width / 2, height / 2, 60 + sin(frameCount / 30) * 20); }
