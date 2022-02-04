/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect, test } from '@playwright/test';
import { activate } from './utils';

test.describe.configure({ mode: 'parallel' });

test('should highlight steps while running', async ({}, testInfo) => {
  const { vscode, testController } = await activate(testInfo.outputDir, {
    'playwright.config.js': `module.exports = { testDir: 'tests' }`,
    'tests/test.spec.ts': `
      import { test, expect } from '@playwright/test';
      test('pass', async () => {
        expect(1).toBe(1);
        expect(2).toBe(2);
        expect(3).toBe(3);
      });
    `,
  });

  await vscode.openEditors('**/test.spec.ts');
  await new Promise(f => testController.onDidChangeTestItem(f));

  await testController.run();
  expect(vscode.window.activeTextEditor.renderDecorations('  ')).toBe(`
    --------------------------------------------------------------
    
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #1
    --------------------------------------------------------------
    
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [4:18 - 4:18]: decorator #1
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [4:18 - 4:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [4:18 - 4:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [5:18 - 5:18]: decorator #1
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [4:18 - 4:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    --------------------------------------------------------------
    [3:18 - 3:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [4:18 - 4:18]: decorator #2 {"after":{"contentText":" — Xms"}}
    [5:18 - 5:18]: decorator #2 {"after":{"contentText":" — Xms"}}
  `);
});
