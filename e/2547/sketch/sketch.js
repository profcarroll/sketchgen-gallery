let paperTexture;
let inkLayers = [];
const MAX_LAYERS = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create paper texture
  paperTexture = createGraphics(width, height);
  paperTexture.background(245, 235, 210); // Creamy yellow
  
  // Add paper texture details
  paperTexture.noStroke();
  for (let i = 0; i < 1000; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(0.5, 2);
    const alpha = random(20, 60);
    paperTexture.fill(230, 220, 190, alpha);
    paperTexture.ellipse(x, y, size, size);
  }
  
  // Initialize ink layers
  for (let i = 0; i < MAX_LAYERS; i++) {
    inkLayers.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      opacity: random(30, 80),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      age: 0,
      maxAge: random(200, 500)
    });
  }
  
  frameRate(30);
}

function draw() {
  // Draw the aged paper background
  image(paperTexture, 0, 0);
  
  // Draw ink layers that spread and fade
  noStroke();
  for (let i = 0; i < inkLayers.length; i++) {
    const layer = inkLayers[i];
    
    // Update age
    layer.age++;
    
    // Move layer
    layer.x += layer.speedX;
    layer.y += layer.speedY;
    
    // Fade out as it ages
    const currentOpacity = map(layer.age, 0, layer.maxAge, layer.opacity, 0);
    
    // Draw the ink layer with a subtle gradient to simulate aging
    if (currentOpacity > 0) {
      const r = 20; // Dark blue-black
      const g = 20;
      const b = 30;
      
      drawingContext.globalAlpha = currentOpacity / 255;
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = color(r, g, b, currentOpacity);
      
      ellipse(layer.x, layer.y, layer.size, layer.size);
    }
    
    // Reset layer if it's too old or has moved off-screen
    if (layer.age > layer.maxAge || 
        layer.x < -100 || layer.x > width + 100 ||
        layer.y < -100 || layer.y > height + 100) {
      layer.x = random(width);
      layer.y = random(height);
      layer.size = random(50, 200);
      layer.opacity = random(30, 80);
      layer.speedX = random(-0.5, 0.5);
      layer.speedY = random(-0.5, 0.5);
      layer.age = 0;
    }
  }
  
  // Reset global alpha and shadow
  drawingContext.globalAlpha = 1;
  drawingContext.shadowBlur = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
