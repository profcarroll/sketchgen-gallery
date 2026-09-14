let lavaStreams = [];
let solidifiedRocks = [];
let fallingChunks = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lava streams
  for (let i = 0; i < 20; i++) {
    lavaStreams.push({
      x: random(width),
      y: random(height / 2),
      width: random(5, 20),
      speed: random(1, 3),
      hue: random(10, 30), // Orange to red
      saturation: random(80, 100),
      brightness: random(70, 100),
      angle: random(TWO_PI)
    });
  }
  
  // Initialize solidified rocks
  for (let i = 0; i < 30; i++) {
    solidifiedRocks.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      hue: random(20, 40), // Dark gray to brown
      saturation: random(10, 30),
      brightness: random(20, 50),
      angle: random(TWO_PI)
    });
  }
  
  // Initialize falling chunks
  for (let i = 0; i < 50; i++) {
    fallingChunks.push({
      x: random(width),
      y: random(-100, -10),
      size: random(3, 10),
      speed: random(2, 6),
      hue: random(10, 30), // Orange to red
      saturation: random(80, 100),
      brightness: random(70, 100),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0); // Black background
  
  // Draw lava streams
  for (let stream of lavaStreams) {
    fill(stream.hue, stream.saturation, stream.brightness);
    noStroke();
    
    // Animate stream
    stream.x += sin(stream.angle) * stream.speed;
    stream.y += cos(stream.angle) * stream.speed;
    
    // Draw stream as a blob
    ellipse(stream.x, stream.y, stream.width, stream.width);
    
    // Occasionally change direction
    if (random() < 0.02) {
      stream.angle += random(-0.5, 0.5);
    }
    
    // Reset if out of bounds
    if (stream.y > height + 100 || stream.x < -100 || stream.x > width + 100) {
      stream.x = random(width);
      stream.y = random(-100, -10);
      stream.angle = random(TWO_PI);
    }
  }
  
  // Draw solidified rocks
  for (let rock of solidifiedRocks) {
    fill(rock.hue, rock.saturation, rock.brightness);
    noStroke();
    
    // Animate rock slightly
    rock.x += sin(rock.angle) * 0.1;
    rock.y += cos(rock.angle) * 0.1;
    
    // Draw irregular shape
    push();
    translate(rock.x, rock.y);
    rotate(rock.angle);
    ellipse(0, 0, rock.size, rock.size * 0.6);
    pop();
    
    // Occasionally change direction
    if (random() < 0.01) {
      rock.angle += random(-0.2, 0.2);
    }
  }
  
  // Draw falling chunks
  for (let chunk of fallingChunks) {
    fill(chunk.hue, chunk.saturation, chunk.brightness);
    noStroke();
    
    // Animate chunk falling
    chunk.y += chunk.speed;
    
    // Draw chunk as a glowing blob
    ellipse(chunk.x, chunk.y, chunk.size, chunk.size);
    
    // Reset if out of bounds
    if (chunk.y > height + 50) {
      chunk.x = random(width);
      chunk.y = random(-100, -10);
      chunk.speed = random(2, 6);
    }
  }
  
  // Occasionally add new falling chunks for continuous effect
  if (random() < 0.1) {
    fallingChunks.push({
      x: random(width),
      y: random(-100, -10),
      size: random(3, 10),
      speed: random(2, 6),
      hue: random(10, 30), // Orange to red
      saturation: random(80, 100),
      brightness: random(70, 100),
      angle: random(TWO_PI)
    });
    
    // Keep array size manageable
    if (fallingChunks.length > 100) {
      fallingChunks.shift();
    }
  }
}
