/* ==========================================================
   Finance Dashboard
   File : js/table.js
   Part : 1/3
   Description : Transaction Table Renderer
   ========================================================== */


/* ==========================================
   RENDER TABLE
========================================== */

function renderTransactionTable(){

    const tbody=

    document.querySelector(

        "#transactionTable tbody"

    );

    if(!tbody) return;

    removeChildren(tbody);

    const table=

    Finance.dashboard.table;

    if(

        table.preview.length===0

    ){

        renderEmptyTransaction();

        return;

    }

    table.preview.forEach(item=>{

        tbody.appendChild(

            createTransactionRow(item)

        );

    });

}


/* ==========================================
   CREATE ROW
========================================== */

function createTransactionRow(item){

    const tr=

    document.createElement("tr");

    const typeClass=

    item.jenis===TYPE.INCOME

    ?"income"

    :"expense";

    tr.innerHTML=`

    <td class="col-date">

        <div class="date">

            <strong>

                ${shortDate(item.tanggal)}

            </strong>

            <small>

                ${item.weekday}

            </small>

        </div>

    </td>

    <td class="col-category">

        <span class="category ${item.kategori.replace(/\s+/g,'-')}">

            <span class="material-symbols-outlined">

                ${getCategoryIcon(item.kategori)}

            </span>

            ${capitalize(item.kategori)}
        </span>

    </td>

    <td class="col-description">

        <div class="description">

            <span class="description__title">

                ${item.keterangan||"-"}

            </span>

        </div>

    </td>

    <td class="col-type">

        <span class="transaction-type ${typeClass}">

            ${capitalize(item.jenis)}

        </span>

    </td>

    <td class="col-amount">

        <span class="amount ${typeClass}">

            ${

                item.jenis===TYPE.INCOME

                ?"+ "

                :"- "

            }

            ${formatCurrency(item.nominal)}

        </span>

    </td>

    `;

    return tr;

}


/* ==========================================
   EMPTY
========================================== */

function renderEmptyTransaction(){

    const tbody=

    document.querySelector(

        "#transactionTable tbody"

    );

    if(!tbody) return;

    tbody.innerHTML=`

    <tr>

        <td colspan="5">

            <div class="table-empty">

                <div class="table-empty__icon">

                    <span class="material-symbols-outlined">

                        receipt_long

                    </span>

                </div>

                <div class="table-empty__title">

                    Tidak ada transaksi

                </div>

                <div class="table-empty__description">

                    Belum ada transaksi pada filter yang dipilih.

                </div>

            </div>

        </td>

    </tr>

    `;

}

/* ==========================================================
   Finance Dashboard
   File : js/table.js
   Part : 2/3
   Description : Filter & Mobile Transaction
   ========================================================== */


/* ==========================================
   MONTH FILTER
========================================== */

function populateMonthFilter(){

    const select=

    DOM.transactionMonth;

    if(!select) return;

    const table=

    Finance.dashboard.table;

    removeChildren(select);

    table.months.forEach(month=>{

        const option=

        document.createElement(

            "option"

        );

        option.value=month;

        option.textContent=

        formatMonth(month);

        option.selected=

        month===table.month;

        select.appendChild(

            option

        );

    });

}


/* ==========================================
   CATEGORY FILTER
========================================== */

function populateCategoryFilter(){

    const select=

    DOM.categoryFilter;

    if(!select) return;

    removeChildren(select);

    const all=

    document.createElement("option");

    all.value="all";

    all.textContent="Semua Kategori";

    select.appendChild(all);

    Finance.dashboard.table.categories

    .forEach(category=>{

        const option=

        document.createElement("option");

        option.value=category;

        option.textContent=

        capitalize(category);

        option.selected=

        category===

        Finance.dashboard.table.category;

        select.appendChild(option);

    });

}


/* ==========================================
   MOBILE CARD
========================================== */

function renderMobileTransaction(){

    const wrapper=

    document.getElementById(

        "mobileTransaction"

    );

    if(!wrapper) return;

    removeChildren(wrapper);

    Finance.dashboard.table.preview

    .forEach(item=>{

        const card=

        createElement(

            "div",

            "mobile-transaction-card"

        );

        card.innerHTML=`

            <div class="mobile-transaction-card__top">

                <div>

                    <strong>

                        ${capitalize(item.kategori)}

                    </strong>

                    <br>

                    <small>

                        ${formatDate(item.tanggal)}

                    </small>

                </div>

                <div class="mobile-amount ${

                    item.jenis===TYPE.INCOME

                    ?"income"

                    :"expense"

                }">

                    ${formatCurrency(item.nominal)}

                </div>

            </div>

            <div class="mobile-transaction-row">

                <span class="mobile-transaction-label">

                    Keterangan

                </span>

                <span class="mobile-transaction-value">

                    ${item.keterangan||"-"}

                </span>

            </div>

        `;

        wrapper.appendChild(card);

    });

}


