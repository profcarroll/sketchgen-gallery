function setup() {
  createCanvas(800, 600);
  colorMode(RGB);
  noStroke();
  
  // Create aged paper background with subtle texture
  background(245, 235, 200);
  drawPaperTexture();
  
  // Draw geological strata layers with sepia tones and black ink
  const layers = [];
  const totalLayers = 25;
  const layerHeight = height / totalLayers;
  
  for (let i = 0; i < totalLayers; i++) {
    layers.push({
      y: i * layerHeight,
      h: layerHeight,
      color: getColorForLayer(i, totalLayers),
      pattern: getPatternForLayer(i)
    });
  }
  
  // Store layers globally for drawing
  geologicalLayers = layers;
  
  // Draw each stratum layer
  for (let layer of geologicalLayers) {
    fill(layer.color);
    rect(0, layer.y, width, layer.h);
    
    // Draw pattern if it exists
    if (layer.pattern === 'stripes') {
      drawStripes(layer.y, layer.h);
    } else if (layer.pattern === 'dots') {
      drawDots(layer.y, layer.h);
    } else if (layer.pattern === 'waves') {
      drawWaves(layer.y, layer.h);
    }
  }
  
  // Add title and scale indicator
  fill(30, 30, 30);
  textSize(14);
  textAlign(CENTER);
  text("Geological Cross-Section", width/2, 20);
  textSize(10);
  text("Scale: 1:50,000", width/2, height - 10);
  
  // Add subtle handwritten script annotations
  drawHandwrittenNotes();
  
  noLoop(); // Static image
}

function drawPaperTexture() {
  // Add subtle paper texture
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    if (Math.random() > 0.95) {
      const noiseVal = noise(i * 0.01) * 20;
      pixels[i] = 245 - noiseVal;     // R
      pixels[i+1] = 235 - noiseVal;   // G
      pixels[i+2] = 200 - noiseVal;   // B
    }
  }
  updatePixels();
}

function getColorForLayer(i, total) {
  // Sepia-toned mineral compositions for aged appearance
  const mineralColors = [
    [139, 69, 19],   // Brown (sedimentary)
    [128, 128, 128], // Gray (metamorphic)
    [255, 0, 0],     // Red (oxidized)
    [0, 0, 255],     // Blue (carbonate)
    [255, 255, 0],   // Yellow (sulfide)
    [139, 0, 0],     // Dark red (igneous)
    [0, 128, 0],     // Green (serpentine)
    [255, 140, 0],   // Orange (magnetite)
    [75, 0, 130],    // Indigo (garnet)
    [255, 20, 147]   // Pink (feldspar)
  ];
  
  const colorIndex = i % mineralColors.length;
  return color(mineralColors[colorIndex][0], 
               mineralColors[colorIndex][1], 
               mineralColors[colorIndex][2]);
}

function getPatternForLayer(i) {
  // Vary patterns for visual interest
  if (i % 7 === 0) return 'stripes';
  if (i % 5 === 0) return 'dots';
  if (i % 3 === 0) return 'waves';
  return null;
}

function drawStripes(y, h) {
  stroke(30);
  strokeWeight(1);
  const stripeHeight = h / 4;
  for (let i = 0; i < 4; i++) {
    line(0, y + i * stripeHeight, width, y + i * stripeHeight);
  }
}

function drawDots(y, h) {
  stroke(30);
  strokeWeight(1);
  const dotSpacing = 15;
  for (let x = 0; x < width; x += dotSpacing) {
    for (let dy = 0; dy < h; dy += dotSpacing * 2) {
      point(x, y + dy);
    }
  }
}

function drawWaves(y, h) {
  stroke(30);
  strokeWeight(1);
  const waveHeight = h / 4;
  for (let x = 0; x < width; x += 10) {
    const waveY = y + waveHeight + sin(x * 0.1) * (waveHeight / 2);
    point(x, waveY);
  }
}

function drawHandwrittenNotes() {
  // Add handwritten script annotations
  fill(30);
  textSize(8);
  textAlign(LEFT);
  
  const notes = [
    "Sedimentary deposits",
    "Metamorphic layers",
    "Oxidized minerals",
    "Carbonate formations",
    "Sulfide veins",
    "Igneous intrusions",
    "Serpentine zones",
    "Magnetite beds"
  ];
  
  for (let i = 0; i < notes.length; i++) {
    const x = random(50, width - 100);
    const y = random(50, height - 50);
    text(notes[i], x, y);
  }
}
