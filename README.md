GridGuard AI: Hybrid Smart-Grid Monitoring Network
An intelligent, real-time infrastructure protection and cable theft detection platform developed for the G13 Hackathon in Sedibeng, Gauteng. GridGuard AI provides municipal control rooms and distribution operators with live SCADA-grade telemetry, predictive risk assessments and instant incident isolation capabilities to combat critical infrastructure vandalism.

📌 Problem Statement & Context
Gauteng faces severe economic and operational disruptions due to infrastructure vandalism, transformer overloads, and targeted cable theft. Among the core service delivery challenges addressed at the G13 Hackathon, infrastructure integrity and energy security remain paramount.

Traditional grid networks lack granular, real-time edge monitoring, leaving municipalities reliant on manual resident fault reporting. GridGuard AI bridges this gap by introducing a low-latency, hybrid hardware/software monitoring framework that instantly flags distribution line disruptions, maps affected endpoints, and deploys rapid response operations.

⚡ Key Features
Live SCADA Dashboard: High-fidelity control room UI designed with system status cards, a continuous real-time diagnostic log stream, and automated global state tracking.

Geospatial Grid Mapping: Interactive geospatial tracking powered by Leaflet.js, dynamically mapping power distribution substations, utility lines, and household endpoint markers.

Instant Incident Isolation: Automated edge-failure alerts that dynamically highlight severed lines in red, project local target risk vectors via active map boundary circles, and update affected home indexes instantly.

Automated Response Routing: Simulated live geolocation tracking for Municipal Response Teams, calculating transit paths and arrival times upon incident classification.

GridGuard Copilot: An embedded interactive AI chat interface capable of querying system health, cross-referencing live outage telemetry, and relaying incident logs.

🛠️ Architecture & Tech Stack
The interactive dashboard is built explicitly on a lightweight, decoupled frontend stack optimized for deployment to field-operator terminals:

Structure: Semantic HTML5 framework built for modular grid-layout scalability.

Styling: Custom CSS3 styling employing responsive CSS grids, absolute SCADA theme positioning, interactive @keyframes animations for animated power line flows, and real-time blinking alert states (.alarm-critical).

Geospatial/Logic Layer: Pure JavaScript implementation leveraging Leaflet.js for mapping vector graphics layers, alongside custom interval timers mimicking live utility load updates and state-machine transitions.

🚀 Getting Started & Installation
To run the interactive prototype locally, follow these steps:

Clone this repository to your local machine:

Bash
git clone https://github.com/YOUR_USERNAME/gridguard-ai.git
Navigate into the project directory:

Bash
cd gridguard-ai
Open the main file directly in any modern web browser:

Bash
# On macOS
open index.html

💻 Prototype Simulation Guide
Once the dashboard is open, you can demonstrate the full capability of the system using the interactive hardware/software simulation controls:

Monitor Healthy State: Observe the green utility line flow strokes indicating active, uninterrupted electricity delivery from transformers T1 and T2 to household endpoints.

Trigger Incident: Click the 🚨 Simulate Cable Theft button. This modifies the continuity loop condition dynamically, shifts the system matrix state to CRITICAL, triggers map boundary flying transitions, highlights damaged corridors, and dispatches the municipal patrol unit.

Interact with Copilot: Type queries like "status", "theft risk", or "response" into the GridGuard Copilot terminal to test the context-aware telemetry reporting.

Restore the Grid: Click ✅ Restore System to reset the SCADA memory space, return lines to active flow states, and safely return response teams to base.

👥 Team Presentation & Documentation
Challenge Identification: Addressing the critical service delivery and asset protection goals outlined during the Sedibeng G13 Hackathon.

Presentation Pitch: For a detailed breakdown of the socio-economic impact metrics, hardware continuity implementation specifications, and scalability maps, please refer to our Presentation PDF included in the root directory.

📄 License
This project is open-source and available under the MIT License.

Developed with passion for sustainable community infrastructure at the G13 Hackathon.