/* ==========================================
   SHOW MORE
========================================== */

function toggleShowMore(){

    const button=

    document.getElementById(

        "showMore"

    );

    if(!button) return;

    button.style.display=

    Finance.dashboard.table.hasMore

    ?"inline-flex"

    :"none";

}


/* ==========================================
   FILTER EVENT
========================================== */

function bindTransactionFilter(){

    if(DOM.transactionMonth){

        DOM.transactionMonth

        .addEventListener(

            "change",

            e=>{

                setTransactionMonth(

                    e.target.value

                );

                renderTransaction();

            }

        );

    }

    if(DOM.categoryFilter){

        DOM.categoryFilter

        .addEventListener(

            "change",

            e=>{

                setTransactionCategory(

                    e.target.value

                );

                renderTransaction();

            }

        );

    }

}


/* ==========================================================
   Finance Dashboard
   File : js/table.js
   Part : 3/3
   Description : Table Controller
   ========================================================== */

let showAllTransaction=false;


/* ==========================================
   SHOW MORE
========================================== */

function toggleTransaction(){

    showAllTransaction=

    !showAllTransaction;

    renderTransaction();

}


/* ==========================================
   RENDER
========================================== */

function renderTransaction(){

    const table=

    Finance.dashboard.table;

    const data=

    showAllTransaction

    ?table.transactions

    :table.preview;

    renderTransactionRows(data);

    renderMobileRows(data);

    updateShowMoreButton();

}


/* ==========================================
   ROWS
========================================== */

function renderTransactionRows(data){

    const tbody=

    document.querySelector(

        "#transactionTable tbody"

    );

    if(!tbody) return;

    removeChildren(tbody);

    if(data.length===0){

        renderEmptyTransaction();

        return;

    }

    data.forEach(item=>{

        tbody.appendChild(

            createTransactionRow(item)

        );

    });

}


/* ==========================================
   MOBILE ROW
========================================== */

function renderMobileRows(data){

    const wrapper=

    document.getElementById(

        "mobileTransaction"

    );

    if(!wrapper) return;

    removeChildren(wrapper);

    data.forEach(item=>{

        const card=

        createMobileTransactionCard(item);

        wrapper.appendChild(card);

    });

}


/* ==========================================
   BUTTON
========================================== */

function updateShowMoreButton(){

    const button=

    document.getElementById(

        "showMore"

    );

    if(!button) return;

    if(

        !Finance.dashboard.table.hasMore

    ){

        button.style.display="none";

        return;

    }

    button.style.display="inline-flex";

    button.innerHTML=

    showAllTransaction

    ?`

    <span class="material-symbols-outlined">

        expand_less

    </span>

    Lihat Lebih Sedikit

    `

    :`

    <span class="material-symbols-outlined">

        expand_more

    </span>

    Lihat Semua

    `;

}


/* ==========================================
   EXPORT CSV
========================================== */

function exportTransactionCSV(){

    const rows=

    Finance.dashboard.table.transactions;

    let csv=

    "Tanggal,Jenis,Kategori,Keterangan,Nominal\n";

    rows.forEach(item=>{

        csv+=

        `${item.tanggal},`

        +`${item.jenis},`

        +`${item.kategori},`

        +`"${item.keterangan}",`

        +`${item.nominal}\n`;

    });

    downloadCSV(

        `transaksi-${Finance.dashboard.table.month}.csv`,

        csv

    );

}


/* ==========================================
   MAIN
========================================== */

function renderTransactionModule(){

    populateMonthFilter();

    populateCategoryFilter();

    renderTransaction();

    updateShowMoreButton();

}


/* ==========================================
   EVENT
========================================== */

document.addEventListener(

    "click",

    event=>{

        const button=

        event.target.closest(

            "#showMore"

        );

        if(button){

            toggleTransaction();

        }

    }

);


/* ==========================================
   PUBLIC API
========================================== */

window.TransactionRenderer={

    render:

    renderTransactionModule,

    refresh:

    renderTransaction,

    export:

    exportTransactionCSV

};


/* ==========================================
   END OF FILE
========================================== */
