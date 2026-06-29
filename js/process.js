/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 1/8
   Description : Data Processing Engine
   ========================================================== */


/* ==========================================
   MAIN PROCESS
========================================== */

function processFinanceData(){

    normalizeTransactions();

    normalizePlanning();

    initializeDashboardMonth();

    calculateSummary();

    calculateStatistics();

    calculatePlanning();

    calculateReminder();

    calculateCharts();

    calculateInsight();

    prepareTransactionTable();

}


/* ==========================================
   NORMALIZE TRANSACTION
========================================== */

function normalizeTransactions(){

    Finance.data.transaksi=

    Finance.raw.transaksi

    .filter(item=>{

        return(

            item.tanggal &&
            item.jenis &&
            item.nominal>0

        );

    })

    .map(item=>{

        const date=

        new Date(item.tanggal);

        return{

            ...item,

            date,

            year:

            date.getFullYear(),

            month:

            `${

                date.getFullYear()

            }-${

                String(

                    date.getMonth()+1

                ).padStart(2,"0")

            }`,

            day:

            date.getDate(),

            monthIndex:

            date.getMonth(),

            weekday:

            date.toLocaleDateString(

                "id-ID",

                {

                    weekday:"long"

                }

            )

        };

    });

}


/* ==========================================
   NORMALIZE PLANNING
========================================== */

function normalizePlanning(){

    Finance.data.planning=

    Finance.raw.planning

    .filter(item=>{

        return(

            item.bulan &&
            item.kategori &&
            item.budget>0

        );

    });

}


/* ==========================================
   DASHBOARD MONTH
========================================== */

function initializeDashboardMonth(){

    if(

        Finance.dashboard.month

    ){

        return;

    }

    const months=

    unique(

        Finance.data.transaksi

        .map(

            item=>item.month

        )

    )

    .sort()

    .reverse();

    Finance.dashboard.month=

    months[0] ||

    getCurrentMonth();

}


/* ==========================================
   TRANSACTION
========================================== */

function currentTransactions(){

    return Finance

    .data

    .transaksi

    .filter(item=>

        item.month===

        Finance.dashboard.month

    );

}


/* ==========================================
   PLANNING
========================================== */

function currentPlanning(){

    return Finance

    .data

    .planning

    .filter(item=>

        item.bulan===

        Finance.dashboard.month

    );

}
/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 2/8
   Description : Summary Calculation
   ========================================================== */


/* ==========================================
   SUMMARY
========================================== */

function calculateSummary(){

    const transactions=

    currentTransactions();

    let income=0;

    let expense=0;

    let operationalExpense=0;

    let wifeExpense=0;

    let transactionCount=0;

    let expenseTransaction=0;

    let incomeTransaction=0;


    transactions.forEach(item=>{

        const nominal=

        toNumber(item.nominal);

        if(

            item.jenis===TYPE.INCOME

        ){

            income+=nominal;

            incomeTransaction++;

        }

        if(

            item.jenis===TYPE.EXPENSE

        ){

            expense+=nominal;

            expenseTransaction++;

            if(

                item.kategori===CATEGORY.WIFE

            ){

                wifeExpense+=nominal;

            }

            else{

                operationalExpense+=nominal;

            }

        }

        transactionCount++;

    });


    const balance=

    income-expense;


    const savingRate=

    income===0

    ?0

    :

    (

        balance/

        income

    )*100;


    const averageExpense=

    expenseTransaction===0

    ?0

    :

    expense/

    expenseTransaction;


    const averageOperational=

    expenseTransaction===0

    ?0

    :

    operationalExpense/

    expenseTransaction;


    Finance.dashboard.summary={

        income,

        expense,

        balance,

        operationalExpense,

        wifeExpense,

        savingRate,

        averageExpense,

        averageOperational,

        incomeTransaction,

        expenseTransaction,

        transactionCount

    };

}


/* ==========================================
   BALANCE STATUS
========================================== */

function getBalanceStatus(){

    const{

        balance

    }=

    Finance.dashboard.summary;

    if(balance>0){

        return{

            label:"Surplus",

            className:"success"

        };

    }

    if(balance===0){

        return{

            label:"Impas",

            className:"warning"

        };

    }

    return{

        label:"Defisit",

        className:"danger"

    };

}


/* ==========================================
   SAVING RATE STATUS
========================================== */

