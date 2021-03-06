export let hexToColour = (abgr: number): [number, number, number, number] =>
{
  abgr >>>= 0;
  let r: number = abgr & 0xFF;
  let g: number = (abgr & 0xFF00) >>> 8;
  let b: number = (abgr & 0xFF0000) >>> 16;
  let a: number = ((abgr & 0xFF000000) >>> 24);
  return [a, b, g, r];
};

export let colourToHex = (a: number, b: number, g: number, r: number): number =>
{
  let out: number = 0x0;
  out = ((out | (a & 0xff)) << 8) >>> 0;
  out = ((out | (b & 0xff)) << 8) >>> 0;
  out = ((out | (g & 0xff)) << 8) >>> 0;
  out = ((out | (r & 0xff))) >>> 0;
  return out;
};

export let WHITE = 0xFFFFFFFF;
export let GREY_222 = 0xFF222222;
export let GREY_333 = 0xFF333333;
export let GREY_666 = 0xFF666666;
export let GREY_999 = 0xFF999999;