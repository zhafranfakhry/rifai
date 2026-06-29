/* ==========================================================
   Finance Dashboard
   File : js/api.js
   Description : OpenSheet API Service
   ========================================================== */


/* ==========================================
   FETCH JSON
========================================== */

async function fetchJSON(url){

    const response=

    await fetch(url,{

        cache:"no-store"

    });

    if(!response.ok){

        throw new Error(

            `HTTP ${response.status}`

        );

    }

    return await response.json();

}


/* ==========================================
   LOAD TRANSACTION
========================================== */

async function loadTransactions(){

    const data=

    await fetchJSON(

        API.TRANSACTION()

    );

    return data

    .filter(

        item=>

        item.tanggal &&

        item.jenis &&

        item.nominal

    )

    .map(

        item=>({

            tanggal:

            item.tanggal.trim(),

            jenis:

            item.jenis

            .trim()

            .toLowerCase(),

            kategori:

            item.kategori

            .trim()

            .toLowerCase(),

            keterangan:

            item.keterangan

            ?.trim() || "",

            nominal:

            toNumber(

                item.nominal

            )

        })

    );

}


/* ==========================================
   LOAD PLANNING
========================================== */

async function loadPlanning(){

    const data=

    await fetchJSON(

        API.PLANNING()

    );

    return data

    .filter(

        item=>

        item.Bulan &&

        item.Kategori &&

        item.Budget

    )

    .map(

        item=>({

            bulan:

            item.Bulan.trim(),

            kategori:

            item.Kategori

            .trim()

            .toLowerCase(),

            budget:

            toNumber(

                item.Budget

            )

        })

    );

}


/* ==========================================
   SAVE RAW DATA
========================================== */

async function fetchFinanceData(){

    try{

        showSkeleton();

        const

        [

            transaksi,

            planning

        ]

        =

        await Promise.all([

            loadTransactions(),

            loadPlanning()

        ]);

        Finance.raw.transaksi=

        transaksi;

        Finance.raw.planning=

        planning;

        Finance.sync=

        new Date();

        return true;

    }

    catch(error){

        console.error(error);

        showErrorState(

            "Tidak dapat mengambil data dari Spreadsheet."

        );

        return false;

    }

    finally{

        hideSkeleton();

    }

}

/* ==========================================================
   Finance Dashboard
   File : js/api.js
   Part : 2/2
   Description : Cache, Refresh & Bootstrap
   ========================================================== */


/* ==========================================
   LOCAL STORAGE
========================================== */

const CACHE_KEY="finance-dashboard-cache-v1";


/* ==========================================
   SAVE CACHE
========================================== */

function saveCache(){

    const payload={

        transaksi:
        Finance.raw.transaksi,

        planning:
        Finance.raw.planning,

        sync:
        new Date().toISOString()

    };

    localStorage.setItem(

        CACHE_KEY,

        JSON.stringify(payload)

    );

}


/* ==========================================
   LOAD CACHE
========================================== */

function loadCache(){

    try{

        const cache=

        JSON.parse(

            localStorage.getItem(CACHE_KEY)

        );

        if(!cache) return false;

        Finance.raw.transaksi=

        cache.transaksi || [];

        Finance.raw.planning=

        cache.planning || [];

        Finance.sync=

        cache.sync
        ?
        new Date(cache.sync)
        :
        null;

        return true;

    }

    catch(error){

        console.warn(

            "Cache rusak.",

            error

        );

        return false;

    }

}


/* ==========================================
   CLEAR CACHE
========================================== */

function clearCache(){

    localStorage.removeItem(

        CACHE_KEY

    );

}


/* ==========================================
   LAST SYNC
========================================== */

function updateLastSync(){

    if(!Finance.sync) return;

    if(!DOM.syncText) return;

    DOM.syncText.textContent=

    Finance.sync.toLocaleString(

        APP.LOCALE,

        {

            dateStyle:"long",

            timeStyle:"short"

        }

    );

}


/* ==========================================
   CONNECTION
========================================== */

function isOnline(){

    return navigator.onLine;

}


/* ==========================================
   REFRESH
========================================== */

async function refreshData(){

    const success=

    await fetchFinanceData();

    if(!success){

        return false;

    }

    saveCache();

    updateLastSync();

    return true;

}


/* ==========================================
   LOAD APPLICATION
========================================== */

async function loadApplicationData(){

    const hasCache=

    loadCache();

    if(hasCache){

        updateLastSync();

    }

    if(

        !isOnline() &&

        hasCache

    ){

        return true;

    }

    const success=

    await refreshData();

    return success || hasCache;

}


/* ==========================================
   AUTO REFRESH
========================================== */

function startAutoRefresh(){

    setInterval(

        async()=>{

            if(

                !navigator.onLine

            ){

                return;

            }

            await refreshData();

        },

        1000*60*5

    );

}


/* ==========================================
   NETWORK EVENT
========================================== */

window.addEventListener(

    "online",

    refreshData

);

window.addEventListener(

    "offline",

    ()=>{

        console.warn(

            "Offline mode"

        );

    }

);


/* ==========================================
   END OF FILE
========================================== */
