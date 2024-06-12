import IPreset from "../interface/IPreset";
import JsonService from "./JsonService";

/**
 * Service en pattern singleton
 */
export default class PresetService {

    private static _instance: PresetService | null = null;
    private _jsonService: JsonService | null = null;
    private _presets: IPreset[] = [];
    private _userPresets: IPreset[] = [];


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

    public async saveNewUserPreset(newPreset: IPreset): Promise<void> {
      this._userPresets.push(newPreset);
    }

    public getPresets(): IPreset[] {
        return this._presets;
    }

    public getUserPresets(): IPreset[] {
        return this._userPresets;
    }

    /**
     * Exporte les presets de l'user dans un fichier JSON
     */
    public exportUserPresets(): void {
      if(this._userPresets.length === 0) return;
      const json = "{ \n" + "  \"user_presets\": " + JSON.stringify(this._userPresets, null, 2) + "\n" + "}";
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

    /**
     * Ajoute des presets à la liste des presets de l'user
     * @param userPresetsToAdd Liste des presets à ajouter
     */
    public addUserPresets(userPresetsToAdd: IPreset[]): void {
      for (let i = 0; i < userPresetsToAdd.length; i++) {
        const id = this._userPresets.length > 0 ? Math.max(...this._userPresets.map(preset => preset.id)) + 1: 0;
        userPresetsToAdd[i].id = id;
        // TODO ajouter tests pour valider le preset
        const isPresetAlreadyPresent = this._userPresets.some(preset => 
          preset.name === userPresetsToAdd[i].name
          && preset.description === userPresetsToAdd[i].description
          && preset.pseudo === userPresetsToAdd[i].pseudo
        );
        if (!isPresetAlreadyPresent) this._userPresets.push(userPresetsToAdd[i]);
      }
    }

    /**
     * Supprime un preset de la liste des presets de l'user
     * @param id L'id du preset à supprimer
     */
    public deleteUserPreset(id: number): void {
      this._userPresets = this._userPresets.filter(preset => preset.id !== id);
      //console.log('user_presets :', this._user_presets);
    }
}