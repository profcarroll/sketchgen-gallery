let mandelbrotCanvas;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let maxIterations = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mandelbrotCanvas = createGraphics(width, height);
  drawMandelbrot();
}

function draw() {
  image(mandelbrotCanvas, 0, 0);
}

function drawMandelbrot() {
  mandelbrotCanvas.loadPixels();
  const scale = 4 / zoom;
  const aspect = height / width;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cx = (x - width/2) * scale / width + offsetX;
      const cy = (y - height/2) * scale / width * aspect + offsetY;
      
      let zx = 0;
      let zy = 0;
      let iter = 0;
      
      while (iter < maxIterations) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;
        
        if (zx2 + zy2 > 4) break;
        
        const newZx = zx2 - zy2 + cx;
        const newZy = 2 * zx * zy + cy;
        
        zx = newZx;
        zy = newZy;
        iter++;
      }
      
      const index = (x + y * width) * 4;
      if (iter === maxIterations) {
        mandelbrotCanvas.pixels[index] = 0;     // R
        mandelbrotCanvas.pixels[index+1] = 0;   // G
        mandelbrotCanvas.pixels[index+2] = 0;   // B
      } else {
        const hue = map(iter, 0, maxIterations, 0, 360);
        const colorVal = color(hue, 100, 100);
        mandelbrotCanvas.pixels[index] = red(colorVal);     // R
        mandelbrotCanvas.pixels[index+1] = green(colorVal);   // G
        mandelbrotCanvas.pixels[index+2] = blue(colorVal);   // B
      }
      mandelbrotCanvas.pixels[index+3] = 255; // A
    }
  }
  mandelbrotCanvas.updatePixels();
}

function mousePressed() {
  const mouseXNorm = (mouseX - width/2) / width;
  const mouseYNorm = (mouseY - height/2) / height;
  
  offsetX += mouseXNorm * 4 / zoom;
  offsetY += mouseYNorm * 4 / zoom;
  zoom *= 2;
  
  drawMandelbrot();
}

function mouseDragged() {
  const dx = (pmouseX - mouseX) / width;
  const dy = (pmouseY - mouseY) / height;
  
  offsetX -= dx * 4 / zoom;
  offsetY -= dy * 4 / zoom;
  
  drawMandelbrot();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawMandelbrot();
}
