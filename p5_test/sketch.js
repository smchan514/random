let mic;
let fft;

let angle = 0;
let dangle = 0.01;
let colormap = [];

// Colormap RGB values lifted from OCTAVE with modification:
// >> c = colormap('jet');
// >> t = uint8(c .* 255);
const colormapRawJet = [
  0, 0, 0,
  0, 0, 159,
  0, 0, 175,
  0, 0, 191,
  0, 0, 207,
  0, 0, 223,
  0, 0, 239,
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
  128, 0, 0,
];

const colormapRawRainbow = [
  0, 0, 0,
  64, 10, 0,
  64, 20, 0,
  128, 30, 0,
  128, 40, 0,
  128, 51, 0,
  128, 61, 0,
  255, 71, 0,
  255, 81, 0,
  255, 91, 0,
  255, 101, 0,
  255, 111, 0,
  255, 121, 0,
  255, 132, 0,
  255, 142, 0,
  255, 152, 0,
  255, 162, 0,
  255, 172, 0,
  255, 182, 0,
  255, 192, 0,
  255, 202, 0,
  255, 212, 0,
  255, 223, 0,
  255, 233, 0,
  255, 243, 0,
  255, 253, 0,
  239, 255, 0,
  219, 255, 0,
  198, 255, 0,
  178, 255, 0,
  158, 255, 0,
  138, 255, 0,
  117, 255, 0,
  97, 255, 0,
  77, 255, 0,
  57, 255, 0,
  36, 255, 0,
  16, 255, 0,
  0, 251, 4,
  0, 231, 24,
  0, 210, 45,
  0, 190, 65,
  0, 170, 85,
  0, 150, 105,
  0, 130, 125,
  0, 109, 146,
  0, 89, 166,
  0, 69, 186,
  0, 49, 206,
  0, 28, 227,
  0, 8, 247,
  8, 0, 255,
  22, 0, 255,
  35, 0, 255,
  49, 0, 255,
  62, 0, 255,
  76, 0, 255,
  89, 0, 255,
  103, 0, 255,
  116, 0, 255,
  130, 0, 255,
  143, 0, 255,
  157, 0, 255,
  170, 0, 255,
];

const colormapRawCubehelix = [
  0, 0, 0,
  7, 2, 6,
  12, 5, 14,
  17, 8, 22,
  21, 11, 30,
  24, 15, 38,
  26, 20, 46,
  26, 25, 53,
  27, 30, 60,
  26, 36, 66,
  25, 43, 71,
  24, 49, 74,
  23, 56, 77,
  22, 64, 78,
  21, 71, 78,
  21, 78, 77,
  22, 85, 75,
  24, 91, 73,
  27, 97, 69,
  31, 102, 65,
  37, 107, 61,
  43, 111, 57,
  51, 115, 53,
  60, 118, 50,
  71, 120, 48,
  82, 121, 47,
  93, 122, 47,
  106, 123, 48,
  118, 123, 51,
  130, 122, 56,
  143, 122, 61,
  154, 121, 69,
  165, 121, 78,
  176, 121, 88,
  185, 121, 99,
  193, 122, 111,
  199, 123, 123,
  204, 124, 136,
  208, 127, 149,
  211, 130, 162,
  212, 134, 175,
  212, 138, 187,
  212, 144, 198,
  210, 149, 208,
  208, 156, 217,
  205, 163, 225,
  202, 170, 231,
  200, 177, 236,
  197, 184, 239,
  195, 192, 242,
  194, 199, 243,
  193, 206, 243,
  194, 213, 243,
  195, 219, 242,
  198, 225, 241,
  202, 230, 240,
  206, 235, 239,
  212, 239, 239,
  218, 242, 239,
  225, 245, 240,
  233, 248, 242,
  240, 251, 245,
  248, 253, 250,
  255, 255, 255
];


function buildColormap() {
  // array0 has converts colormapRaw into array of colors
  let array0 = [];
  let colormapRaw = colormapRawCubehelix;
  let nbrColors = colormapRaw.length / 3;
  for (let i = 0; i < nbrColors; i++) {
    let c = color(colormapRaw[i * 3], colormapRaw[i * 3 + 1], colormapRaw[i * 3 + 2]);
    array0.push(c);
  }

  // array1 has exactly 256 elements to match the output of FFT output
  let array1 = [];
  for (let i = 0; i < 256; i++) {
    let idx0 = min(floor(i / 255.0 * (nbrColors - 1)), nbrColors - 1);
    let idx1 = min(idx0 + 1, nbrColors - 1);
    if (idx0 == idx1) {
      array1.push(array0[idx0]);
    } else {
      let idx0p = idx0 * 255.0 / (nbrColors - 1);
      let idx1p = idx1 * 255.0 / (nbrColors - 1);
      let weight0 = Math.abs(i - idx1p);
      let weight1 = Math.abs(i - idx0p);
      let ratio = weight0 / (weight0 + weight1);

      let c0 = array0[idx0];
      let c1 = array0[idx1];
      let cX = color(
        lerp(c0.levels[0], c1.levels[0], ratio),
        lerp(c0.levels[1], c1.levels[1], ratio),
        lerp(c0.levels[2], c1.levels[2], ratio)
      );
      array1.push(cX);
    }
  }

  return array0;
}

function getColor(value) {
  let scaledValue = map(value, 0, 255, 0, colormap.length);
  let idx0 = floor(scaledValue);
  return colormap[idx0];
}

let canvas;

function setup() {
  canvas = createCanvas(800, 800);
  mic = new p5.AudioIn();
  fft = new p5.FFT();

  mic.start();
  mic.connect();
  fft.setInput(mic.output);
  background(0);

  colormap = buildColormap();
}

function draw() {

  //copy(canvas, 0, 0, width, height, 3, 3, width - 6, height - 6);

  let spectrum = fft.analyze();
  //console.log(spectrum);

  noFill();
  for (let i = 0; i < spectrum.length; i++) {
    let radius = map(i, 0, spectrum.length / 2, 0, width);
    let c = getColor(spectrum[i]);
    stroke(c);
    arc(width / 2, height / 2, radius, radius, angle, angle + 2 * dangle);
  }

  angle += dangle;
  angle %= (2 * PI);
}