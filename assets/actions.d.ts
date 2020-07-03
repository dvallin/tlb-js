import { Action, Movement, Status, Attack } from '../components/action';
declare const actionsDefinition: {
    endTurn: {
        name: string;
        cost: {
            actions: number;
            movement: number;
            costsAll: boolean;
        };
        subActions: never[];
    };
    shortMove: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Movement[];
    };
    consume: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: never[];
    };
    longMove: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Movement[];
    };
    hit: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Attack[];
    };
    strideAndSlip: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: (Movement | Status)[];
    };
    rush: {
        name: string;
        cost: {
            actions: number;
            movement: number;
            costsAll: boolean;
        };
        subActions: Movement[];
    };
    shoot: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Attack[];
    };
    headshot: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Attack[];
    };
    overcharge: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        attack: {};
        subActions: Attack[];
    };
    bolt: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Attack[];
    };
    hitAndRun: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: (Movement | Attack)[];
    };
    tighten: {
        name: string;
        cost: {
            actions: number;
            movement: number;
        };
        subActions: Status[];
    };
};
export declare type ActionType = keyof typeof actionsDefinition;
export declare const actions: {
    [key in ActionType]: Action;
};
export {};
