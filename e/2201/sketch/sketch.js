function setup() {
  createCanvas(800, 600);
  colorMode(RGB);
  noStroke();
  
  // Create geological strata layers
  const layers = [];
  const totalLayers = 25;
  const layerHeight = height / totalLayers;
  
  for (let i = 0; i < totalLayers; i++) {
    layers.push({
      y: i * layerHeight,
      height: layerHeight,
      color: getColorForLayer(i, totalLayers),
      pattern: getPatternForLayer(i)
    });
  }
  
  // Store layers globally for drawing
  geologicalLayers = layers;
}

function draw() {
  background(240);
  
  // Draw each stratum layer
  for (let layer of geologicalLayers) {
    fill(layer.color);
    rect(0, layer.y, width, layer.height);
    
    // Draw pattern if it exists
    if (layer.pattern === 'stripes') {
      drawStripes(layer.y, layer.height);
    } else if (layer.pattern === 'dots') {
      drawDots(layer.y, layer.height);
    } else if (layer.pattern === 'waves') {
      drawWaves(layer.y, layer.height);
    }
  }
  
  // Draw sharp black lines between layers
  stroke(0);
  noFill();
  for (let i = 1; i < geologicalLayers.length; i++) {
    const y = i * (height / geologicalLayers.length);
    line(0, y, width, y);
  }
  
  // Add title and scale indicator
  fill(0);
  textSize(14);
  textAlign(CENTER);
  text("Geological Cross-Section", width/2, 20);
  textSize(10);
  text("Scale: 1:50,000", width/2, height - 10);
  
  noLoop(); // Static image
}

function getColorForLayer(i, total) {
  // Different mineral compositions represented by distinct colors
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

function drawStripes(y, height) {
  stroke(0);
  strokeWeight(1);
  const stripeHeight = height / 4;
  for (let i = 0; i < 4; i++) {
    line(0, y + i * stripeHeight, width, y + i * stripeHeight);
  }
}

function drawDots(y, height) {
  stroke(0);
  strokeWeight(1);
  const dotSpacing = 15;
  for (let x = 0; x < width; x += dotSpacing) {
    for (let dy = 0; dy < height; dy += dotSpacing * 2) {
      point(x, y + dy);
    }
  }
}

function drawWaves(y, height) {
  stroke(0);
  strokeWeight(1);
  const waveHeight = height / 4;
  for (let x = 0; x < width; x += 10) {
    const waveY = y + waveHeight + sin(x * 0.1) * (waveHeight / 2);
    point(x, waveY);
  }
}
