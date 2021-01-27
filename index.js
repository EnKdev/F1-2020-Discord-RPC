const Client = require("discord-rich-presence")(/* Your Client ID here */);
const {F1TelemetryClient, constants} = require("f1-telemetry-client");
const {app, BrowserWindow} = require("electron");
const {PACKETS} = constants;

const Tracks = require("./config/tracks.json");
const Session = require("./config/SessionType.json");
const CarType = require("./config/CarType.json")
const LargeImage = require("./config/imageTrack.json");

const f1Client = new F1TelemetryClient();

let date = Date.now();
let interval;

f1Client.start();

resetStatus = () => {
    Client.updatePresence({
        state: "In the paddocks",
        largeImageKey: "backcover",
        startTimestamp: date
    });
};

f1Client.on(PACKETS.session, (sData) => {
        if (interval)
            clearInterval(interval);

        Client.updatePresence({
            details: `${CarType[sData.m_formula].CarType}`,
            state: `${Session[sData.m_sessionType].Type} - ${
                Tracks[sData.m_trackId].Name
            }`,
            smallImageKey: "backcover",
            smallImageText: "F1 2020",
            largeImageKey: `${LargeImage[sData.m_trackId].imageKey}`,
            largeImageText: `Racing on ${Tracks[sData.m_trackId].Name}`
        });

        console.log(sData);
        interval = setInterval(() => {
            resetStatus();
        }, 5000);
});

Client.updatePresence({
    state: "In the paddocks",
    largeImageKey: "backcover",
    startTimestamp: date
});

// Electron
function createWindow() {
    const win = new BrowserWindow({
        width: 300,
        height: 150,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        icon: "./assets/icons/win/icon.ico"
    });

    win.loadFile("index.html");
}

app.whenReady().then(createWindow);