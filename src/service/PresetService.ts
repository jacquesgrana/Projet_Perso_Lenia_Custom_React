import IPreset from "../interface/IPreset";
import JsonService from "./JsonService";



export default class PresetService {

    private static _instance: PresetService | null = null;
    private _jsonService: JsonService | null = null;
    private _presets: IPreset[] = [];


    private constructor() {}

    public static async getInstance(): Promise<PresetService> {
        if (this._instance === null) {
          this._instance = new PresetService();
          await this._instance.init();
        }
        return this._instance;
      }

    private async init() {
        this._jsonService = await (await JsonService).getInstance();
        this._presets = await this._jsonService.findAllPresets();
    }
}