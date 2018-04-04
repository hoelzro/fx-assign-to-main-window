let previousBeforeNavigateByTab = {};

browser.webNavigation.onCommitted.addListener(async (details) => {
    if(details.transitionType != 'link') {
        return;
    }
    if(details.transitionQualifiers.includes('forward_back')) {
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
        console.log('from external!');
    }
});

browser.webNavigation.onBeforeNavigate.addListener((details) => {
    previousBeforeNavigateByTab[details.tabId] = details.url;
});

// XXX clean up previousBeforeNavigateByTab
