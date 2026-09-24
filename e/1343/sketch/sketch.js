let photo, painting;
let paintingImage;

function preload() {
  photo = loadImage('https://picsum.photos/seed/mountain/800/600');
}

function setup() {
  createCanvas(800, 600);
  painting = createGraphics(400, 600);
  
  // Draw the painting on the right panel
  painting.image(photo, 0, 0, 400, 600);
  painting.filter(BLUR, 2);
  
  // Sample colors from the photo and create brushstrokes
  const samples = [];
  for (let y = 0; y < 600; y += 10) {
    for (let x = 0; x < 400; x += 10) {
      const c = painting.get(x, y);
      samples.push(c);
    }
  }
  
  // Draw brushstrokes
  painting.loadPixels();
  for (let i = 0; i < samples.length; i++) {
    const x = (i % 40) * 10;
    const y = Math.floor(i / 40) * 10;
    const c = samples[i];
    
    // Create textured brushstrokes
    painting.fill(c);
    painting.noStroke();
    painting.ellipse(x + random(-3, 3), y + random(-3, 3), random(2, 8));
  }
  painting.updatePixels();
  
  // Create a second canvas to store the final painting
  paintingImage = createGraphics(400, 600);
  paintingImage.image(painting, 0, 0);
}

function draw() {
  // Left panel: photograph
  image(photo, 0, 0, 400, 600);
  
  // Right panel: painting
  image(paintingImage, 400, 0, 400, 600);
  
  noLoop();
}
