import { BaseController } from 'shared/utils/BaseController';
import { quizWorkspace } from 'shared/types/QuizWorkspace';
import { DeathRoom } from 'shared/types/DeathRoom';

export class DeathRoomController extends BaseController<DeathRoom> {

    private startLocations: CFrame[] = [];
    private random = new Random();

    constructor() {
        super(quizWorkspace.DeathRoom);

        const locations = this.instance.StartLocations.GetChildren();
        for (const startLocation of locations) {
            const cframe = (startLocation as BasePart).CFrame; 
            this.startLocations.push(cframe);
        }
    }

    randomStartLocation(): CFrame {
        const index = this.random.NextInteger(0, this.startLocations.size() - 1);
        return this.startLocations[index];
    }

    scream() {
        this.instance.DeathScream.Play();
    }
}