function getSavingRateStatus(){

    const{

        savingRate

    }=

    Finance.dashboard.summary;

    if(

        savingRate>=30

    ){

        return{

            label:"Sangat Baik",

            className:"success"

        };

    }

    if(

        savingRate>=15

    ){

        return{

            label:"Baik",

            className:"primary"

        };

    }

    if(

        savingRate>=0

    ){

        return{

            label:"Perlu Ditingkatkan",

            className:"warning"

        };

    }

    return{

        label:"Tidak Sehat",

        className:"danger"

    };

}

/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 3/8
   Description : Statistics Engine
   ========================================================== */


/* ==========================================
   STATISTICS
========================================== */

function calculateStatistics(){

    const transactions=

    currentTransactions();

    const incomeCategory={};

    const expenseCategory={};

    let biggestIncome=null;

    let biggestExpense=null;

    let operationalTransaction=0;

    let operationalTotal=0;

    const dailyExpense={};

    const weeklyExpense={};

    transactions.forEach(item=>{

        const nominal=

        toNumber(item.nominal);

        /* ==========================
           INCOME
        ========================== */

        if(

            item.jenis===TYPE.INCOME

        ){

            incomeCategory[item.kategori]=

            (

                incomeCategory[item.kategori]

                ||0

            )+nominal;

            if(

                !biggestIncome ||

                nominal>

                biggestIncome.nominal

            ){

                biggestIncome=item;

            }

        }

        /* ==========================
           EXPENSE
        ========================== */

        if(

            item.jenis===TYPE.EXPENSE

        ){

            /* Nafkah istri
               tidak dihitung
               sebagai statistik */

            if(

                item.kategori===

                CATEGORY.WIFE

            ){

                return;

            }

            operationalTransaction++;

            operationalTotal+=nominal;

            expenseCategory[item.kategori]=

            (

                expenseCategory[item.kategori]

                ||0

            )+nominal;

            if(

                !biggestExpense ||

                nominal>

                biggestExpense.nominal

            ){

                biggestExpense=item;

            }

            /* =====================
               DAILY
            ===================== */

            dailyExpense[

                item.day

            ]=

            (

                dailyExpense[

                    item.day

                ]||0

            )+nominal;

            /* =====================
               WEEK
            ===================== */

            const week=

            Math.ceil(

                item.day/7

            );

            weeklyExpense[week]=

            (

                weeklyExpense[week]

                ||0

            )+nominal;

        }

    });

    /* ==========================
       CATEGORY
    ========================== */

    const topExpense=

    Object.entries(

        expenseCategory

    )

    .sort(

        (a,b)=>

        b[1]-a[1]

    );

    const topIncome=

    Object.entries(

        incomeCategory

    )

    .sort(

        (a,b)=>

        b[1]-a[1]

    );

    /* ==========================
       DAILY AVG
    ========================== */

    const activeDay=

    Object.keys(

        dailyExpense

    ).length;

    const averagePerDay=

    activeDay===0

    ?0

    :

    operationalTotal/

    activeDay;

    /* ==========================
       WEEK AVG
    ========================== */

    const activeWeek=

    Object.keys(

        weeklyExpense

    ).length;

    const averagePerWeek=

    activeWeek===0

    ?0

    :

    operationalTotal/

    activeWeek;

    /* ==========================
       SAVE
    ========================== */

    Finance.dashboard.statistics={

        biggestIncome,

        biggestExpense,

        incomeCategory,

        expenseCategory,

        topExpense,

        topIncome,

        operationalTransaction,

        operationalTotal,

        averagePerDay,

        averagePerWeek,

        totalIncomeCategory:

        Object.keys(

            incomeCategory

        ).length,

        totalExpenseCategory:

        Object.keys(

            expenseCategory

        ).length

    };

}
/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 4/8
   Description : Planning Engine
   ========================================================== */


/* ==========================================
   PLANNING
========================================== */

