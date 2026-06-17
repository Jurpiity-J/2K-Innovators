let currentIncident = {
    active: false,
    type: "None",
    confidence: 0,
    homesAffected: 0,
    location: "None"
};

// =======================================
// GridGuard AI - Municipal Control Center
// =======================================

const SCADA = {
    systemHealth: "NORMAL", // NORMAL | WARNING | CRITICAL
    powerLoad: 42,
    gridStability: 98,
    alarms: []
};

// =======================================
// GRID MODEL (Global State)
// =======================================

const grid = {
    transformers: [
        {
            id: "T1",
            capacityKW: 500,
            currentLoadKW: 0,
            status: "ONLINE"
        },
        {
            id: "T2",
            capacityKW: 500,
            currentLoadKW: 0,
            status: "ONLINE"
        }
    ],
    households: []
};

const logs = document.getElementById("logs");

function calculateTransformerLoads() {

    grid.transformers.forEach(transformer => {

        transformer.currentLoadKW = houses
            .filter(
                h =>
                    h.transformer === transformer.id &&
                    h.powered
            )
            .reduce(
                (sum, h) => sum + h.demandKW,
                0
            );

    });

}
setInterval(() => {
    calculateTransformerLoads();
    checkOverloads();
}, 1000);

function checkOverloads() {

    grid.transformers.forEach(transformer => {

        const utilization =
            transformer.currentLoadKW /
            transformer.capacityKW;

        if (utilization > 0.9) {

            addLog(
                `⚠ ${transformer.id} nearing overload`
            );

        }

        if (utilization > 1) {

            transformer.status = "FAULT";

            addLog(
                `🚨 ${transformer.id} overloaded`
            );

        }

    });

}

function addLog(message) {
    const li = document.createElement("li");

    const time = new Date().toLocaleTimeString();

    li.textContent = `[${time}] ${message}`;

    logs.prepend(li);
}

// =======================================
// MAP INITIALIZATION
// =======================================

const map = L.map("map").setView(
    [-23.9060, 29.4720],
    15
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap"
    }
).addTo(map);

// =======================================
// TRANSFORMERS
// =======================================

const transformer1 = L.marker(
    [-23.9045, 29.4689]
)
.addTo(map)
.bindPopup("⚡ Transformer T1");

const transformer2 = L.marker(
    [-23.9080, 29.4730]
)
.addTo(map)
.bindPopup("⚡ Transformer T2");

// =======================================
// HOUSEHOLDS
// =======================================

const houses = [
    { name: "House 1", coords: [-23.9052, 29.4695], demandKW: 8, powered: true, transformer: "T1" },
    { name: "House 2", coords: [-23.9060, 29.4705], demandKW: 12, powered: true, transformer: "T1" },
    { name: "House 3", coords: [-23.9040, 29.4710], demandKW: 16, powered: true, transformer: "T1" },
    { name: "House 4", coords: [-23.9030, 29.4690], demandKW: 14, powered: true, transformer: "T1" },
    { name: "House 5", coords: [-23.9025, 29.4720], demandKW: 9, powered: true, transformer: "T1" },

    { name: "House 6", coords: [-23.9085, 29.4735], demandKW: 8, powered: true, transformer: "T2" },
    { name: "House 7", coords: [-23.9090, 29.4745], demandKW: 8, powered: true, transformer: "T2" },
    { name: "House 8", coords: [-23.9100, 29.4755], demandKW: 8, powered: true, transformer: "T2" },
    { name: "House 9", coords: [-23.9070, 29.4760], demandKW: 8, powered: true, transformer: "T2" },
    { name: "House 10", coords: [-23.9065, 29.4740], demandKW: 8, powered: true, transformer: "T2" }
];

const houseMarkers = [];

houses.forEach(house => {

    const marker = L.marker(house.coords)
        .addTo(map)
        .bindPopup(`🏠 ${house.name}`);

    houseMarkers.push(marker);
});

// =======================================
// POWER LINES
// =======================================

const utilityLines = [];

