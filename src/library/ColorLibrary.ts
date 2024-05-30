export default class ColorLibrary {
    public static getRgbValueFromCellValue(value: number): number {
        return Math.floor(value * 255);
    }

    public static getCellValueFromRgbValue(value: number): number {
        return value / 255;
    }

    public static hexToRgb(hex: string): string {
        let r = 255;
        let g = 255;
        let b = 255;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(result) {
            r = parseInt(result[1], 16);
            g = parseInt(result[2], 16);
            b = parseInt(result[3], 16);
        }
        const rgbColor = `rgb(${r}, ${g}, ${b})`;
        return rgbColor;
    }

    public static rgbToCellValues(rgb: string): any {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
        if(result) {
            const r = this.getCellValueFromRgbValue(parseInt(result[1]));
            const g = this.getCellValueFromRgbValue(parseInt(result[2]));
            const b = this.getCellValueFromRgbValue(parseInt(result[3]));
            return {red:r, green:g, blue:b};
        }
        return {red:0, green:0, blue:0};
    }

    public static cellValuesToRgb(values:[number, number, number]) {
        const red = ColorLibrary.getRgbValueFromCellValue(values[0]);
        const green = ColorLibrary.getRgbValueFromCellValue(values[1]);
        const blue = ColorLibrary.getRgbValueFromCellValue(values[2]);
        return `rgb(${red}, ${green}, ${blue})`;
    }

    public static getRandomSatLumColorFromRgb(rgb: string): string {
        const rgbValues = rgb.slice(rgb.indexOf('(') + 1, rgb.indexOf(')')).split(',').map(v => parseFloat(v));
        const hslValues = ColorLibrary.rgbToHsl(rgbValues[0], rgbValues[1], rgbValues[2]);
        //console.log('hslValues :', hslValues);
        const s = Math.random();
        const l = Math.random();
        const newHslValues = [hslValues[0], s, l];
        const newRgb = ColorLibrary.hslToRgb(newHslValues[0], newHslValues[1], newHslValues[2]);
        //console.log('newRgb :', newRgb);
        return newRgb;
      }
      
      public static rgbToHsl(r: number, g: number, b: number): [number, number, number] {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        if (max === min) {
          h = 0;
          s = 0;
        } 
        else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        //console.log('hue :', h);
        return [Math.floor(h * 360), s, l];
      }
      
public static hslToRgb(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rgb = [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];

  return `rgb(${rgb.join(',')})`;
}

      


}