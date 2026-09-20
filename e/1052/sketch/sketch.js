let t = 0;
let bgHue = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(3);
}

function draw() {
  // Dark gray background with slight blue tint
  background(bgHue * 0.8, 50, 50);
  
  // Generate EKG rhythm parameters
  let ecg = generateEKG(t);
  
  // Draw the white waveform
  stroke(255, 255, 255);
  noFill();
  beginShape();
  let amplitude = height * 0.4;
  let centerY = height * 0.5;
  for (let x = 0; x <= width; x += 2) {
    let localT = map(x, 0, width, 0, t);
    let y = centerY + ecg.at(localT) * amplitude;
    vertex(x, y);
  }
  endShape();
  
  // Draw the red vertical trace
  stroke(255, 0, 0);
  let traceX = (t * 0.5) % width;
  let traceY = centerY + ecg.at(t) * amplitude;
  line(traceX, 0, traceX, height);
  line(0, traceY, width, traceY);
  
  // Advance time (slow down for visible motion)
  t += 0.005;
}

function mousePressed() {
  // Shift background hue slightly and reset waveform
  bgHue = (bgHue + 5) % 360;
  t = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class EKGPattern {
  constructor(time) {
    this.generatePattern();
  }
  
  generatePattern() {
    // Base heartbeat pattern: QRS complex + T wave
    this.segments = [
      {type: 'pacer', duration: 0.1},  // Initial pacing
      {type: 'rest', duration: 0.2},
      {type: 'qrs', duration: 0.08},   // Sharp spike (QRS complex)
      {type: 'rest', duration: 0.15},
      {type: 't_wave', duration: 0.25} // Rounded T wave
    ];
    
    // Occasionally skip a beat or change timing
    if (random() < 0.15) {
      // Skip or delayed beat
      let skipIdx = floor(random(3, this.segments.length - 2));
      this.segments[skipIdx].duration *= random(0.5, 2);
    }
    
    // Occasionally accelerate
    if (random() < 0.1) {
      this.baseInterval *= random(0.7, 0.9);
    }
  }
  
  at(time) {
    // Simple waveform that creates EKG-like pattern
    let cycle = 0;
    let total = 0;
    let lastEnd = 0;
    
    for (let i = 0; i < this.segments.length; i++) {
      let end = lastEnd + this.segments[i].duration;
      if (time < end) {
        let localT = map(time, lastEnd, end, 0, 1);
        return this.segmentValue(this.segments[i].type, localT);
      }
      lastEnd = end;
    }
    
    // Wrap around
    return this.at(time - lastEnd);
  }
  
  segmentValue(type, t) {
    if (type === 'qrs') {
      // Sharp spike for QRS complex
      return sin(t * PI * 8) * exp(-t * 6) * 0.9 + 
             sin(t * PI * 20) * exp(-t * 15) * 0.3;
    } else if (type === 't_wave') {
      // Rounded T wave
      return 0.4 * sin(t * PI);
    }
    return 0;
  }
}

function generateEKG(t) {
  // Create EKG pattern with occasional irregularities
  let ecg = new EKGPattern(t);
  return ecg;
}
