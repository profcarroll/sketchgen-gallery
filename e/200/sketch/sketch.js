let cables = [];
let dataStreams = [];
const cableCount = 150;
const streamCount = 20;
const maxConnections = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create main cables
  for (let i = 0; i < cableCount; i++) {
    cables.push({
      points: [],
      thickness: random(2, 8),
      hue: random(200, 260),
      saturation: random(30, 60)
    });
    
    // Generate cable path
    let segments = floor(random(15, 30));
    let prevPoint = createVector(
      random(-width/2, width/2),
      random(-height/2, height/2),
      random(-200, 200)
    );
    
    cables[i].points.push(prevPoint.copy());
    
    for (let j = 1; j < segments; j++) {
      let nextPoint = prevPoint.copy();
      nextPoint.x += random(-50, 50);
      nextPoint.y += random(-50, 50);
      nextPoint.z += random(-30, 30);
      
      // Keep within bounds
      nextPoint.x = constrain(nextPoint.x, -width/2, width/2);
      nextPoint.y = constrain(nextPoint.y, -height/2, height/2);
      nextPoint.z = constrain(nextPoint.z, -300, 300);
      
      cables[i].points.push(nextPoint.copy());
      prevPoint = nextPoint;
    }
  }
  
  // Create data streams
  for (let i = 0; i < streamCount; i++) {
    let cableIndex = floor(random(cableCount));
    dataStreams.push({
      cableIndex: cableIndex,
      position: 0,
      speed: random(0.001, 0.005),
      size: random(3, 8),
      hue: random(30, 60)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate view slowly
  rotateY(frameCount * 0.002);
  rotateX(sin(frameCount * 0.001) * 0.1);
  
  // Draw cables
  for (let i = 0; i < cables.length; i++) {
    const cable = cables[i];
    
    beginShape();
    noFill();
    stroke(cable.hue, cable.saturation, 20, 0.7);
    strokeWeight(cable.thickness);
    
    for (let j = 0; j < cable.points.length; j++) {
      vertex(cable.points[j].x, cable.points[j].y, cable.points[j].z);
    }
    
    endShape();
  }
  
  // Draw data streams
  for (let i = 0; i < dataStreams.length; i++) {
    const stream = dataStreams[i];
    const cable = cables[stream.cableIndex];
    
    if (cable && cable.points.length > 0) {
      // Update position
      stream.position += stream.speed;
      
      // Reset if stream reaches end
      if (stream.position >= 1) {
        stream.position = 0;
      }
      
      // Get position along cable
      let index = stream.position * (cable.points.length - 1);
      let intIndex = floor(index);
      let frac = index - intIndex;
      
      if (intIndex < cable.points.length - 1) {
        let p1 = cable.points[intIndex];
        let p2 = cable.points[intIndex + 1];
        let pos = p5.Vector.lerp(p1, p2, frac);
        
        // Draw glowing stream
        push();
        translate(pos.x, pos.y, pos.z);
        noStroke();
        fill(stream.hue, 100, 100, 0.9);
        sphere(stream.size);
        pop();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
