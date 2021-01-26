const presence = new Presence({
  clientId: "802246778010730548"
}),
  SelectorMap: { [index: string]: string } = {
    Red: 'div#sbettors1 > span.redtext > strong',
    Blue: 'div#sbettors2 > span.bluetext > strong',
    estatus: '#betstatus',
    tmode: 'span#tournament-note',
    emode: 'div#footer-alert',
    betRed: 'span#lastbet.dynamic-view > span.redtext',
    betBlue: 'span#lastbet.dynamic-view > span.bluetext',
    prize: 'span#lastbet.dynamic-view > span.greentext',
    oddsRed: 'span#lastbet.dynamic-view > span.redtext:nth-last-child(2)',
    oddsBlue: 'span#lastbet.dynamic-view > span.bluetext:nth-last-child(1)'
  }, browsingStamp = Math.floor(Date.now() / 1000);

let blueCheck = "", redCheck = "";

function getText(selector: string) {
  if (document.querySelector(selector) !== null)
    return document.querySelector(selector).textContent;
  else
    return null;
}

presence.on("UpdateData", async () => {
  const presenceData: PresenceData = {
    largeImageKey: "salty"
  };

  if (document.location.pathname == "/" || document.location.pathname == "/index") {
    if(redCheck == getText(SelectorMap['Red']) || blueCheck == getText(SelectorMap['Blue'])) {
      blueCheck = getText(SelectorMap['Blue']) + "‎";
      redCheck = getText(SelectorMap['Red']) + "‎";
    }

    presenceData.startTimestamp = browsingStamp;

    const tmode = getText(SelectorMap['tmode']), emode = getText(SelectorMap['emode']);

    if (tmode !== null || emode.includes("bracket!") || emode.includes("FINAL")) {
      presenceData.smallImageKey = "trofeo";
      presenceData.smallImageText = "Tournament Mode";
    } else if (emode.includes("exhibition") || emode.includes("Exhibition")) {
      presenceData.smallImageKey = "saltgirl";
      presenceData.smallImageText = "Exhibition Mode";
    } else {
      presenceData.smallImageKey = "salero";
      presenceData.smallImageText = "Matchmaking Mode";
    }

    presenceData.details = redCheck + " VS " + blueCheck;

    if (!getText(SelectorMap['estatus']).includes("OPEN!")) {
      if (!getText(SelectorMap['estatus']).includes("Payouts")) {
        if ((getText(SelectorMap['betRed']) + getText(SelectorMap['betBlue'])).includes("$")) {
          if (getText(SelectorMap['betRed']).includes('$'))
            presenceData.state = getText(SelectorMap['betRed']) + "(Red) → " + getText(SelectorMap['prize']) + " | " + getText(SelectorMap['oddsRed']) + ":" + getText(SelectorMap['oddsBlue']);
          else
            presenceData.state = getText(SelectorMap['betBlue']) + "(Blue) → " + getText(SelectorMap['prize']) + " | " + getText(SelectorMap['oddsRed']) + ":" + getText(SelectorMap['oddsBlue']);
        } else
          presenceData.state = "Odds: " + getText(SelectorMap['oddsRed']) + ":" + getText(SelectorMap['oddsBlue']);
      } else
        presenceData.state = getText(SelectorMap['estatus']);
    } else
      presenceData.state = getText(SelectorMap['estatus']);
    presence.setActivity(presenceData);
  } else if (document.location.pathname.includes("/authenticate")) {
    presenceData.details = "Signing in...";
    delete presenceData.startTimestamp;
  }
  if (presenceData.details == null) {
    presence.setTrayTitle();
    presence.setActivity();
  } else {
    presence.setActivity(presenceData);
    if (document.location.pathname == "/" || document.location.pathname == "/index") {
      blueCheck = getText(SelectorMap['Blue']);
      redCheck = getText(SelectorMap['Red']);
    }
  }
});