import Mtk from 'gi://Mtk';

export enum Movement {
    NONE = 0,
    MOVED = 0b1,
    GROW = 0b10,
    SHRINK = 0b100,
    LEFT = 0b1000,
    UP = 0b10000,
    RIGHT = 0b100000,
    DOWN = 0b1000000,
}

/** An edge of a window */
export type Edge = 'left' | 'right' | 'top' | 'bottom';

/** Whether a movement is along the horizontal axis (it moves a left or right edge) */
export function is_horizontal(movement: Movement): boolean {
    return (movement & (Movement.LEFT | Movement.RIGHT)) !== 0;
}

/**
 * The edge of a window that a movement moves, or null for a movement that is not a change of one edge.
 *
 * A growth in a direction moves the edge on that side. A shrink moves the edge on the opposite side,
 * e.g. `SHRINK | LEFT` is the right edge moving left.
 */
export function moved_edge(movement: Movement): Edge | null {
    const grow = (movement & Movement.GROW) !== 0;
    if (!grow && (movement & Movement.SHRINK) === 0) return null;

    if ((movement & Movement.LEFT) !== 0) return grow ? 'left' : 'right';
    if ((movement & Movement.RIGHT) !== 0) return grow ? 'right' : 'left';
    if ((movement & Movement.UP) !== 0) return grow ? 'top' : 'bottom';
    if ((movement & Movement.DOWN) !== 0) return grow ? 'bottom' : 'top';
    return null;
}

export function calculate(from: Mtk.Rectangle, change: Mtk.Rectangle): Movement {
    const xpos = from.x == change.x;
    const ypos = from.y == change.y;

    if (xpos && ypos) {
        if (from.width == change.width) {
            if (from.height == change.height) {
                return Movement.NONE;
            } else if (from.height < change.height) {
                return Movement.GROW | Movement.DOWN;
            } else {
                return Movement.SHRINK | Movement.UP;
            }
        } else if (from.width < change.width) {
            return Movement.GROW | Movement.RIGHT;
        } else {
            return Movement.SHRINK | Movement.LEFT;
        }
    } else if (xpos) {
        if (from.height < change.height) {
            return Movement.GROW | Movement.UP;
        } else {
            return Movement.SHRINK | Movement.DOWN;
        }
    } else if (ypos) {
        if (from.width < change.width) {
            return Movement.GROW | Movement.LEFT;
        } else {
            return Movement.SHRINK | Movement.RIGHT;
        }
    } else {
        return Movement.MOVED;
    }
}
