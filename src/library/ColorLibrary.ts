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


}