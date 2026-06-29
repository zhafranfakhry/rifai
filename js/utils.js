/* ==========================================================
   Finance Dashboard
   File : js/utils.js
   Description : Utility Functions
   ========================================================== */

/* ==========================================
   DOM SELECTOR
========================================== */

const $ = selector =>
document.querySelector(selector);

const $$ = selector =>
Array.from(
document.querySelectorAll(selector)
);

/* ==========================================
   SET CONTENT
========================================== */

function setText(selector,value){

    const element=$(selector);

    if(!element) return;

    element.textContent=value;

}

function setHTML(selector,value){

    const element=$(selector);

    if(!element) return;

    element.innerHTML=value;

}

/* ==========================================
   SHOW / HIDE
========================================== */

function show(selector){

    const element=$(selector);

    if(!element) return;

    element.classList.remove("hidden");

}

function hide(selector){

    const element=$(selector);

    if(!element) return;

    element.classList.add("hidden");

}

/* ==========================================
   NUMBER
========================================== */

function toNumber(value){

    if(
        value===null ||
        value===undefined
    ){

        return 0;

    }

    return Number(

        String(value)

        .replaceAll(".","")

        .replaceAll(",","")

        .replace(/[^\d-]/g,"")

    ) || 0;

}

/* ==========================================
   CURRENCY
========================================== */

function formatCurrency(value){

    return new Intl.NumberFormat(

        "id-ID",

        {

            style:"currency",

            currency:"IDR",

            maximumFractionDigits:0

        }

    ).format(

        toNumber(value)

    );

}

/* ==========================================
   NUMBER FORMAT
========================================== */

function formatNumber(value){

    return new Intl.NumberFormat(

        "id-ID"

    ).format(

        toNumber(value)

    );

}

/* ==========================================
   PERCENT
========================================== */

function formatPercent(value){

    return `${

        Number(value).toFixed(1)

    }%`;

}

/* ==========================================
   DATE
========================================== */

function formatDate(date){

    if(!date) return "-";

    const d=new Date(date);

    return d.toLocaleDateString(

        "id-ID",

        {

            day:"2-digit",

            month:"long",

            year:"numeric"

        }

    );

}

/* ==========================================
   SHORT DATE
========================================== */

function shortDate(date){

    if(!date) return "-";

    return new Date(date)

    .toLocaleDateString(

        "id-ID",

        {

            day:"2-digit",

            month:"short"

        }

    );

}

/* ==========================================
   MONTH NAME
========================================== */

