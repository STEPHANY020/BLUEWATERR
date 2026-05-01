/* =========================
   BLUE WATER PREMIUM
   PARTE 1 - PANEL PRINCIPAL
   DASHBOARD + SIDEBAR + GRAFICO
========================= */

/* =========================
   BASE DE DATOS LOCAL
========================= */
const STORAGE_KEYS = {
    routes: "bluewater_routes",
    bottles: "bluewater_bottles",
    seals: "bluewater_seals",
    caps: "bluewater_caps",
    labels: "bluewater_labels",
    fuel: "bluewater_fuel",
    maintenance: "bluewater_maintenance",
    machinery: "bluewater_machinery",
    tires: "bluewater_tires",
    staff: "bluewater_staff"
};

let mainChart = null;

/* =========================
   INICIO DEL SISTEMA
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadCurrentDate();
    initializeStorage();
    updateDashboard();
});

/* =========================
   FECHA ACTUAL
========================= */
function loadCurrentDate() {
    const now = new Date();

    const formattedDate = now.toLocaleDateString("es-EC", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    document.getElementById("currentDate").innerText =
        formattedDate;
}

/* =========================
   CREAR STORAGE SI NO EXISTE
========================= */
function initializeStorage() {
    Object.values(STORAGE_KEYS).forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    });
}

/* =========================
   OBTENER REGISTROS
========================= */
function getRecords(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/* =========================
   GUARDAR REGISTRO
========================= */
function saveRecord(key, record) {
    const data = getRecords(key);

    data.push(record);

    localStorage.setItem(key, JSON.stringify(data));

    updateDashboard();
}

/* =========================
   CAMBIO DE SECCIONES
========================= */
function showSection(sectionId) {
    const sections =
        document.querySelectorAll(".content-section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const targetSection =
        document.getElementById(sectionId);

    if (targetSection) {
        targetSection.classList.add("active");
    }

    updateSectionTitle(sectionId);
}

/* =========================
   TITULOS DE SECCIÓN
========================= */
function updateSectionTitle(sectionId) {
    const titles = {
        dashboard: "Panel Principal",
        routes: "Control de Rutas",
        bottles: "Control de Botellas",
        seals: "Control de Sellos",
        caps: "Control de Tapas",
        labels: "Control de Etiquetas",
        fuel: "Control de Combustibles",
        maintenance: "Control de Mantenimiento",
        machinery: "Control de Maquinaria",
        tires: "Control de Llantas",
        staff: "Control de Personal"
    };

    document.getElementById("sectionTitle").innerText =
        titles[sectionId] || "Panel Principal";
}

/* =========================
   DASHBOARD
========================= */
function updateDashboard() {
    const routes = getRecords(STORAGE_KEYS.routes);
    const bottles = getRecords(STORAGE_KEYS.bottles);
    const seals = getRecords(STORAGE_KEYS.seals);
    const caps = getRecords(STORAGE_KEYS.caps);
    const labels = getRecords(STORAGE_KEYS.labels);
    const fuel = getRecords(STORAGE_KEYS.fuel);
    const maintenance = getRecords(STORAGE_KEYS.maintenance);
    const machinery = getRecords(STORAGE_KEYS.machinery);
    const tires = getRecords(STORAGE_KEYS.tires);
    const staff = getRecords(STORAGE_KEYS.staff);

    /* RUTAS TOTAL */
    const routesTotal = routes.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
    );

    /* INVENTARIO TOTAL */
    const bottlesTotal = bottles.length;
    const sealsTotal = seals.length;
    const capsTotal = caps.length;
    const labelsTotal = labels.length;

    /* COMBUSTIBLE */
    const fuelTotal = fuel.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
    );

    /* MANTENIMIENTO */
    const maintenanceTotal = maintenance.length;

    /* MAQUINARIA */
    const machineryTotal = machinery.length;

    /* LLANTAS */
    const tiresTotal = tires.length;

    /* PERSONAL */
    const staffTotal = staff.length;

    /* ACTUALIZAR HTML */
    setElementText("routesTotal", routesTotal);
    setElementText("bottlesTotal", bottlesTotal);
    setElementText("sealsTotal", sealsTotal);
    setElementText("capsTotal", capsTotal);
    setElementText("labelsTotal", labelsTotal);
    setElementText("fuelTotal", `$${fuelTotal}`);
    setElementText("maintenanceTotal", maintenanceTotal);
    setElementText("machineryTotal", machineryTotal);
    setElementText("tiresTotal", tiresTotal);
    setElementText("staffTotal", staffTotal);

    /* GRAFICO */
    updateMainChart({
        routes: routesTotal,
        bottles: bottlesTotal,
        seals: sealsTotal,
        caps: capsTotal,
        labels: labelsTotal,
        fuel: fuelTotal,
        maintenance: maintenanceTotal,
        machinery: machineryTotal,
        tires: tiresTotal,
        staff: staffTotal
    });
}

/* =========================
   ACTUALIZAR TEXTO SEGURO
========================= */
function setElementText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}

/* =========================
   GRAFICO PRINCIPAL
========================= */
function updateMainChart(data) {
    const canvas =
        document.getElementById("mainChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (mainChart) {
        mainChart.destroy();
    }

    mainChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Rutas",
                "Botellas",
                "Sellos",
                "Tapas",
                "Etiquetas",
                "Combustible",
                "Mantenimiento",
                "Maquinaria",
                "Llantas",
                "Personal"
            ],
            datasets: [
                {
                    label: "Control General Empresarial",
                    data: [
                        data.routes,
                        data.bottles,
                        data.seals,
                        data.caps,
                        data.labels,
                        data.fuel,
                        data.maintenance,
                        data.machinery,
                        data.tires,
                        data.staff
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/* =========================
   PDF GENERAL EMPRESARIAL
========================= */
function generateGeneralPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);
    doc.text(
        "BLUE WATER - REPORTE GENERAL EMPRESARIAL",
        20,
        y
    );

    y += 15;

    const modules = [
        {
            title: "RUTAS",
            key: STORAGE_KEYS.routes
        },
        {
            title: "BOTELLAS",
            key: STORAGE_KEYS.bottles
        },
        {
            title: "SELLOS",
            key: STORAGE_KEYS.seals
        },
        {
            title: "TAPAS",
            key: STORAGE_KEYS.caps
        },
        {
            title: "ETIQUETAS",
            key: STORAGE_KEYS.labels
        },
        {
            title: "COMBUSTIBLE",
            key: STORAGE_KEYS.fuel
        },
        {
            title: "MANTENIMIENTO",
            key: STORAGE_KEYS.maintenance
        },
        {
            title: "MAQUINARIA",
            key: STORAGE_KEYS.machinery
        },
        {
            title: "LLANTAS",
            key: STORAGE_KEYS.tires
        },
        {
            title: "PERSONAL",
            key: STORAGE_KEYS.staff
        }
    ];

    modules.forEach(module => {
        const records = getRecords(module.key);

        doc.setFontSize(14);

        doc.text(module.title, 20, y);

        y += 10;

        if (records.length === 0) {
            doc.setFontSize(10);

            doc.text(
                "Sin registros disponibles.",
                25,
                y
            );

            y += 8;
        } else {
            records.forEach(record => {
                const line =
                    Object.values(record).join(" | ");

                doc.setFontSize(9);

                doc.text(
                    line.substring(0, 180),
                    25,
                    y
                );

                y += 7;

                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
            });
        }

        y += 8;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save(
        "BLUE_WATER_REPORTE_GENERAL_EMPRESARIAL.pdf"
    );
}