let audioContext;
let analyser;
let dataArray;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize audio context and analyser
  if (typeof window !== 'undefined' && typeof AudioContext !== 'undefined') {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  centerX = width / 2;
  centerY = height / 2;
}

function draw() {
  background(0, 0, 10);
  
  time += 0.02;
  
  // Get audio data if available
  let amplitude = 0;
  if (analyser) {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    amplitude = sum / dataArray.length / 255;
  }

  // Mouse interaction
  let mouseRadius = 100;
  let mouseAngle = atan2(mouseY - centerY, mouseX - centerX);
  
  // Draw lines
  push();
  translate(centerX, centerY);
  
  for (let i = 0; i < 100; i++) {
    let angle = i * 0.2 + time;
    let length = 50 + sin(time * 2 + i * 0.1) * 30;
    let strokeHue = (i * 3 + time * 20) % 360;
    let strokeWidth = 1 + amplitude * 5 + sin(time + i * 0.1) * 2;
    
    // Mouse interaction effect
    let mouseDist = dist(mouseX, mouseY, centerX, centerY);
    if (mouseDist < mouseRadius) {
      let angleDiff = abs(angle - mouseAngle);
      let mouseEffect = map(mouseDist, 0, mouseRadius, 1, 0);
      length += mouseEffect * 100;
      strokeWidth += mouseEffect * 5;
      strokeHue += mouseEffect * 100;
    }
    
    // Draw line
    stroke(strokeHue % 360, 80, 90, 0.7);
    strokeWeight(strokeWidth);
    noFill();
    
    let x1 = 0;
    let y1 = 0;
    let x2 = cos(angle) * length;
    let y2 = sin(angle) * length;
    
    line(x1, y1, x2, y2);
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
