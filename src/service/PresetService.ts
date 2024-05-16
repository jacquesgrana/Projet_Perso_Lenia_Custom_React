import IPreset from "../interface/IPreset";
import JsonService from "./JsonService";



export default class PresetService {

    private static _instance: PresetService | null = null;
    private _jsonService: JsonService | null = null;
    private _presets: IPreset[] = [];
    private _user_presets: IPreset[] = [];


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
        //this._user_presets = await this._jsonService.findAllUserPresets();
    }

    public async saveNewUserPreset(newPreset: IPreset): Promise<void> {
      this._user_presets.push(newPreset);
      //await this._jsonService?.saveUserPresets(this._user_presets);
    }

    public getPresets(): IPreset[] {
        return this._presets;
    }

    public getUserPresets(): IPreset[] {
        return this._user_presets;
    }

    public exportUserPresets(): void {
      if(this._user_presets.length === 0) return;
      const json = "{ \n" + "  \"user_presets\": " + JSON.stringify(this._user_presets, null, 2) + "\n" + "}";
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
    
      // Créer un élément de lien temporaire
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_presets.json'); // Nommer le fichier téléchargé
    
      // Simuler un clic sur l'élément de lien
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
      // Libérer de la mémoire
      URL.revokeObjectURL(url);
    }
    
    
}