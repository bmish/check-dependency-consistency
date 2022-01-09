import { mismatchingVersionsToOutput } from '../../lib/output.js';

describe('Utils | output', function () {
  describe('#mismatchingVersionsToOutputLines', function () {
    it('behaves correctly', function () {
      expect(
        mismatchingVersionsToOutput([
          {
            dependency: 'foo',
            versions: [
              { version: '1.2.3', packages: ['foo'] },
              { version: '4.5.6', packages: ['.', 'bar', 'baz'] },
            ],
          },

          {
            dependency: 'bar',
            versions: [
              {
                version: '2.0.0',
                packages: ['package1', 'package2', 'package3', 'package4'],
              },

              {
                version: '1.4.0',
                packages: [
                  'package5',
                  'package6',
                  'package7',
                  'package8',
                  'package9',
                ],
              },
            ],
          },

          {
            dependency: 'baz',
            versions: [
              {
                version: '^2.0.0',
                packages: ['package1'],
              },

              {
                version: '~2.0.0',
                packages: ['package2'],
              },

              {
                version: '^1.0.0',
                packages: ['package3'],
              },
            ],
          },

          {
            dependency: 'biz',
            versions: [
              {
                version: '^1.0.0',
                packages: ['package1'],
              },

              {
                version: 'workspace:*', // Invalid/abnormal version.
                packages: ['package2'],
              },
            ],
          },
        ])
      ).toMatchInlineSnapshot(`
        "Found 4 dependencies with mismatching versions across the workspace. Fix with \`--fix\`.
        ╔═══════╤════════╤══════════════════╗
        ║ [1mfoo[22m   │ Usages │ Packages         ║
        ╟───────┼────────┼──────────────────╢
        ║ [91m4.5.6[39m │ [1m3[22m      │ (Root), bar, baz ║
        ╟───────┼────────┼──────────────────╢
        ║ [91m1.2.3[39m │ 1      │ foo              ║
        ╚═══════╧════════╧══════════════════╝
        ╔═══════╤════════╤════════════════════════════════════════════╗
        ║ [1mbar[22m   │ Usages │ Packages                                   ║
        ╟───────┼────────┼────────────────────────────────────────────╢
        ║ [91m2.0.0[39m │ 4      │ package1, package2, package3, and 1 other  ║
        ╟───────┼────────┼────────────────────────────────────────────╢
        ║ [91m1.4.0[39m │ [1m5[22m      │ package5, package6, package7, and 2 others ║
        ╚═══════╧════════╧════════════════════════════════════════════╝
        ╔════════╤════════╤══════════╗
        ║ [1mbaz[22m    │ Usages │ Packages ║
        ╟────────┼────────┼──────────╢
        ║ [91m^2.0.0[39m │ 1      │ package1 ║
        ╟────────┼────────┼──────────╢
        ║ [91m~2.0.0[39m │ 1      │ package2 ║
        ╟────────┼────────┼──────────╢
        ║ [91m^1.0.0[39m │ 1      │ package3 ║
        ╚════════╧════════╧══════════╝
        ╔═════════════╤════════╤══════════╗
        ║ [1mbiz[22m         │ Usages │ Packages ║
        ╟─────────────┼────────┼──────────╢
        ║ [91m^1.0.0[39m      │ 1      │ package1 ║
        ╟─────────────┼────────┼──────────╢
        ║ [91mworkspace:*[39m │ 1      │ package2 ║
        ╚═════════════╧════════╧══════════╝
        "
      `);
    });

    it('behaves correctly with empty input', function () {
      expect(() =>
        mismatchingVersionsToOutput([])
      ).toThrowErrorMatchingInlineSnapshot(
        '"No mismatching versions to output."'
      );
    });
  });
});
