/* ==========================================================
   Finance Dashboard
   File : js/planning.js
   Part : 1/3
   Description : Planning Renderer
   ========================================================== */


/* ==========================================
   MAIN
========================================== */

function renderPlanning(){

    renderPlanningSummary();

    renderPlanningCards();

}


/* ==========================================
   SUMMARY
========================================== */

function renderPlanningSummary(){

    const planning=

    Finance.dashboard.planning;

    setText(

        "#budgetSalary",

        formatCurrency(

            planning.salary

        )

    );

    setText(

        "#budgetTotal",

        formatCurrency(

            planning.totalBudget

        )

    );

    setText(

        "#budgetUsed",

        formatCurrency(

            planning.totalUsed

        )

    );

    setText(

        "#budgetRemaining",

        formatCurrency(

            planning.totalRemaining

        )

    );

    setText(

        "#budgetHealth",

        planning.healthScore

    );

    setText(

        "#budgetHealthStatus",

        planning.healthStatus

    );

    const progress=

    document.querySelector(

        "#budgetProgress"

    );

    if(progress){

        progress.style.width=

        `${Math.min(

            planning.budgetPercent,

            100

        )}%`;

    }

}


/* ==========================================
   CARD
========================================== */

function renderPlanningCards(){

    const wrapper=

    DOM.planningContainer;

    if(!wrapper) return;

    removeChildren(wrapper);

    const planning=

    Finance.dashboard.planning;

    if(

        planning.noPlanning

    ){

        renderEmptyPlanning();

        return;

    }

    if(

        planning.waitingSalary

    ){

        renderWaitingSalary();

    }

    planning.categories

    .forEach(item=>{

        wrapper.appendChild(

            createPlanningCard(

                item

            )

        );

    });

}


/* ==========================================
   CREATE CARD
========================================== */

function createPlanningCard(item){

    const card=

    createElement(

        "div",

        `planning-item ${item.className}`

    );

    card.innerHTML=`

    <div class="planning-item__header">

        <div class="planning-item__title">

            <div class="planning-item__icon">

                <span class="material-symbols-outlined">

                    ${getCategoryIcon(item.kategori)}

                </span>

            </div>

            <div>

                <div class="planning-item__name">

                    ${capitalize(item.kategori)}

                </div>

                <small>

                    Budget

                </small>

            </div>

        </div>

        <div class="planning-item__budget">

            <strong>

                ${compactMoney(item.budget)}

            </strong>

        </div>

    </div>

    <div class="planning-progress">

        <div class="progress">

            <div

                class="progress-bar"

                style="width:${Math.min(item.percent,100)}%">

            </div>

        </div>

    </div>

    <div class="planning-remaining">

        <span>

            Terpakai

        </span>

        <strong>

            ${formatCurrency(item.used)}

        </strong>

    </div>

    <div class="planning-footer">

        <div>

            <div class="planning-footer__label">

                Sisa Budget

            </div>

            <div class="planning-footer__value">

                ${formatCurrency(item.remaining)}

            </div>

        </div>

        <span class="planning-status__badge">

            ${item.status}

        </span>

    </div>

    `;

    return card;

}

/* ==========================================================
   Finance Dashboard
   File : js/planning.js
   Part : 2/3
   Description : Planning States & Validation
   ========================================================== */


/* ==========================================
   WAITING SALARY
========================================== */

function renderWaitingSalary(){

    const container=

    document.getElementById(

        "planningValidation"

    );

    if(!container) return;

    container.innerHTML=`

    <div class="waiting-salary">

        <div class="waiting-salary__icon">

            <span class="material-symbols-outlined">

                payments

            </span>

        </div>

        <div class="waiting-salary__content">

            <div class="waiting-salary__title">

                Menunggu Gaji Bulan Ini

            </div>

            <div class="waiting-salary__description">

                Budget utama akan dihitung setelah transaksi
                <strong>gaji</strong> pada bulan
                <strong>${formatMonth(Finance.dashboard.month)}</strong>
                masuk ke spreadsheet.

            </div>

        </div>

    </div>

    `;

}


