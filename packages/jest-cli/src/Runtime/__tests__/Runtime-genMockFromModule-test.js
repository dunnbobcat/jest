/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+jsinfra
 */
'use strict';

jest.disableAutomock();
jest.mock(
  'jest-environment-jsdom',
  () => require('../../../__mocks__/jest-environment-jsdom')
);

let createRuntime;

describe('Runtime', () => {

  beforeEach(() => {
    createRuntime = require('createRuntime');
  });

  describe('genMockFromModule', () => {
    it('does not cause side effects in the rest of the module system when generating a mock', () =>
      createRuntime(__filename).then(runtime => {
        const testRequire = runtime.requireModule.bind(
          runtime,
          runtime.__mockRootPath
        );

        const module = testRequire('RegularModule');
        const origModuleStateValue = module.getModuleStateValue();

        expect(origModuleStateValue).toBe('default');

        // Generate a mock for a module with side effects
        const mock = module.jest.genMockFromModule('ModuleWithSideEffects');

        // Make sure we get a mock.
        expect(mock.fn()).toBe(undefined);
        expect(module.getModuleStateValue()).toBe(origModuleStateValue);
      })
    );
  });
});
