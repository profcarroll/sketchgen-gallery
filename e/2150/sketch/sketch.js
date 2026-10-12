let layers = [];
const layerCount = 20;
const maxStrata = 15;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);
  
  // Create geological layers
  for (let i = 0; i < layerCount; i++) {
    let layer = {
      y: map(i, 0, layerCount - 1, -height/2, height/2),
      thickness: random(50, 150),
      strata: [],
      hue: random(20, 40), // Warm earth tones
      saturation: random(30, 60),
      brightness: random(40, 80)
    };
    
    // Add stratified structure to each layer
    const strataCount = floor(random(3, maxStrata));
    for (let j = 0; j < strataCount; j++) {
      layer.strata.push({
        offset: random(-layer.thickness/2, layer.thickness/2),
        height: random(layer.thickness/10, layer.thickness/4),
        hue: layer.hue + random(-5, 5),
        saturation: layer.saturation + random(-10, 10),
        brightness: layer.brightness + random(-10, 10)
      });
    }
    
    layers.push(layer);
  }
}

function draw() {
  background(0);
  
  // Static view - no animation
  noLoop();
  
  // Draw geological layers
  for (let layer of layers) {
    push();
    translate(0, layer.y, 0);
    
    // Main layer body
    fill(layer.hue, layer.saturation, layer.brightness);
    noStroke();
    box(width * 1.2, layer.thickness, width * 1.2);
    
    // Draw strata within the layer
    for (let stratum of layer.strata) {
      push();
      translate(0, stratum.offset, 0);
      fill(stratum.hue, stratum.saturation, stratum.brightness);
      noStroke();
      box(width * 1.2, stratum.height, width * 1.2);
      pop();
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
