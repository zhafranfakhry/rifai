/* ==========================================================
   Finance Dashboard
   File : js/dashboard.js
   Part : 1/3
   Description : Dashboard Renderer
   ========================================================== */


/* ==========================================
   DASHBOARD
========================================== */

function renderDashboard(){

    renderHeader();

    renderSummary();

    renderStatistics();

}


/* ==========================================
   HEADER
========================================== */

function renderHeader(){

    const greeting=

    getGreeting();

    setText(

        "#headerGreeting",

        `${greeting}, Mas Rifai 👋`

    );

    setText(

        "#headerInsight",

        randomInsight()

    );

    setText(

        "#dashboardMonthText",

        formatMonth(

            Finance.dashboard.month

        )

    );

}


/* ==========================================
   SUMMARY
========================================== */

function renderSummary(){

    const summary=

    Finance.dashboard.summary;

    setText(

        "#totalIncome",

        formatCurrency(

            summary.income

        )

    );

    setText(

        "#totalExpense",

        formatCurrency(

            summary.expense

        )

    );

    setText(

        "#totalBalance",

        formatCurrency(

            summary.balance

        )

    );

    setText(

        "#savingRate",

        formatPercent(

            summary.savingRate

        )

    );

}


/* ==========================================
   STATISTICS
========================================== */

function renderStatistics(){

    const statistic=

    Finance.dashboard.statistics;

    if(

        statistic.biggestExpense

    ){

        setText(

            "#biggestExpenseCategory",

            capitalize(

                statistic

                .biggestExpense

                .kategori

            )

        );

        setText(

            "#biggestExpenseValue",

            formatCurrency(

                statistic

                .biggestExpense

                .nominal

            )

        );

    }

    if(

        statistic.biggestIncome

    ){

        setText(

            "#biggestIncomeCategory",

            capitalize(

                statistic

                .biggestIncome

                .kategori

            )

        );

        setText(

            "#biggestIncomeValue",

            formatCurrency(

                statistic

                .biggestIncome

                .nominal

            )

        );

    }

    setText(

        "#averageExpense",

        formatCurrency(

            statistic.averagePerDay

        )

    );

}

/* ==========================================================
   Finance Dashboard
   File : js/dashboard.js
   Part : 2/3
   Description : Reminder, Validation & Sync
   ========================================================== */


/* ==========================================
   REMINDER
========================================== */

function renderReminder(){

    const container=

    DOM.reminderContainer;

    if(!container) return;

    const reminders=

    Finance.dashboard.reminder;

    if(!reminders.length){

        container.innerHTML="";

        return;

    }

    container.innerHTML=

    `
    <div class="marquee">
        <div class="marquee-track">
            ${reminders.map(item=>`

                <div class="marquee-item">

                    <span class="material-symbols-outlined">

                        ${item.icon}

                    </span>

                    <strong>

                        ${item.title}

                    </strong>

                    <span>

                        ${item.message}

                    </span>

                </div>

            `).join("")}
        </div>
    </div>
    `;

}


/* ==========================================
   DASHBOARD BADGE
========================================== */

function renderDashboardBadge(){

    setText(

        "#dashboardBadge",

        `Dashboard ${formatMonth(

            Finance.dashboard.month

        )}`

    );

}


/* ==========================================
   LAST SYNC
========================================== */

function renderLastSync(){

    if(!Finance.sync) return;

    setText(

        "#lastSync",

        Finance.sync.toLocaleString(

            "id-ID",

            {

                dateStyle:"long",

                timeStyle:"short"

            }

        )

    );

}


/* ==========================================
   VALIDATION
========================================== */

function renderValidation(){

    const validation=

    Finance.dashboard.validation;

    const container=

    document.getElementById(

        "dashboardValidation"

    );

    if(

        !container ||

        !validation

    ){

        return;

    }

    if(validation.success){

        container.innerHTML="";

        return;

    }

    container.innerHTML=

    `
    <div class="validation-card card-danger">

        <div class="validation-card__icon">

            <span class="material-symbols-outlined">

                warning

            </span>

        </div>

        <div class="validation-card__content">

            <div class="validation-card__title">

                ${validation.message}

            </div>

            <div class="validation-card__message">

                Dashboard belum dapat ditampilkan
                karena data transaksi belum tersedia.

            </div>

        </div>

    </div>
    `;

}


/* ==========================================
   LOADING
========================================== */

function showDashboardLoading(){

    show("#dashboardLoading");

}

function hideDashboardLoading(){

    hide("#dashboardLoading");

}


/* ==========================================
   EMPTY STATE
========================================== */

function renderDashboardEmpty(){

    const wrapper=

    document.getElementById(

        "dashboardEmpty"

    );

    if(!wrapper) return;

    const empty=

    Finance.data.transaksi.length===0;

    wrapper.classList.toggle(

        "hidden",

        !empty

    );

}

/* ==========================================================
   Finance Dashboard
   File : js/dashboard.js
   Part : 3/3
   Description : Dashboard Controller
   ========================================================== */


/* ==========================================
   REFRESH
========================================== */

function refreshDashboard(){

    renderHeader();

    renderSummary();

    renderStatistics();

    renderReminder();

    renderDashboardBadge();

    renderLastSync();

    renderValidation();

    renderDashboardEmpty();

}


/* ==========================================
   RENDER MODULE
========================================== */

function renderDashboardModule(){

    showDashboardLoading();

    refreshDashboard();

    if(window.ChartRenderer){

        ChartRenderer.render();

    }

    if(window.PlanningRenderer){

        PlanningRenderer.render();

    }

    if(window.TransactionRenderer){

        TransactionRenderer.render();

    }

    if(window.InsightRenderer){

        InsightRenderer.render();

    }

    hideDashboardLoading();

}


/* ==========================================
   CHANGE MONTH
========================================== */

function changeDashboardMonth(month){

    setDashboardMonth(month);

    renderDashboardModule();

}


/* ==========================================
   DASHBOARD MONTH EVENT
========================================== */

function bindDashboardMonth(){

    if(!DOM.dashboardMonth) return;

    DOM.dashboardMonth.value=

    Finance.dashboard.month;

    DOM.dashboardMonth.addEventListener(

        "change",

        event=>{

            changeDashboardMonth(

                event.target.value

            );

        }

    );

}


/* ==========================================
   EXPORT DASHBOARD
========================================== */

function exportDashboard(){

    if(

        window.print

    ){

        window.print();

    }

}


/* ==========================================
   PUBLIC API
========================================== */

window.DashboardRenderer={

    render:

    renderDashboardModule,

    refresh:

    refreshDashboard,

    changeMonth:

    changeDashboardMonth,

    export:

    exportDashboard

};


/* ==========================================
   END OF FILE
========================================== */
