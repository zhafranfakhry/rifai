/* ==========================================================
   Finance Dashboard
   File : js/config.js
   Description : Global Configuration
   ========================================================== */


/* ==========================================
   APP
========================================== */

const APP={

    NAME:"Finance Dashboard",

    VERSION:"1.0.0",

    AUTHOR:"ChatGPT",

    LOCALE:"id-ID",

    CURRENCY:"IDR"

};


/* ==========================================
   GOOGLE SHEETS
========================================== */

const SHEET={

    ID:

    "19-mq1MdlveqoRNVWeYz5tYISOuW7sRWqxuaX-KdeyeU",

    TRANSACTION_SHEET:

    "transaksi",

    PLANNING_SHEET:

    "planning"

};


/* ==========================================
   OPENSHEET
========================================== */

const API={

    BASE:

    "https://opensheet.elk.sh",

    TRANSACTION(){

        return `${

            this.BASE

        }/${
            SHEET.ID
        }/${
            SHEET.TRANSACTION_SHEET
        }`;

    },

    PLANNING(){

        return `${

            this.BASE

        }/${
            SHEET.ID
        }/${
            SHEET.PLANNING_SHEET
        }`;

    }

};


/* ==========================================
   CATEGORY
========================================== */

const CATEGORY={

    SALARY:"gaji",

    WIFE:"nafkah istri",

    GAS:"bensin",

    BILL:"tagihan",

    INSTALLMENT:"cicilan",

    FOOD:"jajan",

    SHOPPING:"onlineshop",

    PARENT:"ortu",

    OTHER:"lain-lain"

};


/* ==========================================
   TRANSACTION TYPE
========================================== */

const TYPE={

    INCOME:"masuk",

    EXPENSE:"keluar"

};


/* ==========================================
   DASHBOARD
========================================== */

const DASHBOARD={

    DEFAULT_HISTORY_LIMIT:10,

    CHART_MONTH_LIMIT:3,

    REMINDER_SPEED:30,

    INSIGHT_LIMIT:3

};


/* ==========================================
   PLANNING
========================================== */

const PLANNING={

    SAFE:60,

    WARNING:85,

    DANGER:100

};


/* ==========================================
   MONTHS
========================================== */

const MONTH_NAME=[

    "Januari",

    "Februari",

    "Maret",

    "April",

    "Mei",

    "Juni",

    "Juli",

    "Agustus",

    "September",

    "Oktober",

    "November",

    "Desember"

];


/* ==========================================
   INSIGHT
========================================== */

const INSIGHT_TEXT=[

    "Pengeluaranmu masih berada dalam batas yang aman.",

    "Kategori terbesar bulan ini layak dievaluasi kembali.",

    "Budget bulan ini hampir tercapai.",

    "Kamu berhasil menghemat dibanding bulan sebelumnya.",

    "Perencanaan yang konsisten akan membantu mencapai target keuangan."

];


/* ==========================================
   APPLICATION STATE
========================================== */

const Finance={

    raw:{

        transaksi:[],

        planning:[]

    },

    data:{

        transaksi:[],

        planning:[]

    },

    dashboard:{

        month:"",

        summary:{},

        statistics:{},

        planning:{},

        chart:{},

        insight:[],

        reminder:[]

    },

    filter:{

        transactionMonth:"",

        transactionCategory:"all"

    },

    sync:null

};


/* ==========================================
   DOM CACHE
========================================== */

const DOM={

    app:$("#app"),

    dashboardMonth:$("#dashboardMonth"),

    transactionMonth:$("#transactionMonth"),

    categoryFilter:$("#categoryFilter"),

    transactionTable:$("#transactionTable"),

    planningContainer:$("#planningContainer"),

    reminderContainer:$("#reminderContainer"),

    insightContainer:$("#insightContainer"),

    chartCanvas:$("#incomeExpenseChart"),

    syncText:$("#lastSync")

};


/* ==========================================
   END OF FILE
========================================== */
