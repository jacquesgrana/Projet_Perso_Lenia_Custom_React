import IPresetValues from "./IPresetValues";

export default interface IPreset {
    id: number;
    name: string;
    description: string;
    date: string;
    pseudo: string;
    imageSrc: string;
    values: IPresetValues;
}