function monthName(month){

    const months=[

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

    return months[month-1];

}

/* ==========================================
   CURRENT MONTH
========================================== */

function getCurrentMonth(){

    const today=new Date();

    return `${

        today.getFullYear()

    }-${
        String(
            today.getMonth()+1
        ).padStart(2,"0")
    }`;

}

/* ==========================================
   CURRENT DATE
========================================== */

function today(){

    return new Date()

    .toISOString()

    .slice(0,10);

}

/* ==========================================
   RANDOM
========================================== */

function random(min,max){

    return Math.floor(

        Math.random()

        *(max-min+1)

    )+min;

}

/* ==========================================================
   Finance Dashboard
   File : js/utils.js
   Part : 2/3
   Description : Collection, Date & Performance Helpers
   ========================================================== */


/* ==========================================
   GROUP BY
========================================== */

function groupBy(array,key){

    return array.reduce(

        (result,item)=>{

            const value=item[key] ?? "";

            if(!result[value]){

                result[value]=[];

            }

            result[value].push(item);

            return result;

        },

        {}

    );

}


/* ==========================================
   SUM BY
========================================== */

function sumBy(array,key){

    return array.reduce(

        (total,item)=>{

            return total + toNumber(item[key]);

        },

        0

    );

}


/* ==========================================
   UNIQUE
========================================== */

function unique(array){

    return [...new Set(array)];

}


/* ==========================================
   SORT DATE DESC
========================================== */

function sortDateDesc(array,key="tanggal"){

    return [...array].sort(

        (a,b)=>{

            return new Date(b[key]) - new Date(a[key]);

        }

    );

}


/* ==========================================
   SORT DATE ASC
========================================== */

function sortDateAsc(array,key="tanggal"){

    return [...array].sort(

        (a,b)=>{

            return new Date(a[key]) - new Date(b[key]);

        }

    );

}


/* ==========================================
   SORT NOMINAL DESC
========================================== */

function sortNominalDesc(array,key="nominal"){

    return [...array].sort(

        (a,b)=>{

            return toNumber(b[key]) - toNumber(a[key]);

        }

    );

}


/* ==========================================
   CAPITALIZE
========================================== */

function capitalize(text){

    if(!text) return "";

    return text

        .toLowerCase()

        .replace(

            /\b\w/g,

            char=>char.toUpperCase()

        );

}


/* ==========================================
   DAYS REMAINING
========================================== */

function daysRemaining(){

    const today=new Date();

    const lastDay=new Date(

        today.getFullYear(),

        today.getMonth()+1,

        0

    );

    const diff=

        lastDay.getDate()

        -

        today.getDate();

    return diff;

}


/* ==========================================
   MONTH DIFFERENCE
========================================== */

function monthDifference(a,b){

    const first=new Date(a);

    const second=new Date(b);

    return (

        second.getFullYear()

        -

        first.getFullYear()

    )*12+

    (

        second.getMonth()

        -

        first.getMonth()

    );

}


/* ==========================================
   GREETING
========================================== */

function getGreeting(){

    const hour=new Date().getHours();

    if(hour<11){

        return "Selamat Pagi";

    }

    if(hour<15){

        return "Selamat Siang";

    }

    if(hour<18){

        return "Selamat Sore";

    }

    return "Selamat Malam";

}


/* ==========================================
   LAST SYNC
========================================== */

function lastSync(){

    return new Date()

    .toLocaleString(

        "id-ID",

        {

            dateStyle:"long",

            timeStyle:"short"

        }

    );

}


/* ==========================================
   SLEEP
========================================== */

function sleep(ms){

    return new Promise(

        resolve=>setTimeout(

            resolve,

            ms

        )

    );

}


/* ==========================================
   DEBOUNCE
========================================== */

function debounce(callback,delay=300){

    let timeout;

    return (...args)=>{

        clearTimeout(timeout);

        timeout=setTimeout(

            ()=>callback(...args),

            delay

        );

    };

}


/* ==========================================
   THROTTLE
========================================== */

function throttle(callback,limit=250){

    let waiting=false;

    return (...args)=>{

        if(waiting) return;

        callback(...args);

        waiting=true;

        setTimeout(

            ()=>{

                waiting=false;

            },

            limit

        );

    };

}

/* ==========================================================
   Finance Dashboard
   File : js/utils.js
   Part : 3/3
   Description : UI, Budget & Insight Helpers
   ========================================================== */


/* ==========================================
   CATEGORY ICON
========================================== */

function getCategoryIcon(category){

    const icons={

        "gaji":"payments",

        "nafkah istri":"favorite",

        "bensin":"local_gas_station",

        "tagihan":"receipt_long",

        "jajan":"restaurant",

        "cicilan":"credit_card",

        "onlineshop":"shopping_bag",

        "ortu":"family_restroom",

        "tabungan":"savings",

        "lain-lain":"category"

    };

    return icons[category] || "payments";

}


/* ==========================================
   CATEGORY COLOR
========================================== */

function getCategoryColor(category){

    const colors={

        "gaji":"success",

        "nafkah istri":"success",

        "bensin":"primary",

        "tagihan":"purple",

        "jajan":"warning",

        "cicilan":"danger",

        "onlineshop":"info",

        "ortu":"purple",

        "tabungan":"success",

        "lain-lain":"secondary"

    };

    return colors[category] || "secondary";

}


/* ==========================================
   COMPACT MONEY
========================================== */

function compactMoney(value){

    value=toNumber(value);

    if(value>=1000000000){

        return `${

            (value/1000000000)

            .toFixed(1)

            .replace(".",",")

        } M`;

    }

    if(value>=1000000){

        return `${

            (value/1000000)

            .toFixed(1)

            .replace(".",",")

        } Jt`;

    }

    if(value>=1000){

        return `${

            (value/1000)

            .toFixed(1)

            .replace(".",".")

        } Rb`;

    }

    return formatNumber(value);

}


/* ==========================================
   BUDGET STATUS
========================================== */

function getBudgetStatus(percent){

    if(percent<60){

        return "Aman";

    }

    if(percent<85){

        return "Waspada";

    }

    if(percent<=100){

        return "Hampir Habis";

    }

    return "Melebihi Budget";

}


/* ==========================================
   BUDGET CLASS
========================================== */

function getBudgetClass(percent){

    if(percent<60){

        return "is-safe";

    }

    if(percent<85){

        return "is-warning";

    }

    if(percent<=100){

        return "is-danger";

    }

    return "is-over";

}


/* ==========================================
   REMOVE CHILDREN
========================================== */

function removeChildren(element){

    while(element.firstChild){

        element.removeChild(

            element.firstChild

        );

    }

}


/* ==========================================
   CREATE ELEMENT
========================================== */

function createElement(

    tag,

    className="",

    html=""

){

    const element=

    document.createElement(tag);

    element.className=className;

    element.innerHTML=html;

    return element;

}


/* ==========================================
   SHOW SKELETON
========================================== */

function showSkeleton(){

    document

    .body

    .classList

    .add("loading");

}


/* ==========================================
   HIDE SKELETON
========================================== */

function hideSkeleton(){

    document

    .body

    .classList

    .remove("loading");

}


/* ==========================================
   ERROR STATE
========================================== */

function showErrorState(message){

    console.error(message);

    alert(message);

}


/* ==========================================
   RANDOM INSIGHT
========================================== */

function randomInsight(){

    const insights=[

        "Pengeluaran kecil yang konsisten sering kali lebih berdampak daripada satu pengeluaran besar.",

        "Pastikan kebutuhan didahulukan sebelum keinginan.",

        "Menyisihkan uang di awal bulan lebih mudah daripada menyisakan di akhir bulan.",

        "Target budget yang realistis akan lebih mudah dicapai.",

        "Evaluasi pengeluaran mingguan membantu menjaga kondisi keuangan tetap sehat.",

        "Setiap rupiah memiliki tujuan. Pastikan semua tercatat dengan baik.",

        "Perencanaan yang baik akan mengurangi pengeluaran yang tidak perlu.",

        "Keuangan yang sehat dimulai dari kebiasaan kecil setiap hari."

    ];

    return insights[

        Math.floor(

            Math.random()

            * insights.length

        )

    ];

}


/* ==========================================
   DOWNLOAD CSV
========================================== */

function downloadCSV(

    filename,

    content

){

    const blob=new Blob(

        [content],

        {

            type:"text/csv"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const link=

    document.createElement("a");

    link.href=url;

    link.download=filename;

    link.click();

    URL.revokeObjectURL(url);

}


/* ==========================================
   END OF FILE
========================================== */
