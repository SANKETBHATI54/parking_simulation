/* =========================================================
   SMART PARK
   Vanilla JavaScript Version
========================================================= */


/* =========================================================
   INITIAL DATA
========================================================= */

let parkingLots = [];

for (let i = 1; i <= 15; i++) {

    parkingLots.push({

        id: "lot-" + i,

        number: "A-" + i,

        status: Math.random() > 0.3
            ? "available"
            : "booked",

        price: 50,

        location:
            "Zone 1, Level " +
            (Math.floor((i - 1) / 5) + 1)

    });

}


let customers = [

    {
        id: "c-1",
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 98765 43210",
        status: "verified",
        joinedDate: "2026-09-01"
    },

    {
        id: "c-2",
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "+91 98765 43211",
        status: "verified",
        joinedDate: "2026-09-03"
    },

    {
        id: "c-3",
        name: "Amit Singh",
        email: "amit@example.com",
        phone: "+91 98765 43212",
        status: "suspended",
        joinedDate: "2026-09-05"
    }

];


let bookings = [

    {
        id: "b-1",
        lotNumber: "A-1",
        customerName: "Rahul Sharma",
        customerEmail: "rahul@example.com",
        customerPhone: "+91 98765 43210",
        amount: 50,
        date: "2026-09-08",
        status: "active"
    },

    {
        id: "b-2",
        lotNumber: "A-3",
        customerName: "Priya Sharma",
        customerEmail: "priya@example.com",
        customerPhone: "+91 98765 43211",
        amount: 50,
        date: "2026-09-08",
        status: "active"
    },

    {
        id: "b-3",
        lotNumber: "A-7",
        customerName: "Amit Singh",
        customerEmail: "amit@example.com",
        customerPhone: "+91 98765 43212",
        amount: 50,
        date: "2026-09-09",
        status: "completed"
    }

];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentUser = null;

let selectedLot = null;

let currentPaymentMethod = "upi";

let revenueChart = null;

let occupancyChart = null;


/* =========================================================
   DOM HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function show(id) {

    $(id).classList.remove("hidden");

}


function hide(id) {

    $(id).classList.add("hidden");

}


/* =========================================================
   LOGIN
========================================================= */

function switchLoginTab(type) {

    if (type === "customer") {

        $("customerTab").classList.add("active");

        $("adminTab").classList.remove("active");

        show("customerLoginForm");

        hide("adminLoginForm");

    }

    else {

        $("adminTab").classList.add("active");

        $("customerTab").classList.remove("active");

        show("adminLoginForm");

        hide("customerLoginForm");

    }

}


function customerLogin(event) {

    event.preventDefault();

    const name =
        $("customerName").value.trim();

    const email =
        $("customerEmail").value.trim();

    const phone =
        $("customerPhone").value.trim();


    if (!name || !email || !phone) {

        alert("Please fill all customer fields.");

        return;

    }


    currentUser = {

        role: "customer",

        name: name,

        email: email,

        phone: phone

    };


    updateHeader();

    showView("customerDashboard");

    renderParkingLots();

}


function adminLogin(event) {

    event.preventDefault();

    const id =
        $("adminId").value.trim();

    const password =
        $("adminPassword").value;


    if (id !== "admin" || password !== "password") {

        alert(
            "Demo Admin Login:\n\nID: admin\nPassword: password"
        );

        return;

    }


    currentUser = {

        role: "admin",

        name: "Administrator",

        email: "admin@smartpark.com"

    };


    updateHeader();

    showView("adminDashboard");

    switchAdminTab("overview");

}


/* =========================================================
   HEADER
========================================================= */

function updateHeader() {

    if (!currentUser) {

        hide("headerUser");

        return;

    }


    show("headerUser");


    if (currentUser.role === "admin") {

        $("headerUserIcon").className =
            "fa-solid fa-shield-halved";

        $("headerUserName").textContent =
            "Admin Portal";

    }

    else {

        $("headerUserIcon").className =
            "fa-solid fa-user";

        $("headerUserName").textContent =
            currentUser.name;

    }

}


function logout() {

    currentUser = null;

    selectedLot = null;

    hide("headerUser");

    showView("loginView");

}


