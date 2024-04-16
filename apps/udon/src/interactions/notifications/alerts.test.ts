// import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import { applyFinalCleanupHook } from 'src/data/datatests';
import { videoUrlExists } from 'src/utils/videoUrls';

applyFinalCleanupHook();
// const getContext = setupAndSeedDatabaseForTests('bento');

// Just forces it to check and run the before/after hooks
describe('dummy test', () => {
  test('can run and clean up', () => {
    const variable = 1;
    expect(variable).toBeGreaterThan(0);
  });
});

/* Add skip when committing due to external resources */
describe.skip('url is valid tester', () => {
  test('should not flag valid loom urls', async () => {
    /** Bento demo vid */
    const link =
      'https://www.loom.com/embed/c9744a6654504220b1b9ba0202242f2f?query=dontnhrowthingsoff';
    const valid = await videoUrlExists(
      link,
      'c9744a6654504220b1b9ba0202242f2f'
    );
    expect(valid).toBeTruthy();
  });

  test('should not flag valid youtube urls', async () => {
    /** Bento team vid */
    const link = 'https://youtu.be/hk0jF_LQYoU';
    const valid = await videoUrlExists(link, 'hk0jF_LQYoU');
    expect(valid).toBeTruthy();
  });

  test('should not flag valid wistia links', async () => {
    /* Wistia intro video */
    const link = 'https://wistia.com/?wvideo=1w9z4zg847';
    const valid = await videoUrlExists(link, '1w9z4zg847');
    expect(valid).toBeTruthy();
  });

  test('should not flag valid vidyard links', async () => {
    /* Vidyard FAQ */
    const link = 'https://video.vidyard.com/watch/1GhS9iy9saFmmZSxatNUcc';
    const valid = await videoUrlExists(link, '1GhS9iy9saFmmZSxatNUcc');
    expect(valid).toBeTruthy();
  });

  /* FAILING TESTS */

  test('should flag invalid loom urls', async () => {
    const link = 'https://www.loom.com/embed/totallyFake';
    const valid = await videoUrlExists(link, 'totallyFake');
    expect(valid).toBeFalsy();
  });

  /* YT actually still sends 200 for broken videos -__- */
  test('should flag invalid youtube urls', async () => {
    const link = 'https://youtu.be/thisLOLFAKE';
    const valid = await videoUrlExists(link, 'thisLOLFAKE');
    expect(valid).toBeFalsy();
  });

  test('should flag invalid wistia links', async () => {
    const link = 'https://wistia.com/?wvideo=thisIsHellaFakeTho';
    const valid = await videoUrlExists(link, 'thisIsHellaFakeTho');
    expect(valid).toBeFalsy();
  });

  test('should flag invalid vidyard links', async () => {
    const link = 'https://video.vidyard.com/watch/weAreOnceAgainFake';
    const valid = await videoUrlExists(link, 'weAreOnceAgainFake');
    expect(valid).toBeFalsy();
  });
});
