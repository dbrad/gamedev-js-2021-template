import { assert } from "./debug";
import { doc } from "./screen";
import { gl_createTexture } from "./gl";
import { spritesheet } from "./spritesheet";

export type Texture = {
  _atlas: WebGLTexture;
  _w: number;
  _h: number;
  _u0: number;
  _v0: number;
  _u1: number;
  _v1: number;
};

let TEXTURE_CACHE: Map<string, Texture> = new Map();
export let getTexture = (textureName: string): Texture =>
{
  let texture = TEXTURE_CACHE.get(textureName);
  assert(texture !== undefined, `Unable to load texture "${ textureName }"`);
  return texture;
};

export let loadSpriteSheet = (): Promise<void> =>
{
  let image: HTMLImageElement = new Image();

  return new Promise((resolve, reject) =>
  {
    try
    {
      image.addEventListener("load", () =>
      {
        let canvas = doc.createElement("canvas");
        let width = canvas.width = image.width;
        let height = canvas.height = image.height;
        canvas.getContext("2d")?.drawImage(image, 0, 0);

        let glTexture: WebGLTexture = gl_createTexture(canvas);

        for (let texture of spritesheet._textures)
        {
          let { _w, _h, _x, _y, _name } = texture;
          if (texture._type === "s")
          {
            TEXTURE_CACHE.set(_name as string, {
              _atlas: glTexture,
              _w: _w,
              _h: _h,
              _u0: _x / width,
              _v0: _y / height,
              _u1: (_x + _w) / width,
              _v1: (_y + _h) / height
            });
          }
          else
          {
            for (let ox: number = _x, i: number = 0; ox < width; ox += _w)
            {
              TEXTURE_CACHE.set(_name[i], {
                _atlas: glTexture,
                _w: _w,
                _h: _h,
                _u0: ox / width,
                _v0: _y / height,
                _u1: (ox + _w) / width,
                _v1: (_y + _h) / height
              });
              i++;
            }
          }
        }
        resolve();
      });
      image.src = spritesheet._dataUrl;
    }
    catch (err)
    {
      reject(err);
    }
  });
};