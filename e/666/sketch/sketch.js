let streams = [];
const numStreams = 15;
const streamLength = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Initialize streams with random starting positions and colors
  for (let i = 0; i < numStreams; i++) {
    let stream = [];
    let startX = random(width);
    let startY = random(height);
    let hue = random(20, 40); // Blue to cyan hues
    let saturation = random(80, 100);
    let brightness = random(80, 100);

    for (let j = 0; j < streamLength; j++) {
      stream.push({
        x: startX,
        y: startY,
        hue: hue,
        saturation: saturation,
        brightness: brightness,
        size: map(j, 0, streamLength - 1, 2, 8)
      });
      // Update position for next point (with some randomness)
      startX += random(-2, 2);
      startY += random(-2, 2);
    }
    streams.push(stream);
  }
}

function draw() {
  // Dark background
  background(0);

  // Draw each stream
  for (let i = 0; i < streams.length; i++) {
    let stream = streams[i];
    beginShape();
    for (let j = 0; j < stream.length; j++) {
      let point = stream[j];
      
      // Update position slightly each frame to simulate flow
      if (j > 0) {
        let prevPoint = stream[j - 1];
        point.x += random(-0.5, 0.5);
        point.y += random(-0.5, 0.5);
      }

      // Color based on position in the stream
      let alpha = map(j, 0, stream.length - 1, 0.2, 1);
      fill(point.hue, point.saturation, point.brightness, alpha);
      
      vertex(point.x, point.y);
    }
    endShape();
    
    // Move points forward in time (simulate motion)
    for (let j = 0; j < stream.length - 1; j++) {
      stream[j] = stream[j + 1];
    }
    
    // Add new point at the end of the stream
    let lastPoint = stream[stream.length - 1];
    let newX = lastPoint.x + random(-2, 2);
    let newY = lastPoint.y + random(-2, 2);
    stream[stream.length - 1] = {
      x: newX,
      y: newY,
      hue: lastPoint.hue,
      saturation: lastPoint.saturation,
      brightness: lastPoint.brightness,
      size: map(stream.length - 1, 0, streamLength - 1, 2, 8)
    };
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
