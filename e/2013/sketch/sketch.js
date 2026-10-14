let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  noLoop();
}

function draw() {
  background(0);
  loadPixels();
  
  const maxIter = 100;
  const scale = zoom * 4 / min(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cx = (x - width/2) * scale + offsetX;
      const cy = (y - height/2) * scale + offsetY;
      
      let zx = 0;
      let zy = 0;
      let iter = 0;
      
      while (iter < maxIter && zx*zx + zy*zy < 4) {
        const temp = zx*zx - zy*zy + cx;
        zy = 2 * zx * zy + cy;
        zx = temp;
        iter++;
      }
      
      const index = (y * width + x) * 4;
      if (iter === maxIter) {
        pixels[index] = 0;     // black
        pixels[index+1] = 0;
        pixels[index+2] = 0;
        pixels[index+3] = 255;
      } else {
        const hue = map(iter, 0, maxIter, 0, 1);
        const sat = 1;
        const bri = 1 - map(iter, 0, maxIter, 0, 1);
        
        const c = color(hue, sat, bri);
        pixels[index] = red(c);
        pixels[index+1] = green(c);
        pixels[index+2] = blue(c);
        pixels[index+3] = 255;
      }
    }
  }
  
  updatePixels();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseDragged() {
  if (isDragging) {
    offsetX -= (mouseX - lastMouseX) * zoom * 4 / min(width, height);
    offsetY -= (mouseY - lastMouseY) * zoom * 4 / min(width, height);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    redraw();
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseClicked() {
  // Zoom in on click
  zoom *= 0.5;
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