/* ==========================================
   EMPTY PLANNING
========================================== */

function renderEmptyPlanning(){

    const wrapper=

    DOM.planningContainer;

    if(!wrapper) return;

    wrapper.innerHTML=`

    <div class="planning-empty">

        <div class="planning-empty__icon">

            <span class="material-symbols-outlined">

                event_busy

            </span>

        </div>

        <div class="planning-empty__title">

            Planning Belum Dibuat

        </div>

        <div class="planning-empty__description">

            Tambahkan target budget pada sheet
            <strong>planning</strong>
            agar dashboard dapat menghitung progres budget.

        </div>

    </div>

    `;

}


/* ==========================================
   HEALTH SCORE
========================================== */

function renderHealthScore(){

    const planning=

    Finance.dashboard.planning;

    setText(

        "#healthScore",

        planning.healthScore

    );

    setText(

        "#healthStatus",

        planning.healthStatus

    );

}


/* ==========================================
   VALIDATION
========================================== */

function renderPlanningValidation(){

    const container=

    document.getElementById(

        "planningValidation"

    );

    if(!container) return;

    const planning=

    Finance.dashboard.planning;

    if(planning.noPlanning){

        renderEmptyPlanning();

        return;

    }

    if(planning.waitingSalary){

        renderWaitingSalary();

        return;

    }

    container.innerHTML=`

    <div class="planning-validation">

        <div class="planning-validation__icon">

            <span class="material-symbols-outlined">

                verified

            </span>

        </div>

        <div class="planning-validation__content">

            <div class="planning-validation__title">

                Planning Berjalan Normal

            </div>

            <div class="planning-validation__message">

                Budget bulan ini sudah dapat dihitung
                dan seluruh progress diperbarui otomatis
                berdasarkan transaksi terbaru.

            </div>

        </div>

    </div>

    `;

}


/* ==========================================
   ANIMATION
========================================== */

function animatePlanningProgress(){

    requestAnimationFrame(()=>{

        document

        .querySelectorAll(

            ".planning-progress .progress-bar"

        )

        .forEach(bar=>{

            const width=

            bar.style.width;

            bar.style.width="0%";

            requestAnimationFrame(()=>{

                bar.style.width=width;

            });

        });

    });

}

/* ==========================================================
   Finance Dashboard
   File : js/planning.js
   Part : 3/3
   Description : Planning Controller
   ========================================================== */


/* ==========================================
   BUDGET MESSAGE
========================================== */

function getBudgetMessage(item){

    if(item.used===0){

        return "Belum ada transaksi.";

    }

    if(item.remaining>0){

        return `${formatCurrency(item.remaining)} tersisa dari budget.`;

    }

    if(item.remaining===0){

        return "Budget telah digunakan seluruhnya.";

    }

    return `${formatCurrency(Math.abs(item.remaining))} melebihi budget.`;

}


/* ==========================================
   UPDATE CARD
========================================== */

function updatePlanningCardMessage(){

    document

    .querySelectorAll(

        ".planning-item"

    )

    .forEach((card,index)=>{

        const item=

        Finance.dashboard

        .planning

        .categories[index];

        if(!item) return;

        const footer=

        document.createElement(

            "div"

        );

        footer.className=

        "planning-card-message";

        footer.textContent=

        getBudgetMessage(item);

        card.appendChild(

            footer

        );

    });

}


/* ==========================================
   UPDATE
========================================== */

function updatePlanning(){

    renderPlanningSummary();

    renderPlanningValidation();

    renderPlanningCards();

    renderHealthScore();

    animatePlanningProgress();

    updatePlanningCardMessage();

}


/* ==========================================
   REFRESH
========================================== */

function refreshPlanning(){

    updatePlanning();

}


/* ==========================================
   MAIN
========================================== */

function renderPlanningModule(){

    refreshPlanning();

}


/* ==========================================
   PUBLIC API
========================================== */

window.PlanningRenderer={

    render:

    renderPlanningModule,

    refresh:

    refreshPlanning,

    update:

    updatePlanning

};


/* ==========================================
   END OF FILE
========================================== */