function calculatePlanning(){

    const planning=

    currentPlanning();

    const transactions=

    currentTransactions();

    /* =====================================
       MAIN BUDGET
       Budget berasal dari
       transaksi MASUK kategori GAJI
       pada bulan dashboard
    ====================================== */

    const salary=

    transactions

    .filter(item=>

        item.jenis===TYPE.INCOME &&

        item.kategori===CATEGORY.SALARY

    )

    .reduce(

        (total,item)=>

        total+item.nominal,

        0

    );

    /* =====================================
       CATEGORY RESULT
    ====================================== */

    const categories=

    planning.map(plan=>{

        const used=

        transactions

        .filter(item=>

            item.jenis===TYPE.EXPENSE &&

            item.kategori===plan.kategori

        )

        .reduce(

            (total,item)=>

            total+item.nominal,

            0

        );

        const budget=

        plan.budget;

        const remaining=

        Math.max(

            budget-used,

            0

        );

        const percent=

        budget===0

        ?0

        :

        (used/budget)*100;

        return{

            kategori:

            plan.kategori,

            budget,

            used,

            remaining,

            percent,

            status:

            getBudgetStatus(

                percent

            ),

            className:

            getBudgetClass(

                percent

            )

        };

    });

    /* =====================================
       TOTAL
    ====================================== */

    const totalBudget=

    planning.reduce(

        (total,item)=>

        total+item.budget,

        0

    );

    const totalUsed=

    categories.reduce(

        (total,item)=>

        total+item.used,

        0

    );

    const totalRemaining=

    Math.max(

        totalBudget-

        totalUsed,

        0

    );

    const budgetPercent=

    totalBudget===0

    ?0

    :

    (totalUsed/

    totalBudget)

    *100;

    /* =====================================
       HEALTH SCORE
    ====================================== */

    let score=100;

    categories.forEach(item=>{

        if(item.percent>100){

            score-=20;

        }

        else if(item.percent>85){

            score-=10;

        }

        else if(item.percent>60){

            score-=5;

        }

    });

    score=

    Math.max(

        score,

        0

    );

    /* =====================================
       STATUS
    ====================================== */

    let healthStatus="Sangat Sehat";

    if(score<90){

        healthStatus="Sehat";

    }

    if(score<75){

        healthStatus="Cukup";

    }

    if(score<60){

        healthStatus="Perlu Evaluasi";

    }

    /* =====================================
       VALIDATION
    ====================================== */

    const waitingSalary=

    salary===0;

    const noPlanning=

    planning.length===0;

    /* =====================================
       SAVE
    ====================================== */

    Finance.dashboard.planning={

        salary,

        totalBudget,

        totalUsed,

        totalRemaining,

        budgetPercent,

        healthScore:score,

        healthStatus,

        waitingSalary,

        noPlanning,

        categories

    };

    }

/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 5/8
   Description : Reminder & Chart Engine
   ========================================================== */


/* ==========================================
   REMINDER
========================================== */

function calculateReminder(){

    const planning=

    Finance.dashboard.planning;

    const reminders=[];

    /* ==========================
       WAITING SALARY
    ========================== */

    if(planning.waitingSalary){

        reminders.push({

            type:"warning",

            icon:"payments",

            title:"Menunggu Gaji",

            message:
            `Budget utama bulan ${Finance.dashboard.month}
             belum tersedia karena transaksi gaji belum masuk.`

        });

    }

    /* ==========================
       NO PLANNING
    ========================== */

    if(planning.noPlanning){

        reminders.push({

            type:"danger",

            icon:"event_busy",

            title:"Planning Belum Dibuat",

            message:
            "Belum ada target budget pada bulan ini."

        });

    }

    /* ==========================
       CATEGORY
    ========================== */

    planning.categories.forEach(item=>{

        if(item.percent>=100){

            reminders.push({

                type:"danger",

                icon:"warning",

                title:item.kategori,

                message:
                `${capitalize(item.kategori)}
                telah melebihi budget.`

            });

            return;

        }

        if(item.percent>=85){

            reminders.push({

                type:"warning",

                icon:"priority_high",

                title:item.kategori,

                message:
                `${capitalize(item.kategori)}
                hampir mencapai batas budget.`

            });

        }

    });

    /* ==========================
       EMPTY
    ========================== */

    if(reminders.length===0){

        reminders.push({

            type:"success",

            icon:"verified",

            title:"Budget Aman",

            message:
            "Seluruh kategori masih berada dalam batas budget."

        });

    }

    Finance.dashboard.reminder=

    reminders;

}


/* ==========================================
   CHART
========================================== */

