/* lovely 100% AI code*/
const lockBtn = document.getElementById('lock-in');
const animDiv = document.getElementById('lock-animation');

lockBtn.addEventListener('mousedown', () => {
    // Remove the class first in case it's already there (failsafe)
    animDiv.classList.remove('play-lock-anim');

    // Trigger a "reflow" so the browser notices the class was removed
    void animDiv.offsetWidth;

    // Add the class to start the animation
    animDiv.classList.add('play-lock-anim');
});

// Optional: Clean up after the animation finishes
animDiv.addEventListener('animationend', () => {
    animDiv.classList.remove('play-lock-anim');
});
const delay = ms => new Promise(res => setTimeout(res, ms));
/* end of the lovely 100% AI code */

function incognitoName(playerName, playerAgent) {
    if (playerName === "@@@") {
        return playerAgent
    } else {
        return playerName
    }
}

function cutOffName(name) {
    if (name.length <= 13) {
        return name
    } else {
        return name.slice(0, 10) + "..."
    }
}

let lockedAgents = []

function locked(lockState, agent, imageElement, hoverAnimation) {
    imageElement.classList.remove('select-agent-animation');
    if (lockState === "") {
        hoverAnimation.style.visibility = "hidden"
        imageElement.src = "Picking.png"
    } else if (lockState === "selected") {
        hoverAnimation.style.visibility = "visible"
        imageElement.src = "/Img/" + agent + ".png"
        void imageElement.offsetWidth;
        imageElement.classList.add('select-agent-animation');
    } else {
        lockedAgents.push(agent)
        document.getElementById(agent).style.filter = "brightness(0.5)"
        document.getElementById(agent + "-outline").onclick = "null"
        hoverAnimation.style.visibility = "hidden"
        imageElement.src = "/Img/" + agent + ".png"
        //document.getElementById(agent).style.filter = "grayscale(100%)"
    }
}


let currentAgentID = ""
let currentAgent = ""
let picked = false

const agents = [
    "Astra",
    "Breach",
    "Brimstone",
    "Chamber",
    "Clove",
    "Cypher",
    "Deadlock",
    "Fade",
    "Gekko",
    "Harbor",
    "Iso",
    "Jett",
    "KAYO",
    "Killjoy",
    "Miks",
    "Neon",
    "Omen",
    "Phoenix",
    "Raze",
    "Reyna",
    "Sage",
    "Skye",
    "Sova",
    "Tejo",
    "Veto",
    "Viper",
    "Vyse",
    "Waylay",
    "Yoru"
]

let agentDataCache = null;

async function getAgentID(name) {
    if (!agentDataCache) {
        let agentResponse = await fetch("https://valorant-api.com/v1/agents")
        let data = await agentResponse.json()
        agentDataCache = data["data"]
    }

    if (name === "KAYO") {
        return "601dbbe7-43ce-be57-2a40-4abd24953621"
    }
    else {
        for (let agent of agentDataCache) {
            if (agent["displayName"] === name) {
                return agent["uuid"]
            }
        }
    }
}

