// ==UserScript==
// @name         Theo's amazing fix for JetBrains
// @description     Fix access to JetBrains.
// @namespace    http://theo.is-a.dev/
// @version      2025-11-18
// @author       theoretically
// @match        https://plugins.jetbrains.com/files/*
// @match        https://download.jetbrains.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

(function() {
    'use strict';

    const l = window.location;
    const h = l.hostname;
    const prefix = h.substring(0, h.indexOf('.'));

    function go(u) {
        l.replace(l.protocol + '//' + u + '.jetbrains.com' + l.pathname);
        setTimeout(() => history.back(), 2000);
    }

    if (prefix === 'plugins') {
        go('downloads.marketplace');
    } else if (prefix === 'download') {
        go('download-cdn');
    }
})();
