#! /usr/bin/env node
(function () {
    'use strict';

    // Read command line arguments, Initialize module and create component(s)
    const args = process.argv.slice(2),
        Reasty = require('../lib/reasty');

    let reasty = new Reasty(args);
    reasty.create();
})();