/* =========================================================
   VIEW MANAGEMENT
========================================================= */

function showView(viewId) {

    const views = [

        "loginView",

        "customerDashboard",

        "paymentView",

        "ticketView",

        "adminDashboard"

    ];


    views.forEach(view => {

        hide(view);

    });


    show(viewId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   PARKING LOTS
========================================================= */

function renderParkingLots() {

    const grid =
        $("parkingGrid");

    grid.innerHTML = "";


    parkingLots.forEach(lot => {

        const button =
            document.createElement("button");


        button.className =
            "parking-slot " +
            lot.status;


        if (
            selectedLot &&
            selectedLot.id === lot.id
        ) {

            button.classList.add("selected");

        }


        button.innerHTML = `

            <i class="fa-solid fa-car"></i>

            <span class="slot-number">
                ${lot.number}
            </span>

            ${
                lot.status === "available"
                ? `
                    <span class="slot-price">
                        ₹${lot.price}
                    </span>
                `
                : ""
            }

        `;


        if (lot.status === "available") {

            button.onclick = () =>
                selectParkingLot(lot.id);

        }

        else {

            button.disabled = true;

        }


        grid.appendChild(button);

    });


    updateSelectionBar();

}


function selectParkingLot(id) {

    const lot =
        parkingLots.find(
            item => item.id === id
        );


    if (!lot || lot.status !== "available") {

        return;

    }


    selectedLot = lot;

    renderParkingLots();

}


function updateSelectionBar() {

    if (!selectedLot) {

        hide("selectionBar");

        return;

    }


    show("selectionBar");


    $("selectedSlotText").textContent =
        `${selectedLot.number} - ₹${selectedLot.price}`;

}


function cancelSelection() {

    selectedLot = null;

    renderParkingLots();

}


/* =========================================================
   PAYMENT
========================================================= */

function proceedToPayment() {

    if (!selectedLot) {

        alert("Please select a parking slot first.");

        return;

    }


    $("paymentSpot").textContent =
        selectedLot.number;


    $("paymentAmount").textContent =
        "₹" + selectedLot.price.toFixed(2);


    $("payButton").textContent =
        "Pay ₹" + selectedLot.price.toFixed(2);


    hide("selectionBar");

    showView("paymentView");

}


function selectPaymentMethod(method) {

    currentPaymentMethod = method;


    const methods = [

        "upiMethod",

        "cardMethod",

        "netbankingMethod"

    ];


    methods.forEach(id => {

        $(id).classList.remove("active");

    });


    $(method + "Method")
        .classList.add("active");


    hide("upiPayment");

    hide("cardPayment");

    hide("netbankingPayment");


    if (method === "upi") {

        show("upiPayment");

    }

    else if (method === "card") {

        show("cardPayment");

    }

    else {

        show("netbankingPayment");

    }

}


function updateBankMessage() {

    const bank =
        $("selectedBank").value;


    $("bankMessage").textContent =
        `You will be securely redirected to ${bank} portal to complete payment of ₹${selectedLot.price.toFixed(2)}.`;

}


function backFromPayment() {

    showView("customerDashboard");

    renderParkingLots();

    updateSelectionBar();

}


function confirmPayment() {

    if (!selectedLot) {

        alert("No parking spot selected.");

        return;

    }


    const button =
        $("payButton");


    button.classList.add("processing");

    button.innerHTML = `
        <span class="spinner"></span>
        Processing...
    `;


    setTimeout(() => {

        createBooking();

    }, 1500);

}


/* =========================================================
   BOOKING
========================================================= */

function createBooking() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const booking = {

        id:
            "b-" +
            Date.now(),

        lotNumber:
            selectedLot.number,

        customerName:
            currentUser.name,

        customerEmail:
            currentUser.email,

        customerPhone:
            currentUser.phone,

        amount:
            selectedLot.price,

        date:
            today,

        status:
            "active"

    };


    bookings.push(booking);


    const lot =
        parkingLots.find(
            item =>
                item.id === selectedLot.id
        );


    if (lot) {

        lot.status = "booked";

    }


    const existingCustomer =
        customers.some(
            customer =>
                customer.email ===
                currentUser.email
        );


    if (!existingCustomer) {

        customers.push({

            id:
                "c-" +
                Date.now(),

            name:
                currentUser.name,

            email:
                currentUser.email,

            phone:
                currentUser.phone,

            status:
                "verified",

            joinedDate:
                today

        });

    }


    displayTicket(booking);


    $("payButton").classList.remove(
        "processing"
    );

}


/* =========================================================
   TICKET
========================================================= */

function displayTicket(ticket) {

    $("ticketSpot").textContent =
        ticket.lotNumber;

    $("ticketAmount").textContent =
        "₹" + ticket.amount.toFixed(2);

    $("ticketCustomer").textContent =
        ticket.customerName;

    $("ticketDate").textContent =
        ticket.date;

    $("ticketId").textContent =
        ticket.id;

    $("ticketEmail").textContent =
        "Pass successfully sent to " +
        ticket.customerEmail;


    showView("ticketView");

}


function bookAnotherSpot() {

    selectedLot = null;

    showView("customerDashboard");

    renderParkingLots();

}


/* =========================================================
   ADMIN TABS
========================================================= */

function switchAdminTab(tab) {

    const tabs = [

        "overview",

        "lots",

        "bookings",

        "customers"

    ];


    tabs.forEach(item => {

        $(item + "Tab")
            .classList.remove("active");

        $(

            "admin" +
            item.charAt(0).toUpperCase() +
            item.slice(1)

        ).classList.add("hidden");

    });


    $(tab + "Tab")
        .classList.add("active");


    const contentId =
        "admin" +
        tab.charAt(0).toUpperCase() +
        tab.slice(1);


    show(contentId);


    if (tab === "overview") {

        updateAdminOverview();

    }

    else if (tab === "lots") {

        renderAdminLots();

    }

    else if (tab === "bookings") {

        renderBookings();

    }

    else if (tab === "customers") {

        renderCustomers();

    }

}


/* =========================================================
   ADMIN OVERVIEW
========================================================= */

function updateAdminOverview() {

    const total =
        parkingLots.length;


    const booked =
        parkingLots.filter(
            lot =>
                lot.status === "booked"
        ).length;


    const available =
        parkingLots.filter(
            lot =>
                lot.status === "available"
        ).length;


    const maintenance =
        parkingLots.filter(
            lot =>
                lot.status === "maintenance"
        ).length;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const revenue =
        bookings
            .filter(
                booking =>
                    booking.date === today &&
                    booking.status !== "cancelled"
            )
            .reduce(
                (sum, booking) =>
                    sum + Number(booking.amount),
                0
            );


    const activeCustomers =
        customers.filter(
            customer =>
                customer.status === "verified"
        ).length;


    $("todayRevenue").textContent =
        "₹" + revenue.toFixed(2);


    $("availableSpots").innerHTML =
        `${available}
        <small style="font-size:13px;color:#94a3b8">
            / ${total}
        </small>`;


    $("bookedSpots").textContent =
        booked;


    $("activeCustomers").textContent =
        activeCustomers;


    createRevenueChart();

    createOccupancyChart(
        available,
        booked,
        maintenance
    );

}


/* =========================================================
   REVENUE CHART
========================================================= */

function createRevenueChart() {

    const ctx =
        $("revenueChart");


    if (revenueChart) {

        revenueChart.destroy();

    }


    const revenueMap = {};


    bookings
        .filter(
            booking =>
                booking.status !== "cancelled"
        )
        .forEach(booking => {

            if (!revenueMap[booking.date]) {

                revenueMap[booking.date] = 0;

            }


            revenueMap[booking.date] +=
                Number(booking.amount);

        });


    const dates =
        Object.keys(revenueMap)
            .sort();


    const values =
        dates.map(
            date =>
                revenueMap[date]
        );


    revenueChart =
        new Chart(
            ctx,
            {

                type: "bar",

                data: {

                    labels: dates.map(
                        date =>
                            date.substring(5)
                    ),

                    datasets: [

                        {

                            label: "Sales",

                            data: values,

                            backgroundColor:
                                "#0ea5e9",

                            borderRadius: 8,

                            barThickness: 40

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return " ₹" +
                                            context.raw;

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    value =>
                                        "₹" + value

                            }

                        }

                    }

                }

            }

        );

}


