let roots = [];
let bedrock = [];
const rootCount = 1000;
const bedrockDensity = 0.3;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Initialize bedrock structure
  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      if (random() < bedrockDensity) {
        bedrock.push({x, y, size: random(15, 30)});
      }
    }
  }

  // Initialize roots
  for (let i = 0; i < rootCount; i++) {
    roots.push({
      x: random(width),
      y: height,
      targetX: random(width),
      targetY: random(height * 0.3),
      age: 0,
      maxAge: random(100, 500),
      size: random(1, 3),
      segments: [],
      growing: true
    });
  }
}

function draw() {
  background(30, 20, 10);
  
  time += 0.01;
  
  // Draw bedrock
  for (let rock of bedrock) {
    fill(80, 70, 60);
    noStroke();
    rect(rock.x, rock.y, rock.size, rock.size);
    
    // Add some texture to bedrock
    stroke(60, 50, 40);
    strokeWeight(1);
    line(rock.x, rock.y, rock.x + rock.size, rock.y + rock.size);
    line(rock.x + rock.size, rock.y, rock.x, rock.y + rock.size);
  }
  
  // Update and draw roots
  for (let root of roots) {
    if (root.growing) {
      root.age++;
      
      // Move toward target
      let dx = root.targetX - root.x;
      let dy = root.targetY - root.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance > 2) {
        root.x += dx * 0.02;
        root.y += dy * 0.02;
      } else {
        // Start branching
        root.growing = false;
        root.segments = [];
        for (let i = 0; i < 10; i++) {
          root.segments.push({
            x: root.x,
            y: root.y,
            age: 0,
            size: random(1, 3)
          });
        }
      }
      
      // Draw main root
      stroke(180, 120, 60);
      strokeWeight(root.size);
      point(root.x, root.y);
    } else {
      // Branching phase
      root.age++;
      for (let segment of root.segments) {
        segment.age++;
        if (segment.age > 50) {
          segment.x += random(-2, 2);
          segment.y += random(-2, 2);
          
          // Draw branch
          stroke(180, 120, 60);
          strokeWeight(segment.size);
          point(segment.x, segment.y);
        }
      }
      
      // Occasionally crack bedrock
      if (random() < 0.001) {
        let crackX = root.x + random(-50, 50);
        let crackY = root.y + random(-50, 50);
        
        for (let rock of bedrock) {
          let dx = crackX - rock.x;
          let dy = crackY - rock.y;
          let distance = sqrt(dx * dx + dy * dy);
          
          if (distance < 30) {
            // Create debris
            fill(100, 90, 80);
            noStroke();
            rect(rock.x, rock.y, random(5, 15), random(5, 15));
          }
        }
      }
    }
    
    // Reset root occasionally
    if (root.age > root.maxAge) {
      root.x = random(width);
      root.y = height;
      root.targetX = random(width);
      root.targetY = random(height * 0.3);
      root.age = 0;
      root.growing = true;
    }
  }
  
  // Add some flickering light effect to simulate geological forces
  if (frameCount % 10 === 0) {
    let lightX = random(width);
    let lightY = random(height * 0.5);
    fill(255, 200, 100, 30);
    noStroke();
    ellipse(lightX, lightY, 100, 100);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
