import Mtk from 'gi://Mtk';

import type { Entity } from './ecs.js';

import * as Movement from './movement.js';

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

    /**
     * The horizontal, then the vertical, part of a change to the rect that actually changed.
     *
     * A diagonal change has no single direction (see {@link Movement.calculate}),
     * so it has to be resized one axis at a time.
     */
    axis_movements(change: Mtk.Rectangle): Movement.Movement[] {
        const horizontal = new Mtk.Rectangle({
            x: change.x,
            y: this.rect.y,
            width: change.width,
            height: this.rect.height,
        });

        return [Movement.calculate(this.rect, horizontal), Movement.calculate(horizontal, change)].filter(
            movement => movement !== Movement.Movement.NONE,
        );
    }
}
