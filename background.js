browser.webNavigation.onCommitted.addListener(async (details) => {
    if(details.transitionType != 'link') {
        return;
    }
    if(details.transitionQualifiers.includes('forward_back')) {
        return;
    }

    let visits = await browser.history.getVisits({
        url: details.url
    });

    if(visits.length == 0) {
        return;
    }

    let latestVisit = visits[0];
});