function calculateCharts(){

    const transactions=

    Finance.data.transaksi;

    const months=

    unique(

        transactions

        .map(item=>item.month)

    )

    .sort()

    .slice(-DASHBOARD.CHART_MONTH_LIMIT);

    const labels=[];

    const income=[];

    const expense=[];

    const balance=[];

    months.forEach(month=>{

        const data=

        transactions.filter(

            item=>item.month===month

        );

        const totalIncome=

        data

        .filter(

            item=>

            item.jenis===TYPE.INCOME

        )

        .reduce(

            (sum,item)=>

            sum+item.nominal,

            0

        );

        const totalExpense=

        data

        .filter(

            item=>

            item.jenis===TYPE.EXPENSE

        )

        .reduce(

            (sum,item)=>

            sum+item.nominal,

            0

        );

        labels.push(

            month

        );

        income.push(

            totalIncome

        );

        expense.push(

            totalExpense

        );

        balance.push(

            totalIncome-totalExpense

        );

    });

    Finance.dashboard.chart={

        labels,

        income,

        expense,

        balance

    };

}

/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 6/8
   Description : Insight Engine
   ========================================================== */


/* ==========================================
   INSIGHT
========================================== */

function calculateInsight(){

    const summary=

    Finance.dashboard.summary;

    const statistic=

    Finance.dashboard.statistics;

    const planning=

    Finance.dashboard.planning;

    const insight=[];

    /* ==========================
       BALANCE
    ========================== */

    if(summary.balance>0){

        insight.push({

            type:"success",

            icon:"trending_up",

            title:"Keuangan Bulan Ini Sehat",

            description:

            `Masih terdapat saldo sebesar
            ${formatCurrency(summary.balance)}
            setelah seluruh pemasukan dan pengeluaran.`

        });

    }
    else{

        insight.push({

            type:"danger",

            icon:"warning",

            title:"Pengeluaran Melebihi Pemasukan",

            description:

            "Pengeluaran bulan ini sudah melebihi pemasukan. Sebaiknya evaluasi kembali pengeluaran yang tidak terlalu penting."

        });

    }

    /* ==========================
       TOP EXPENSE
    ========================== */

    if(

        statistic.topExpense.length

    ){

        const top=

        statistic.topExpense[0];

        insight.push({

            type:"warning",

            icon:getCategoryIcon(

                top[0]

            ),

            title:"Kategori Pengeluaran Terbesar",

            description:

            `${capitalize(top[0])}
            menjadi pengeluaran terbesar bulan ini dengan total
            ${formatCurrency(top[1])}.`

        });

    }

    /* ==========================
       PLANNING
    ========================== */

    if(

        planning.healthScore>=90

    ){

        insight.push({

            type:"success",

            icon:"verified",

            title:"Planning Sangat Baik",

            description:

            "Seluruh target budget masih berada pada jalur yang aman."

        });

    }

    else if(

        planning.healthScore>=75

    ){

        insight.push({

            type:"primary",

            icon:"check_circle",

            title:"Planning Masih Terkendali",

            description:

            "Beberapa kategori mulai mendekati batas budget namun masih aman."

        });

    }

    else{

        insight.push({

            type:"danger",

            icon:"priority_high",

            title:"Planning Perlu Dievaluasi",

            description:

            "Beberapa kategori sudah hampir atau bahkan melebihi target budget."

        });

    }

    /* ==========================
       SAVING RATE
    ========================== */

    if(

        summary.savingRate>=30

    ){

        insight.push({

            type:"success",

            icon:"savings",

            title:"Saving Rate Bagus",

            description:

            `Saving Rate mencapai
            ${formatPercent(summary.savingRate)}.`

        });

    }

    /* ==========================
       DAILY EXPENSE
    ========================== */

    if(

        summary.averageOperational>0

    ){

        insight.push({

            type:"info",

            icon:"calendar_month",

            title:"Rata-rata Pengeluaran",

            description:

            `Pengeluaran operasional rata-rata sebesar
            ${formatCurrency(summary.averageOperational)}
            setiap transaksi.`

        });

    }

    Finance.dashboard.insight=

    insight.slice(

        0,

        DASHBOARD.INSIGHT_LIMIT

    );

      }

/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 7/8
   Description : Transaction Table Engine
   ========================================================== */


/* ==========================================
   TRANSACTION TABLE
========================================== */

