/* ==========================================================
   Finance Dashboard
   File : js/charts.js
   Part : 1/3
   Description : Income & Expense Chart
   ========================================================== */

let incomeExpenseChart = null;


/* ==========================================
   RENDER
========================================== */

function renderIncomeExpenseChart(){

    const canvas =
    document.getElementById(
        "incomeExpenseChart"
    );

    if(!canvas) return;

    const chart =
    Finance.dashboard.chart;

    if(
        !chart ||
        chart.labels.length===0
    ){

        return;

    }

    if(incomeExpenseChart){

        incomeExpenseChart.destroy();

    }

    incomeExpenseChart =
    new Chart(

        canvas,

        {

            type:"bar",

            data:{

                labels:

                chart.labels,

                datasets:[

                    {

                        label:"Pemasukan",

                        data:

                        chart.income,

                        borderWidth:2,

                        borderRadius:8

                    },

                    {

                        label:"Pengeluaran",

                        data:

                        chart.expense,

                        borderWidth:2,

                        borderRadius:8

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                interaction:{

                    intersect:false,

                    mode:"index"

                },

                plugins:{

                    legend:{

                        position:"top"

                    },

                    tooltip:{

                        callbacks:{

                            label(context){

                                return

                                context.dataset.label+

                                " : "+

                                formatCurrency(

                                    context.raw

                                );

                            }

                        }

                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{

                            callback(value){

                                return compactMoney(value);

                            }

                        }

                    }

                }

            }

        }

    );

}

/* ==========================================================
   Finance Dashboard
   File : js/charts.js
   Part : 2/3
   Description : Balance Chart
   ========================================================== */

let balanceChart=null;


/* ==========================================
   BALANCE
========================================== */

function renderBalanceChart(){

    const canvas=

    document.getElementById(

        "balanceChart"

    );

    if(!canvas) return;

    const chart=

    Finance.dashboard.chart;

    if(

        !chart ||

        chart.labels.length===0

    ){

        return;

    }

    if(balanceChart){

        balanceChart.destroy();

    }

    balanceChart=

    new Chart(

        canvas,

        {

            type:"line",

            data:{

                labels:

                chart.labels,

                datasets:[

                    {

                        label:

                        "Saldo",

                        data:

                        chart.balance,

                        fill:true,

                        tension:.35,

                        pointRadius:5,

                        pointHoverRadius:7,

                        borderWidth:3

                    }

                ]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                interaction:{

                    intersect:false,

                    mode:"index"

                },

                plugins:{

                    legend:{

                        display:false

                    },

                    tooltip:{

                        callbacks:{

                            label(context){

                                return formatCurrency(

                                    context.raw

                                );

                            }

                        }

                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{

                            callback(value){

                                return compactMoney(

                                    value

                                );

                            }

                        }

                    }

                }

            }

        }

    );

}


/* ==========================================
   DESTROY
========================================== */

function destroyCharts(){

    if(

        incomeExpenseChart

    ){

        incomeExpenseChart.destroy();

        incomeExpenseChart=null;

    }

    if(

        balanceChart

    ){

        balanceChart.destroy();

        balanceChart=null;

    }

}


/* ==========================================
   UPDATE
========================================== */

function updateCharts(){

    destroyCharts();

    renderIncomeExpenseChart();

    renderBalanceChart();

}


/* ==========================================
   RESIZE
========================================== */

window.addEventListener(

    "resize",

    debounce(

        ()=>{

            updateCharts();

        },

        250

    )

);

/* ==========================================================
   Finance Dashboard
   File : js/charts.js
   Part : 3/3
   Description : Chart Helper & Summary
   ========================================================== */


/* ==========================================
   EMPTY STATE
========================================== */

function renderEmptyChart(){

    const container=

    document.getElementById(

        "chartEmpty"

    );

    if(!container) return;

    const hasData=

    Finance.dashboard.chart.labels.length>0;

    container.classList.toggle(

        "hidden",

        hasData

    );

}


/* ==========================================
   SUMMARY
========================================== */

function renderChartSummary(){

    const summary=

    Finance.dashboard.summary;

    setText(

        "#chartIncome",

        compactMoney(

            summary.income

        )

    );

    setText(

        "#chartExpense",

        compactMoney(

            summary.expense

        )

    );

    setText(

        "#chartBalance",

        compactMoney(

            summary.balance

        )

    );

}


/* ==========================================
   LOADING
========================================== */

function showChartLoading(){

    show(

        "#chartLoading"

    );

}


function hideChartLoading(){

    hide(

        "#chartLoading"

    );

}


/* ==========================================
   EXPORT PNG
========================================== */

function exportChartPNG(){

    if(

        !incomeExpenseChart

    ){

        return;

    }

    const link=

    document.createElement(

        "a"

    );

    link.download=

    `chart-${Finance.dashboard.month}.png`;

    link.href=

    incomeExpenseChart

    .toBase64Image();

    link.click();

}


/* ==========================================
   MAIN RENDER
========================================== */

function renderCharts(){

    showChartLoading();

    renderEmptyChart();

    updateCharts();

    renderChartSummary();

    hideChartLoading();

}


/* ==========================================
   PUBLIC
========================================== */

window.ChartRenderer={

    render:

    renderCharts,

    update:

    updateCharts,

    export:

    exportChartPNG,

    destroy:

    destroyCharts

};


/* ==========================================
   END OF FILE
========================================== */