houses.forEach((house, index) => {

    const transformerCoords =
        index < 5
            ? [-23.9045, 29.4689]
            : [-23.9080, 29.4730];

    const line = L.polyline(
        [
            transformerCoords,
            house.coords
        ],
        {
            color: "green",
            weight: 4
        }
    ).addTo(map);

    utilityLines.push(line);
});

// =======================================
// RESPONSE VEHICLE
// =======================================

const patrolVehicle = L.marker(
    [-23.9010, 29.4660]
)
.addTo(map)
.bindPopup("🚓 Municipal Response Team");

// =======================================
// INCIDENT VARIABLES
// =======================================

let theftZone = null;
let patrolInterval = null;

// =======================================
// PATROL MOVEMENT
// =======================================

function movePatrolVehicle() {

    const startLat = -23.9010;
    const startLng = 29.4660;

    const targetLat = -23.9095;
    const targetLng = 29.4750;

    let step = 0;

    patrolInterval = setInterval(() => {

        step++;

        const lat =
            startLat +
            ((targetLat - startLat) / 25) * step;

        const lng =
            startLng +
            ((targetLng - startLng) / 25) * step;

        patrolVehicle.setLatLng([lat, lng]);

        if (step >= 25) {

            clearInterval(patrolInterval);

            patrolVehicle.bindPopup(
                "🚓 Response Team Arrived"
            );
        }

    }, 300);
}

// =======================================
// THEFT SIMULATION
// =======================================

function simulateTheft() {
    updateSCADAState("CRITICAL");
    
    // Disconnect affected houses from power
    houses[7].powered = false;  // House 8
    houses[8].powered = false;  // House 9
    
    // Recalculate loads with disconnected houses
    calculateTransformerLoads();
    
    currentIncident = {
        active: true,
        type: "Cable Theft",
        confidence: 97,
        homesAffected: 2,
        location: "Distribution Corridor T2"
    };

    document.getElementById("loopStatus").textContent =
        "BROKEN";

    document.getElementById("loopStatus").className =
        "status critical";

    document.getElementById("houseB").textContent =
        "OFFLINE";

    document.getElementById("houseB").className =
        "status critical";

    document.getElementById("classification").innerHTML =
        `
        🚨 ACTIVE CABLE THEFT DETECTED
        <br><br>
        Confidence: 97%
        <br>
        Risk Level: CRITICAL
        <br>
        Classification: Cable Theft
        `;

    document.getElementById("riskScore").innerHTML =
        "Risk Score: 97%";

    document.getElementById("affectedHomes").innerHTML =
        "Affected Homes: 2";

    document.getElementById("eta").innerHTML =
        "Response ETA: 6 Minutes";

    const alertBox =
        document.getElementById("alertBox");

    alertBox.classList.add("alert-active");

    alertBox.innerHTML =
        `
        <h3>🚨 CRITICAL ALERT</h3>

        <p><strong>Incident:</strong> Cable Theft Detected</p>

        <p><strong>Zone:</strong> Distribution Corridor T2</p>

        <p><strong>Affected Homes:</strong> 2</p>

        <p><strong>Response:</strong> Team Dispatched</p>
        `;

    utilityLines[7].setStyle({
        color: "red",
        weight: 8
    });

    utilityLines[8].setStyle({
        color: "red",
        weight: 8
    });

    if (!theftZone) {

        theftZone = L.circle(
            [-23.9095, 29.4750],
            {
                radius: 80,
                color: "red",
                fillColor: "red",
                fillOpacity: 0.35
            }
        ).addTo(map);

        map.flyTo(
            [-23.9095, 29.4750],
            17
        );
    }

    movePatrolVehicle();

    addLog("🚨 Cable theft detected.");
    addLog("⚠ CTM001 continuity loop failure.");
    addLog("📡 Municipality notified.");
    addLog("📱 Residents alerted.");
    addLog("🚓 Response team dispatched.");
    addLog("🤖 AI classified incident with 97% confidence.");
}

function updateSCADAState(state) {

    const body = document.body;

    body.classList.remove("alarm-critical", "alarm-warning");

    SCADA.systemHealth = state;

    if (state === "CRITICAL") {
        body.classList.add("alarm-critical");
    }

    if (state === "WARNING") {
        body.classList.add("alarm-warning");
    }
}

