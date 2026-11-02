
const originalDrivers = [
    { name: "Макс Верстапен", team: "Red Bull", speed: 322, skill: 95 },
    { name: "Ландо Норис", team: "McLaren", speed: 319, skill: 92 },
    { name: "Шарл Леклер", team: "Ferrari", speed: 320, skill: 91 },
    { name: "Луис Хамилтон", team: "Ferrari", speed: 318, skill: 94 },
    { name: "Оскар Пјастри", team: "McLaren", speed: 317, skill: 89 },
    { name: "Џорџ Расел", team: "Mercedes", speed: 316, skill: 88 },
    { name: "Карлос Саинц", team: "Williams", speed: 315, skill: 90 },
    { name: "Фернандо Алонсо", team: "Aston Martin", speed: 314, skill: 93 },
    { name: "Пјер Гасли", team: "Alpine", speed: 312, skill: 86 },
    { name: "Јуки Цунода", team: "Racing Bulls", speed: 311, skill: 85 }
];

const tires = {
    soft: { name: "Меки", bonus: -1.5 },
    hard: { name: "Тврди", bonus: 1 }
};

let drivers = [];
let raceStarted = false;

function createDrivers() {
    drivers = originalDrivers.map((driver, index) => {
        return {
            ...driver,
            totalTime: 0,
            lapTime: 0,
            tire: index % 2 === 0 ? "soft" : "hard",
            hasPitted: false,
            pitLap: 3 + Math.floor(Math.random() * 5),
            status: "На старт"
        };
    });
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remaining = (seconds % 60).toFixed(2);

    return minutes + ":" + remaining.padStart(5, "0");
}

function showStartTable() {
    let html = `<table>
    <tr>
        <th>Возач</th>
        <th>Тим</th>
        <th>Брзина</th>
        <th>Вештина</th>
        <th>Гуми</th>
    </tr>`;

    drivers.forEach(driver => {
        html += `<tr>
            <td>${driver.name}</td>
            <td>${driver.team}</td>
            <td>${driver.speed}</td>
            <td>${driver.skill}</td>
            <td>${tires[driver.tire].name}</td>
        </tr>`;
    });

    html += "</table>";

    document.getElementById("startTable").innerHTML = html;
}

function showLapTable(lap, safetyCar) {
    let sortedDrivers = [...drivers].sort(
        (a, b) => a.totalTime - b.totalTime
    );

    let html = `<h3>${lap}. круг`;

    if (safetyCar) {
        html += " - БЕЗБЕДНОСНО ВОЗИЛО";
    }

    html += `</h3>
    <table>
    <tr>
        <th>Позиција</th>
        <th>Возач</th>
        <th>Тим</th>
        <th>Време во круг</th>
        <th>Вкупно време</th>
        <th>Гуми</th>
        <th>Статус</th>
    </tr>`;

    sortedDrivers.forEach((driver, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td>${driver.name}</td>
            <td>${driver.team}</td>
            <td>${driver.lapTime.toFixed(2)} s</td>
            <td>${formatTime(driver.totalTime)}</td>
            <td>${tires[driver.tire].name}</td>
            <td>${driver.status}</td>
        </tr>`;
    });

    html += "</table>";

    document.getElementById("raceResults").innerHTML += html;
}

function startRace() {
    if (raceStarted) return;

    raceStarted = true;

    document.getElementById("startButton").disabled = true;
    document.getElementById("raceResults").innerHTML = "";

    document.getElementById("message").innerHTML =
        "Трката е започната!";

    for (let lap = 1; lap <= 10; lap++) {

        let safetyCar = Math.random() < 0.15;

        drivers.forEach(driver => {

            let status = [];

            let lapTime = 92 -
                (driver.speed - 300) * 0.25 -
                (driver.skill - 80) * 0.12;


            lapTime += tires[driver.tire].bonus;

            if (!driver.hasPitted && lap === driver.pitLap) {

                lapTime += 22;

                if (driver.tire === "soft") {
                    driver.tire = "hard";
                } else {
                    driver.tire = "soft";
                }

                driver.hasPitted = true;
                status.push("Пит-стоп и промена на гуми");
            }


            if (Math.random() < 0.07) {
                lapTime += 5 + Math.random() * 8;
                status.push("Извртување");
            }

            if (safetyCar) {
                lapTime += 6;
                status.push("Безбедносно возило");
            }

            driver.lapTime = lapTime;
            driver.totalTime += lapTime;

            if (status.length > 0) {
                driver.status = status.join(", ");
            } else {
                driver.status = "Нормално";
            }
        });

        showLapTable(lap, safetyCar);
    }

    finishRace();
}
function finishRace() {
    let sortedDrivers = [...drivers].sort(
        (a, b) => a.totalTime - b.totalTime
    );

    let winner = sortedDrivers[0];

    document.getElementById("winnerSection").style.display = "block";

    document.getElementById("winnerText").innerHTML =
        winner.name + " (" + winner.team + ")" +
        " - Вкупно време: " + formatTime(winner.totalTime);

    document.getElementById("message").innerHTML =
        "Трката заврши по 10 круга!";
}

function resetRace() {
    raceStarted = false;

    createDrivers();
    showStartTable();

    document.getElementById("raceResults").innerHTML =
        "Резултатите од трката ќе се прикажат тука.";

    document.getElementById("winnerSection").style.display = "none";

    document.getElementById("message").innerHTML =
        "Притисни Започни трка за да започне трката.";

    document.getElementById("startButton").disabled = false;
}

createDrivers();
showStartTable();
