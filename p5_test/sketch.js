let mic;
let fft;

let angle = 0;
let dangle = 0.01;
let colormap = [];

// Colormap RGB values lifted from OCTAVE with modification:
// >> c = colormap('jet');
// >> t = uint8(c .* 255);
const colormapRaw = [
    0, 0, 0,
    0, 0, 32,
    0, 0, 64,
    0, 0, 128,
    0, 0, 128,
    0, 0, 160,
    0, 0, 210,
    0, 0, 255,
    0, 16, 255,
    0, 32, 255,
    0, 48, 255,
    0, 64, 255,
    0, 80, 255,
    0, 96, 255,
    0, 112, 255,
    0, 128, 255,
    0, 143, 255,
    0, 159, 255,
    0, 175, 255,
    0, 191, 255,
    0, 207, 255,
    0, 223, 255,
    0, 239, 255,
    0, 255, 255,
    16, 255, 239,
    32, 255, 223,
    48, 255, 207,
    64, 255, 191,
    80, 255, 175,
    96, 255, 159,
    112, 255, 143,
    128, 255, 128,
    143, 255, 112,
    159, 255, 96,
    175, 255, 80,
    191, 255, 64,
    207, 255, 48,
    223, 255, 32,
    239, 255, 16,
    255, 255, 0,
    255, 239, 0,
    255, 223, 0,
    255, 207, 0,
    255, 191, 0,
    255, 175, 0,
    255, 159, 0,
    255, 143, 0,
    255, 128, 0,
    255, 112, 0,
    255, 96, 0,
    255, 80, 0,
    255, 64, 0,
    255, 48, 0,
    255, 32, 0,
    255, 16, 0,
    255, 0, 0,
    239, 0, 0,
    223, 0, 0,
    207, 0, 0,
    191, 0, 0,
    175, 0, 0,
    159, 0, 0,
    143, 0, 0,
    128, 0, 0
];

function buildColormap() {
    // array0 has converts colormapRaw into array of colors
    let array0 = [];
    let nbrColors = colormapRaw.length / 3;
    for(let i = 0; i < nbrColors; i++) {
        let c = color(colormapRaw[i*3], colormapRaw[i*3+1], colormapRaw[i*3+2]);
        array0.push(c);
    }
    
    // array1 has exactly 256 elements to match the output of FFT output
    let array1 = [];
    for(let i = 0; i < 256; i++) {
        let idx0 = min(floor(i / 255.0 * nbrColors), nbrColors-1);
        let idx1 = min(ceil(i / 255.0 * nbrColors), nbrColors-1);
        let c0 = array0[idx0];
        let c1 = array0[idx1];
        let cX = color(
            (c0.levels[0] + c1.levels[0]) / 2,
            (c0.levels[1] + c1.levels[1]) / 2,
            (c0.levels[2] + c1.levels[2]) / 2
        );
        array1.push(cX);
    }
    
    return array0;
}

function getColor(value) {
    let scaledValue = map(value, 0, 255, 0, colormap.length);
    let idx0 = floor(scaledValue);
    return colormap[idx0];
}

function setup(){
  let cnv = createCanvas(800, 800);
  mic = new p5.AudioIn();
  fft = new p5.FFT();

  mic.start();
  mic.connect();
  fft.setInput(mic.output);
  background(0);
  
  colormap = buildColormap();
}

function draw(){
  let spectrum = fft.analyze();
  //console.log(spectrum);
  
  noFill();  
  for (let i = 0; i< spectrum.length; i++){
    let radius = map(i, 0, spectrum.length/2, 0, width);
    let c = getColor(spectrum[i]);
    stroke(c);
    arc(width/2, height/2, radius, radius, angle, angle + 2*dangle);
  }

  angle += dangle;
  angle %= (2 * PI);
}