let mic;
let fft;

function setup(){
  let cnv = createCanvas(800, 800);
  mic = new p5.AudioIn();
  fft = new p5.FFT();

  mic.start();
  mic.connect();
  fft.setInput(mic.output);
  background(0);
}

let x = 400;
let y = 400;
let dx = 0;
let dy = 0;
let angle = 0;
let dangle = 0.05;

function draw(){
  let spectrum = fft.analyze();
  //console.log(spectrum);
  //noStroke();
  noFill();
  //fill(255, 0, 255);
  for (let i = 0; i< spectrum.length; i++){
    let radius = map(i, 0, spectrum.length/2, 0, width);
    let iRed = spectrum[i];
    stroke(0, iRed, 0);
    arc(x, y, radius, radius, angle, angle + PI / 8);
  }

  x += dx;
  if(x < 0 || x > width) {
    dx *= -1;
  }

  y += dy;
  if(y < 0 || y > height) {
    dy *= -1;
  }
  
  angle += dangle;
  angle %= (2 * PI);
}