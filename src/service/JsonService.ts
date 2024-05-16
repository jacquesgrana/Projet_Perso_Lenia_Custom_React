import JsonConfig from "../config/JsonConfig";
import IPreset from "../interface/IPreset";

export default class JsonService {

    private static _instance: JsonService | null = null;

    private _presets: IPreset[] = [];
    private _user_presets: IPreset[] = [];

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
        if (this._user_presets.length === 0) this._user_presets = await this.getUserPresets();
    }

    private async getPresets(): Promise<IPreset[]> {
        return await JsonConfig.PRESETS_DATA.presets;
    }

    private async getUserPresets(): Promise<IPreset[]> {
        return await JsonConfig.USER_PRESETS_DATA.user_presets;
    }

    public async findAllPresets(): Promise<IPreset[]> {
        if (this._presets.length === 0) {
            this._presets = await this.getPresets();
        }
        return this._presets;
    }

    public async findAllUserPresets(): Promise<IPreset[]> {
        if (this._user_presets.length === 0) {
            this._user_presets = await this.getUserPresets();
        }
        //console.log('user_presets', this._user_presets);
        return this._user_presets;
    }

    public async saveUserPresets(presets: IPreset[]): Promise<void> {
        console.log('save presets :', presets);
        this._presets = presets;
        // ecraser le fichier user_presets.json avec les presets passés en paramètres
        //const filePath = JsonConfig.USER_PRESETS_FILE_PATH;
        // créer le json
        const json = "{ \n" + "user_presets: " + JSON.stringify(presets, null, 2) + "\n" + "}";
        //const json = JSON.stringify(presets, null, 2);
        console.log('json :', json);
        // ecrire le nouveau json dans le fichier de filePath
        // Écrire le nouveau JSON dans le fichier de filePath
    }

    

}