let previousBeforeNavigateByTab = {};
let hitNewTab = {};

browser.webNavigation.onCommitted.addListener(async (details) => {
    if(details.transitionType != 'link') {
        return;
    }
    if(details.transitionQualifiers.includes('forward_back')) {
        return;
    }
    if(hitNewTab[details.tabId]) {
        return;
    }
    if(details.url.startsWith('moz-extension://')) {
        return;
    }

    let wasRedirect = details.transitionQualifiers.includes('server_redirect');

    let visits;

    if(wasRedirect && details.tabId in previousBeforeNavigateByTab) {
        visits = await browser.history.getVisits({
            url: previousBeforeNavigateByTab[details.tabId]
        });
    } else {
        visits = await browser.history.getVisits({
            url: details.url
        });
    }

    if(visits.length == 0) {
        return;
    }

    let latestVisit = visits[0];

    if(latestVisit.referringVisitId == -1) {
        let windows = await browser.windows.getAll({
            populate: false,
            windowTypes: ['normal'],
        });
        let mainWindowId = windows.map(w => w.id).reduce((accum, value) => Math.min(accum, value));
        if(details.windowId != mainWindowId) {
            browser.tabs.move(details.tabId, {
                windowId: mainWindowId,
                index: -1,
            });
        }
    }
});

browser.webNavigation.onBeforeNavigate.addListener((details) => {
    previousBeforeNavigateByTab[details.tabId] = details.url;
});

browser.tabs.onRemoved.addListener((tabId, _) => {
    delete previousBeforeNavigateByTab[tabId];
    delete hitNewTab[tabId];
});

browser.tabs.onCreated.addListener(tab => {
    if(tab.url == 'about:newtab') {
        hitNewTab[tab.id] = true;
    }
});
