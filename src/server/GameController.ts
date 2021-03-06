import { LevelController } from "./LevelController";
import { Workspace } from "@rbxts/services";
import { LevelConfig } from "shared/LevelConfig";
import { LobbyController } from "./LobbyController";
import { DeathRoomController } from "./DeathRoomController";
import { Level } from "shared/types/Level";
import { quizServerStorage } from "shared/types/QuizServerStorage";

const LEVEL_OFFSET_X = 100;

export class GameController {

    levelModel: Model;
    levels: LevelController[] = [];
    levelParent: Folder;
    lobby: LobbyController;
    deathRoom: DeathRoomController;

    constructor() {
        this.levelModel = quizServerStorage.Level;
        this.levelParent = Workspace.FindFirstChild('Levels') as Folder;
        this.lobby = new LobbyController();
        this.deathRoom = new DeathRoomController();
    }

    configure(levelConfigs: LevelConfig[], startLevels: number[], checkpointLevels: number[]) {
        for (let i = 0; i < levelConfigs.size(); i++) {
            const levelController = this.createLevel(i);
            this.levels.push(levelController);
        }

        // Bind level configs
        for (let i = 0; i < levelConfigs.size(); i++) {
            const isCheckPoint = checkpointLevels.includes(i);
            this.levels[i].bindConfig(levelConfigs[i], this.levels, isCheckPoint);
        }

        // Init lobby last since it needs start levels to already be initialized
        this.initLobby(startLevels);
    }

    private initLobby(startLevels: number[]) {
        const levelControllers: LevelController[] = [];
        for (const startLevel of startLevels) {
            const levelController = this.levels[startLevel];
            assert(levelController, `LevelController not found, startLevel index: ${startLevel}`);
            levelControllers.push(levelController);
        }
        // TODO: File bug for below failure
        //startLevels.map(i => this.levels[i]);
        this.lobby.init(levelControllers);
    }

    private createLevel(index: number) {
        const levelCopy = this.levelModel.Clone() as Level;
        levelCopy.TranslateBy(new Vector3(LEVEL_OFFSET_X * index, 0, 0));
        levelCopy.Parent = this.levelParent;
        return new LevelController(levelCopy, this.deathRoom, this.lobby);
    }
}