function prepareTransactionTable(){

    const month=

    Finance.filter.transactionMonth ||

    Finance.dashboard.month;

    const category=

    Finance.filter.transactionCategory ||

    "all";

    let transactions=

    Finance.data.transaksi

    .filter(

        item=>item.month===month

    );

    /* ==========================
       CATEGORY FILTER
    ========================== */

    if(category!=="all"){

        transactions=

        transactions.filter(

            item=>

            item.kategori===category

        );

    }

    /* ==========================
       SORT
    ========================== */

    transactions=

    sortDateDesc(

        transactions

    );

    /* ==========================
       PREVIEW
    ========================== */

    const preview=

    transactions.slice(

        0,

        DASHBOARD.DEFAULT_HISTORY_LIMIT

    );

    /* ==========================
       CATEGORY LIST
    ========================== */

    const categories=

    unique(

        Finance.data.transaksi

        .map(

            item=>item.kategori

        )

    )

    .sort();

    /* ==========================
       MONTH LIST
    ========================== */

    const months=

    unique(

        Finance.data.transaksi

        .map(

            item=>item.month

        )

    )

    .sort()

    .reverse();

    /* ==========================
       SAVE
    ========================== */

    Finance.dashboard.table={

        month,

        category,

        categories,

        months,

        total:

        transactions.length,

        preview,

        transactions,

        hasMore:

        transactions.length>

        DASHBOARD.DEFAULT_HISTORY_LIMIT

    };

}


/* ==========================================
   UPDATE FILTER
========================================== */

function setTransactionMonth(month){

    Finance.filter.transactionMonth=

    month;

    prepareTransactionTable();

}


function setTransactionCategory(category){

    Finance.filter.transactionCategory=

    category;

    prepareTransactionTable();

}


/* ==========================================
   RESET FILTER
========================================== */

function resetTransactionFilter(){

    Finance.filter.transactionMonth=

    Finance.dashboard.month;

    Finance.filter.transactionCategory=

    "all";

    prepareTransactionTable();

}

/* ==========================================================
   Finance Dashboard
   File : js/process.js
   Part : 8/8
   Description : Validation & Finalize
   ========================================================== */


/* ==========================================
   VALIDATION
========================================== */

function validateDashboard(){

    const validation={

        success:true,

        message:"",

        code:null

    };

    /* ==========================
       NO TRANSACTION
    ========================== */

    if(

        Finance.data.transaksi.length===0

    ){

        validation.success=false;

        validation.code="NO_TRANSACTION";

        validation.message=

        "Belum ada transaksi.";

        Finance.dashboard.validation=

        validation;

        return validation;

    }

    /* ==========================
       NO PLANNING
    ========================== */

    if(

        Finance.dashboard.planning.noPlanning

    ){

        validation.code="NO_PLANNING";

    }

    /* ==========================
       WAITING SALARY
    ========================== */

    if(

        Finance.dashboard.planning.waitingSalary

    ){

        validation.code="WAITING_SALARY";

    }

    Finance.dashboard.validation=

    validation;

    return validation;

}


/* ==========================================
   DASHBOARD META
========================================== */

function finalizeDashboard(){

    Finance.dashboard.meta={

        generated:new Date(),

        version:APP.VERSION,

        month:

        Finance.dashboard.month,

        totalTransaction:

        Finance.dashboard.summary

        .transactionCount,

        totalCategory:

        Finance.dashboard.statistics

        .totalExpenseCategory,

        sync:

        Finance.sync

    };

}


/* ==========================================
   REBUILD
========================================== */

function rebuildDashboard(){

    processFinanceData();

    validateDashboard();

    finalizeDashboard();

}


/* ==========================================
   CHANGE DASHBOARD MONTH
========================================== */

function setDashboardMonth(month){

    Finance.dashboard.month=month;

    resetTransactionFilter();

    rebuildDashboard();

}


/* ==========================================
   PUBLIC API
========================================== */

window.FinanceEngine={

    rebuild:rebuildDashboard,

    validate:validateDashboard,

    process:processFinanceData,

    dashboard:()=>Finance.dashboard,

    summary:()=>Finance.dashboard.summary,

    statistics:()=>Finance.dashboard.statistics,

    planning:()=>Finance.dashboard.planning,

    reminder:()=>Finance.dashboard.reminder,

    insight:()=>Finance.dashboard.insight,

    chart:()=>Finance.dashboard.chart,

    table:()=>Finance.dashboard.table

};


/* ==========================================
   END OF FILE
========================================== */


