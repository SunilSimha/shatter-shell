import Mtk from 'gi://Mtk';

import type { Entity } from './ecs.js';

import * as Movement from './movement.js';
import { edges, type Edge } from './rectangle.js';

export class GrabOp {
    entity: Entity;
    rect: Mtk.Rectangle;

    constructor(entity: Entity, rect: Mtk.Rectangle) {
        this.entity = entity;
        this.rect = rect;
    }

    operation(change: Mtk.Rectangle): Movement.Movement {
        return Movement.calculate(this.rect, change);
    }

    /** The edges of the start rect that `change` has moved */
    moved_edges(change: Mtk.Rectangle): Edge[] {
        const [before, after] = [edges(this.rect), edges(change)];
        return (['left', 'right', 'top', 'bottom'] as const).filter(edge => before[edge] !== after[edge]);
    }
}