function animatePowerFlow(line) {

    let i = 0;

    const interval = setInterval(() => {
        i = (i + 1) % 100;

        line.setStyle({
            color: i > 85 ? "#ff3b3b" : "#00ff9d",
            weight: i > 85 ? 6 : 3,
            opacity: i > 85 ? 1 : 0.7
        });

    }, 200);

    return interval; // important for SCADA control later
}
utilityLines.forEach(line => {
    animatePowerFlow(line);
});

// =======================================
// RESTORE SYSTEM
// =======================================

function restoreSystem() {
    // Restore power to affected houses
    houses[7].powered = true;   // House 8
    houses[8].powered = true;   // House 9
    
    // Recalculate loads with restored houses
    calculateTransformerLoads();
    
    currentIncident = {
        active: false,
        type: "None",
        confidence: 0,
        homesAffected: 0,
        location: "None"
    };

    document.getElementById("loopStatus").textContent =
        "INTACT";

    document.getElementById("loopStatus").className =
        "status normal";

    document.getElementById("houseB").textContent =
        "POWERED";

    document.getElementById("houseB").className =
        "status normal";

    document.getElementById("classification").innerHTML =
        `
        ✅ System Healthy
        <br><br>
        Confidence: 0%
        <br>
        Risk Level: LOW
        `;

    document.getElementById("riskScore").innerHTML =
        "Risk Score: 12%";

    document.getElementById("affectedHomes").innerHTML =
        "Affected Homes: 0";

    document.getElementById("eta").innerHTML =
        "Response ETA: --";

    const alertBox =
        document.getElementById("alertBox");

    alertBox.classList.remove("alert-active");

    alertBox.innerHTML =
        "No active incidents";

    utilityLines.forEach(line => {

        line.setStyle({
            color: "green",
            weight: 4
        });

    });

    if (theftZone) {

        map.removeLayer(theftZone);

        theftZone = null;
    }

    if (patrolInterval) {
        clearInterval(patrolInterval);
    }

    patrolVehicle.setLatLng(
        [-23.9010, 29.4660]
    );

    map.flyTo(
        [-23.9060, 29.4720],
        15
    );

    addLog("✅ System restored.");
}

// =======================================
// STARTUP LOGS
// =======================================

addLog("GridGuard AI Initialized.");
addLog("Transformer T1 Connected.");
addLog("Transformer T2 Connected.");
addLog("10 Household Endpoints Online.");
addLog("CTM001 Monitoring Active.");
addLog("Municipal Control Center Ready.");

function sendMessage() {

    const input =
        document.getElementById("userInput");

    const message =
        input.value.trim();

    if(!message) return;

    const chat =
        document.getElementById("chatMessages");

    chat.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    const question =
        message.toLowerCase();

    let response =
        "System operating normally.";

    if(question.includes("status")){

        if(currentIncident.active){

            response =
            `Current Incident: ${currentIncident.type}.
            Confidence: ${currentIncident.confidence}%.
            Location: ${currentIncident.location}.`;

        }else{

            response =
            "All transformers and household endpoints are operating normally.";

        }

    }

    else if(question.includes("theft")){

        if(currentIncident.active){

            response =
            `Cable theft has been detected near ${currentIncident.location}. ${currentIncident.homesAffected} households are affected.`;

        }else{

            response =
            "No active cable theft incidents have been detected.";

        }

    }

    else if(question.includes("risk")){

        response =
        "Current network risk score is 12%. No critical threats detected.";

    }

    else if(question.includes("response")){

        if(currentIncident.active){

            response =
            "Municipal response team has been dispatched. Estimated arrival time is 6 minutes.";

        }else{

            response =
            "No response teams currently deployed.";

        }

    }

    else if(question.includes("ctm001")){

        response =
        "CTM001 continuity monitoring is active and monitoring cable integrity.";

    }

    chat.innerHTML += `
        <div class="bot-message">
            ${response}
        </div>
    `;

    input.value = "";

    chat.scrollTop =
        chat.scrollHeight;
}
