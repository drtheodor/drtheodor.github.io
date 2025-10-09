// ==UserScript==
// @name         Theo's amazing imgur fix for UK
// @description     Fix UK imgur links,
// @namespace    http://theo.is-a.dev/
// @version      2025-10-09
// @author       theoretically
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const allATags = document.querySelectorAll('img');
    allATags.forEach((el,idx) => {
        console.log(el);
        el.src = el.src.replace ("i.imgur.com", "external-content.duckduckgo.com/iu/?u=https://i.imgur.com");;
    });
})();
