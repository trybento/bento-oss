import { ContextTagTooltipAlignment } from 'bento-common/types/globalShoyuState';
import { getBoundingRects } from '../../lib/helpers';
import { getTooltipCoordinates } from './helpers';

jest.mock('../../lib/helpers', () => ({
  getBoundingRects: jest.fn(),
}));

const toJSON = () => {};

/**
 * For simplicity we will test with a 100x100 highlight tag centered in a 300x300 container
 * in a 500x500 window, effectively creating 100px paddings
 */
const container: DOMRect = {
  width: 300,
  height: 300,
  x: 100,
  y: 100,
  top: 100,
  left: 0,
  right: 0,
  bottom: 0,
  toJSON,
};

const tag: DOMRect = {
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  top: 100,
  left: 100,
  right: 100,
  bottom: 100,
  toJSON,
};

const baseTooltip: DOMRect = {
  width: 40,
  height: 40,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  toJSON,
};

const windowDimensions = {
  windowHeight: 500,
  windowWidth: 500,
};

/** junk so it is not null */
const junk: any = {};

describe('tooltip coordinates finder', () => {
  describe('alignment adjustments', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test.each([
      ContextTagTooltipAlignment.top,
      ContextTagTooltipAlignment.bottom,
      ContextTagTooltipAlignment.left,
      ContextTagTooltipAlignment.right,
    ])('fits with placement %s and enough space', (alignment) => {
      (getBoundingRects as jest.Mock).mockReturnValueOnce({
        tagRect: tag,
        tooltipRect: baseTooltip,
        containerRect: container,
        ...windowDimensions,
      });

      const res = getTooltipCoordinates(junk, junk, alignment);

      expect(res.alignment === alignment);
    });

    test.each([
      ContextTagTooltipAlignment.top,
      ContextTagTooltipAlignment.bottom,
      ContextTagTooltipAlignment.left,
      ContextTagTooltipAlignment.right,
    ])('moves %s to opposite if out of space', (alignment) => {
      /** adjust pos so there's no enough space on that side */
      (getBoundingRects as jest.Mock).mockReturnValueOnce({
        tagRect: tag,
        tooltipRect: baseTooltip,
        containerRect: {
          ...container,
          ...(alignment === ContextTagTooltipAlignment.bottom
            ? { top: 500 }
            : alignment === ContextTagTooltipAlignment.top
            ? { top: 0 }
            : alignment === ContextTagTooltipAlignment.left
            ? { x: 0 }
            : { x: 500 }),
        },
        ...windowDimensions,
      });

      const res = getTooltipCoordinates(junk, junk, alignment);

      expect(res.alignment).toEqual(
        alignment === ContextTagTooltipAlignment.bottom
          ? ContextTagTooltipAlignment.top
          : alignment === ContextTagTooltipAlignment.top
          ? ContextTagTooltipAlignment.bottom
          : alignment === ContextTagTooltipAlignment.left
          ? ContextTagTooltipAlignment.right
          : ContextTagTooltipAlignment.left
      );
    });

    test.each([
      ContextTagTooltipAlignment.top,
      ContextTagTooltipAlignment.bottom,
      ContextTagTooltipAlignment.left,
      ContextTagTooltipAlignment.right,
    ])(
      'if no space at all for %s or flipped, aligns perpendicular',
      (alignment) => {
        (getBoundingRects as jest.Mock).mockReturnValueOnce({
          tagRect: tag,
          tooltipRect: baseTooltip,
          containerRect: {
            ...container,
            ...(alignment === ContextTagTooltipAlignment.left ||
            alignment === ContextTagTooltipAlignment.right
              ? { x: 0 }
              : { top: 0 }),
          },
          ...{
            ...windowDimensions,
            ...(alignment === ContextTagTooltipAlignment.top ||
            alignment === ContextTagTooltipAlignment.bottom
              ? {
                  windowHeight: 100,
                }
              : {
                  windowWidth: 100,
                }),
          },
        });

        const res = getTooltipCoordinates(junk, junk, alignment);

        if (
          alignment === ContextTagTooltipAlignment.top ||
          alignment === ContextTagTooltipAlignment.bottom
        ) {
          expect([
            ContextTagTooltipAlignment.top,
            ContextTagTooltipAlignment.bottom,
          ]).not.toContain(res.alignment);
        } else if (
          alignment === ContextTagTooltipAlignment.left ||
          alignment === ContextTagTooltipAlignment.right
        ) {
          expect([
            ContextTagTooltipAlignment.left,
            ContextTagTooltipAlignment.right,
          ]).not.toContain(res.alignment);
        }
      }
    );
  });
});
