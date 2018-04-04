browser.webNavigation.onCommitted.addListener(details => {
    if(details.transitionType != 'link') {
        return;
    }
    if(details.transitionQualifiers.includes('forward_back')) {
        return;
    }

    console.log(details);
});