async function selectAgent(name) {
    if (!picked) {
        let agentID = await getAgentID(name)
        currentAgentID = agentID;
        currentAgent = name
        fetch("http://localhost:560/select/" + agentID, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        afterSelect(name)
    }
}

async function lockAgent() {
    let agentSelector = document.getElementById("agents")
    agentSelector.classList.remove('agent-selector-animation');
    let agentCards = document.getElementById("agent-cards")
    agentCards.classList.remove('agent-cards-down-animation');

    picked = true
    let images = document.querySelectorAll(".agent-images")
    images.forEach (img => {
        img.style.filter = "brightness(50%)"
        img.style.pointerEvents = "none"
    })
    let outlines = document.querySelectorAll(".agent-outlines")
    outlines.forEach (outline => {
        outline.onclick = null
        outline.style.cursor = "default"
    })


    document.getElementById("lock-in").style.height = "120px"
    document.getElementById("lock-in").style.top = "134px"
    document.getElementById("lock-in").style.borderTopLeftRadius = "0"
    document.getElementById("lock-in").style.borderTopRightRadius = "0"
    document.getElementById("lock-in").style.backgroundColor = "white"
    document.getElementById("lock-in-text").style.color = "black"
    document.getElementById("lock-in-text").style.fontSize = "30px"
    document.getElementById("lock-in").onclick = null
    document.getElementById("lock-in").style.pointerEvents = "none"
    imageElement = document.getElementById("you")
    hoverElement = document.getElementById("you-hover")
    fetch("http://localhost:560/lock/" + currentAgentID)
    locked("locked", currentAgent, imageElement, hoverElement)
    void agentSelector.offsetWidth;
    agentSelector.classList.add('agent-selector-animation');
    void agentCards.offsetWidth;
    agentCards.classList.add('agent-cards-down-animation');
}

async function agentOutlineColor(agent) {
    let agentKDA = 1.00 // get agent KDA
    if (agentKDA >= 1.00) {
        return "green"
    } else if (agentKDA >= 0.75) {
        return "yellow"
    } else if (agentKDA <= 0.75) {
        return "red"
    } else {
        return "gray"
    }
}

function doNothing() {null}

async function addAgents() {
    const agentsList = document.getElementById("agents")
    for (let agent of agents) {

        let agentImg = document.createElement("div");


        agentImg.className = "agent-outlines"
        agentImg.id = `${agent}-outline`
        agentImg.style.outlineStyle = "solid"
        agentImg.style.outlineWidth = "2px"
        agentImg.style.outlineColor =  "#ffffff" //agentOutlineColor(agent)

        agentImg.innerHTML = `<img src='/Img/${agent}.png' class='agent-images' id='${agent}' alt='${agent}'>`


        if (agent in lockedAgents) {
            agentImg.onclick = function () {
                doNothing()
            }
        } else {
            agentImg.onclick = function () {
                selectAgent(agent)
            }
        }

        agentsList.appendChild(agentImg)
    }
}

const agentBackgrounds = {
    "Astra": "#26146c",
    "Breach": "#81331a",
    "Brimstone": "#363c4f",
    "Chamber": "#20435b",
    "Clove": "#4b1d80",
    "Cypher": "#2f5078",
    "Deadlock": "#425495",
    "Fade": "#1d2846",
    "Gekko": "#371c5c",
    "Harbor": "#275146",
    "Iso": "#30336e",
    "Jett": "#25607a",
    "KAY/O": "#1c2a69",
    "KAYO": "#522162",
    "Killjoy": "#413476",
    "Miks": "#462b75",
    "Neon": "#413476",
    "Omen": "#433178",
    "Phoenix": "#74321c",
    "Raze": "#742e1e",
    "Reyna": "#662d62",
    "Sage": "#1f5148",
    "Skye": "#436a51",
    "Sova": "#355285",
    "Tejo": "#80451b",
    "Veto": "#1a5d65",
    "Viper": "#1a5f46",
    "Vyse": "#492280",
    "Waylay": "#482e61",
    "Yoru": "#222b67"
}

async function changeBackground(agent) {
    let middleContainer =document.getElementById("middle-container")
    document.getElementById("agent-background").src=`/Img/${agent}Portrait.png`
    document.getElementById("agent-text-background").src=`/Img/${agent}Background.png`
    middleContainer.style.background = `linear-gradient(135deg, #0f1923 0%, ${agentBackgrounds[agent]} 100%)`
}

async function afterSelect(agent){
    document.getElementById("lock-in").style.pointerEvents = "auto";
    document.getElementById("lock-in").style.backgroundColor = "red"
    changeBackground(agent)
    locked("selected", agent, document.getElementById("you"), document.getElementById("you-hover"))
}

addAgents()


async function timerCountDown() {
    for (let countUp = 0; 86 > countUp; countUp++) {
        document.getElementById("timer-text").innerText = 85 - countUp;
        await delay(1000)
    }
}

timerCountDown()

agentsAdded = []
async function removeAllAgentImages() {
    if (agentsAdded.length === 0) {
        agents.forEach(agent => document.getElementById(agent + "-outline").remove())
    } else {
        console.log(agentsAdded)
        agentsAdded.forEach(agent => document.getElementById(agent + "-outline").remove())
        agentsAdded = []
    }
}

async function removeRoleFilters() {
    removeAllAgentImages()
    addAgents()
}

async function addOneAgent(agentName) {
    let agentImg = document.createElement("div");

    agentImg.className = "agent-outlines"
    agentImg.id = `${agentName}-outline`
    agentImg.style.outlineStyle = "solid"
    agentImg.style.outlineWidth = "2px"
    agentImg.style.outlineColor =  "#ffffff" //agentOutlineColor(agent)

    agentImg.innerHTML = `<img src='/Img/${agentName}.png' class='agent-images' id='${agentName}' alt='${agentName}'>`

    if (agentName in lockedAgents) {
        agentImg.onclick = function () {
            doNothing()
        }
    } else {
        agentImg.onclick = function () {
            selectAgent(agentName)
        }
    }

    document.getElementById("agents").appendChild(agentImg)
}

async function filterRoles(role) {
    if (!picked) {
    removeAllAgentImages()
        for (let agent of agents) {
            let agentData = await fetch("https://valorant-api.com/v1/agents/" + await getAgentID(agent)).then(response => response.json())
            if (agentData["data"]["role"]["displayName"] === role) {
                if (agentData["data"]["displayName"] === "KAY/O") {
                    agentsAdded.push("KAYO")
                    await addOneAgent("KAYO")
                } else {
                    agentsAdded.push(agentData["data"]["displayName"])
                    await addOneAgent(agentData["data"]["displayName"])
                }
            }
        }
    }
}



let player1Img = document.getElementById("player-1")
let player1Name = document.getElementById("name-player-1")
let player1Agent = document.getElementById("agent-player-1")
let player1Hover = document.getElementById("player-1-hover")

let dataPlayer1Name = "Miksmain100"
let dataPlayer1Agent = "Picking"
let dataPlayer1LockState = ""

locked(dataPlayer1LockState, dataPlayer1Agent, player1Img, player1Hover)
player1Name.innerText = cutOffName(incognitoName(dataPlayer1Name, dataPlayer1Agent))
player1Agent.innerText = dataPlayer1Agent


let player2Img = document.getElementById("player-2")
let player2Name = document.getElementById("name-player-2")
let player2Agent = document.getElementById("agent-player-2")
const player2Hover = document.getElementById("player-2-hover");

let dataPlayer2Name = "I miss her"
let dataPlayer2Agent = "Picking"
let dataPlayer2LockState = ""

locked(dataPlayer2LockState, dataPlayer2Agent, player2Img, player2Hover)
player2Name.innerText = cutOffName(incognitoName(dataPlayer2Name, dataPlayer2Agent))
player2Agent.innerText = dataPlayer2Agent


let youImg = document.getElementById("you")
let youName = document.getElementById("name-you")
const youHover = document.getElementById("you-hover");

let dataYouName = "Chips"
let dataYouAgent = "Picking"
let dataYouLockState = ""

if (dataYouLockState === "") {
    document.getElementById("lock-in").style.pointerEvents = "none"
    document.getElementById("lock-in").style.backgroundColor = "black"
}

locked(dataYouLockState, dataYouAgent, youImg, youHover)
youName.innerText = dataYouName


let player4Img = document.getElementById("player-4")
let player4Name = document.getElementById("name-player-4")
let player4Agent = document.getElementById("agent-player-4")
const player4Hover = document.getElementById("player-4-hover");

let dataPlayer4Name = "@@@"
let dataPlayer4Agent = "Jett"
let dataPlayer4LockState = "locked"

locked(dataPlayer4LockState, dataPlayer4Agent, player4Img, player4Hover)
player4Name.innerText = cutOffName(incognitoName(dataPlayer4Name, dataPlayer4Agent))
player4Agent.innerText = dataPlayer4Agent


let player5Img = document.getElementById("player-5")
let player5Name = document.getElementById("name-player-5")
let player5Agent = document.getElementById("agent-player-5")
const player5Hover = document.getElementById("player-5-hover");

let dataPlayer5Name = "looong name!!!"
let dataPlayer5Agent = "Picking"
let dataPlayer5LockState = ""

locked(dataPlayer5LockState, dataPlayer5Agent, player5Img, player5Hover)
player5Name.innerText = cutOffName(incognitoName(dataPlayer5Name, dataPlayer5Agent))
player5Agent.innerText = dataPlayer5Agent