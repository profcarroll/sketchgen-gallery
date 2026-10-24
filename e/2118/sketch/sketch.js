let streams = [];
const maxStreams = 100;
const streamDensity = 0.03;
const colorPalette = [
  [20, 80, 90],   // Deep blue-green
  [30, 70, 80],   // Muted green
  [40, 60, 75],   // Olive
  [50, 50, 70],   // Earthy brown
  [60, 40, 65],   // Rust
  [70, 30, 60],   // Deep red
  [80, 20, 55],   // Dark burgundy
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);

  // Initialize streams
  for (let i = 0; i < maxStreams; i++) {
    if (random() < streamDensity) {
      streams.push(createStream());
    }
  }
}

function draw() {
  background(0, 0, 5, 0.02); // Semi-transparent dark background

  // Update and display streams
  for (let i = streams.length - 1; i >= 0; i--) {
    const s = streams[i];
    s.update();
    s.display();

    // Remove streams that are too old or have ended
    if (s.age > 500 || s.segments.length === 0) {
      streams.splice(i, 1);
    }
  }

  // Add new streams occasionally
  if (frameCount % 10 === 0 && streams.length < maxStreams) {
    if (random() < streamDensity) {
      streams.push(createStream());
    }
  }
}

function createStream() {
  const start = { x: random(width), y: random(height * 0.3) };
  const segments = [{ x: start.x, y: start.y }];
  const colorIndex = floor(random(colorPalette.length));
  const hue = colorPalette[colorIndex][0];
  const saturation = colorPalette[colorIndex][1];
  const brightness = colorPalette[colorIndex][2];

  return {
    segments: segments,
    age: 0,
    hue: hue,
    saturation: saturation,
    brightness: brightness,
    update: function() {
      this.age++;
      
      // Add new segment
      const last = this.segments[this.segments.length - 1];
      const angle = noise(last.x * 0.01, last.y * 0.01, this.age * 0.01) * TWO_PI;
      const speed = random(0.5, 2);
      const dx = cos(angle) * speed;
      const dy = sin(angle) * speed;

      const newX = last.x + dx;
      const newY = last.y + dy;

      // Add some randomness to make it more natural
      this.segments.push({ x: newX, y: newY });

      // Limit number of segments to prevent memory issues
      if (this.segments.length > 100) {
        this.segments.shift();
      }
    },
    display: function() {
      if (this.segments.length < 2) return;

      // Draw the stream as a continuous shape with varying width and opacity
      const points = this.segments.slice(-50); // Use last 50 points for smoother curve

      beginShape();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const alpha = map(i, 0, points.length, 0.1, 0.8);
        const width = map(i, 0, points.length, 0.5, 3);

        // Apply color with slight variation
        const hueVary = (this.hue + random(-2, 2)) % 360;
        fill(hueVary, this.saturation, this.brightness, alpha);
        
        vertex(p.x, p.y);
      }
      endShape();

      // Draw a subtle glow effect along the stream
      noFill();
      stroke(this.hue, this.saturation, this.brightness, 0.3);
      strokeWeight(1);
      beginShape();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        vertex(p.x, p.y);
      }
      endShape();

      // Add some texture by drawing small dots
      if (frameCount % 5 === 0) {
        const dotPoint = points[floor(random(points.length))];
        fill(this.hue, this.saturation, this.brightness, 0.7);
        ellipse(dotPoint.x, dotPoint.y, 1, 1);
      }
    }
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
