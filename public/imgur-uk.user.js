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

    function handleImage(el) {
        el.src = el.src.replace ("i.imgur.com", "external-content.duckduckgo.com/iu/?u=https://i.imgur.com");
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.tagName === 'IMG') {
                        handleImage(node);
                    } else {
                        const imgElements = node.querySelectorAll && node.querySelectorAll('img');

                        if (imgElements) {
                            imgElements.forEach(handleImage);
                        }
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll('img').forEach(handleImage);
})();