/* =========================================================
   OCCUPANCY CHART
========================================================= */

function createOccupancyChart(
    available,
    booked,
    maintenance
) {

    const ctx =
        $("occupancyChart");


    if (occupancyChart) {

        occupancyChart.destroy();

    }


    occupancyChart =
        new Chart(
            ctx,
            {

                type: "doughnut",

                data: {

                    labels: [

                        "Available",

                        "Booked",

                        "Maintenance"

                    ],

                    datasets: [

                        {

                            data: [

                                available,

                                booked,

                                maintenance

                            ],

                            backgroundColor: [

                                "#10b981",

                                "#f59e0b",

                                "#ef4444"

                            ],

                            borderWidth: 4,

                            borderColor: "#ffffff"

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "65%",

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }

        );

}


/* =========================================================
   ADMIN PARKING LOTS
========================================================= */

function renderAdminLots() {

    const grid =
        $("adminLotsGrid");


    grid.innerHTML = "";


    $("lotCount").textContent =
        parkingLots.length;


    parkingLots.forEach(lot => {

        const card =
            document.createElement("div");


        card.className =
            "lot-admin-card";


        card.innerHTML = `

            <div class="lot-admin-header">

                <strong>
                    ${lot.number}
                </strong>

                <span class="
                    status-badge
                    status-${lot.status}
                ">
                    ${lot.status}
                </span>

            </div>

            <div class="lot-location">
                ${lot.location}
            </div>

            <div class="lot-price">
                ₹${lot.price}
            </div>

            <div class="lot-actions">

                <select
                    onchange="
                        changeLotStatus(
                            '${lot.id}',
                            this.value
                        )
                    "
                >

                    <option
                        value="available"
                        ${lot.status === "available" ? "selected" : ""}
                    >
                        Available
                    </option>

                    <option
                        value="booked"
                        ${lot.status === "booked" ? "selected" : ""}
                    >
                        Booked
                    </option>

                    <option
                        value="maintenance"
                        ${lot.status === "maintenance" ? "selected" : ""}
                    >
                        Maintenance
                    </option>

                </select>


                <button
                    class="delete-btn"
                    onclick="
                        deleteParkingLot('${lot.id}')
                    "
                    title="Delete Slot"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================================================
   ADD LOT
========================================================= */

function addParkingLot(event) {

    event.preventDefault();


    const number =
        $("newLotNumber")
            .value
            .trim()
            .toUpperCase();


    const location =
        $("newLotLocation")
            .value
            .trim();


    const price =
        Number(
            $("newLotPrice").value
        );


    if (!number) {

        alert("Enter a parking spot number.");

        return;

    }


    const alreadyExists =
        parkingLots.some(
            lot =>
                lot.number === number
        );


    if (alreadyExists) {

        alert(
            "This parking spot already exists."
        );

        return;

    }


    parkingLots.push({

        id:
            "lot-" +
            Date.now(),

        number:
            number,

        status:
            "available",

        price:
            price,

        location:
            location

    });


    $("addLotForm").reset();

    $("newLotLocation").value =
        "Zone 1";

    $("newLotPrice").value =
        50;


    renderAdminLots();

    updateAdminOverview();

    alert(
        `${number} has been added successfully.`
    );

}


/* =========================================================
   CHANGE LOT STATUS
========================================================= */

function changeLotStatus(
    id,
    status
) {

    const lot =
        parkingLots.find(
            item =>
                item.id === id
        );


    if (!lot) {

        return;

    }


    lot.status = status;


    renderAdminLots();

    renderParkingLots();

    updateAdminOverview();

}


/* =========================================================
   DELETE LOT
========================================================= */

function deleteParkingLot(id) {

    const lot =
        parkingLots.find(
            item =>
                item.id === id
        );


    if (!lot) {

        return;

    }


    const confirmed =
        confirm(
            `Delete parking spot ${lot.number}?`
        );


    if (!confirmed) {

        return;

    }


    parkingLots =
        parkingLots.filter(
            item =>
                item.id !== id
        );


    if (
        selectedLot &&
        selectedLot.id === id
    ) {

        selectedLot = null;

    }


    renderAdminLots();

    renderParkingLots();

    updateAdminOverview();

}


/* =========================================================
   BOOKINGS
========================================================= */

function renderBookings() {

    const tbody =
        $("bookingsTableBody");


    const search =
        $("bookingSearch")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        bookings.filter(
            booking =>

                booking.customerName
                    .toLowerCase()
                    .includes(search)

                ||

                booking.lotNumber
                    .toLowerCase()
                    .includes(search)

                ||

                booking.customerEmail
                    .toLowerCase()
                    .includes(search)

        );


    $("bookingCount").textContent =
        filtered.length;


    tbody.innerHTML = "";


    if (filtered.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#94a3b8;
                    "
                >

                    No bookings found.

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(booking => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong style="color:#0e7490">
                    ${booking.id}
                </strong>
            </td>

            <td>
                <strong>
                    ${booking.lotNumber}
                </strong>
            </td>

            <td>

                <strong style="color:#0f172a">
                    ${booking.customerName}
                </strong>

                <br>

                <small style="color:#94a3b8">
                    ${booking.customerEmail}
                </small>

            </td>

            <td>
                ${booking.date}
            </td>

            <td>
                <strong style="color:#059669">
                    ₹${Number(booking.amount).toFixed(2)}
                </strong>
            </td>

            <td>

                <span class="
                    table-status
                    ${booking.status}
                ">
                    ${booking.status}
                </span>

            </td>

            <td>

                ${
                    booking.status === "active"
                    ?

                    `
                    <button
                        class="
                            action-btn
                            cancel-btn
                        "
                        onclick="
                            cancelBooking('${booking.id}')
                        "
                    >
                        Cancel Booking
                    </button>
                    `

                    :

                    "-"
                }

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   CANCEL BOOKING
========================================================= */

function cancelBooking(id) {

    const booking =
        bookings.find(
            item =>
                item.id === id
        );


    if (!booking) {

        return;

    }


    const confirmed =
        confirm(
            `Cancel booking ${booking.id}?`
        );


    if (!confirmed) {

        return;

    }


    const lot =
        parkingLots.find(
            item =>
                item.number ===
                booking.lotNumber
        );


    if (lot) {

        lot.status = "available";

    }


    booking.status =
        "cancelled";


    renderBookings();

    renderAdminLots();

    renderParkingLots();

    updateAdminOverview();

}


/* =========================================================
   CUSTOMERS
========================================================= */

function renderCustomers() {

    const tbody =
        $("customersTableBody");


    const search =
        $("customerSearch")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        customers.filter(
            customer =>

                customer.name
                    .toLowerCase()
                    .includes(search)

                ||

                customer.email
                    .toLowerCase()
                    .includes(search)

                ||

                customer.phone
                    .toLowerCase()
                    .includes(search)

        );


    $("customerCount").textContent =
        filtered.length;


    tbody.innerHTML = "";


    if (filtered.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#94a3b8;
                    "
                >

                    No customers found.

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(customer => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong style="color:#0f172a">
                    ${customer.name}
                </strong>
            </td>

            <td>
                ${customer.email}
            </td>

            <td>
                ${customer.phone}
            </td>

            <td>
                ${customer.joinedDate}
            </td>

            <td>

                <span class="
                    table-status
                    ${customer.status}
                ">
                    ${customer.status}
                </span>

            </td>

            <td>

                <button
                    class="
                        action-btn
                        ${
                            customer.status === "verified"
                            ? "suspend-btn"
                            : "verify-btn"
                        }
                    "
                    onclick="
                        toggleCustomerStatus(
                            '${customer.id}'
                        )
                    "
                >

                    ${
                        customer.status === "verified"
                        ? "Suspend"
                        : "Verify"
                    }

                </button>

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   TOGGLE CUSTOMER STATUS
========================================================= */

function toggleCustomerStatus(id) {

    const customer =
        customers.find(
            item =>
                item.id === id
        );


    if (!customer) {

        return;

    }


    if (customer.status === "verified") {

        customer.status =
            "suspended";

    }

    else {

        customer.status =
            "verified";

    }


    renderCustomers();

    updateAdminOverview();

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showView("loginView");

        renderParkingLots();

    }
);