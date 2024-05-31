import JsonConfig from "../config/JsonConfig";
import IPreset from "../interface/IPreset";

export default class JsonService {

    private static _instance: JsonService | null = null;

    private _presets: IPreset[] = [];

    private constructor() {}

    public static async getInstance(): Promise<JsonService> {
        if (this._instance === null) {
          this._instance = new JsonService();
          await this._instance.init();
        }
        return await this._instance;
      }

    private async init() {
        if (this._presets.length === 0) this._presets = await this.getPresets();
    }

    private async getPresets(): Promise<IPreset[]> {
        return await JsonConfig.PRESETS_DATA.presets;
    }

    public async findAllPresets(): Promise<IPreset[]> {
        if (this._presets.length === 0) {
            this._presets = await this.getPresets();
        }
        return this._presets;
    }
}