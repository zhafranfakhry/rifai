/* ==========================================================
   Finance Dashboard
   File : js/main.js
   Description : Application Entry Point
   ========================================================== */


/* ==========================================
   INITIALIZE
========================================== */

async function initializeApp(){

    try{

        showDashboardLoading();

        const loaded=

        await loadApplicationData();

        if(!loaded){

            hideDashboardLoading();

            return;

        }

        rebuildDashboard();

        DashboardRenderer.render();

        bindDashboardMonth();

        bindTransactionFilter();

        startAutoRefresh();

        console.log(

            `${APP.NAME} v${APP.VERSION} loaded.`

        );

    }

    catch(error){

        console.error(error);

        showErrorState(

            "Terjadi kesalahan saat memuat dashboard."

        );

    }

    finally{

        hideDashboardLoading();

    }

}


/* ==========================================
   REFRESH
========================================== */

async function refreshApplication(){

    showDashboardLoading();

    await refreshData();

    rebuildDashboard();

    DashboardRenderer.render();

    hideDashboardLoading();

}


/* ==========================================
   KEYBOARD SHORTCUT
========================================== */

document.addEventListener(

    "keydown",

    event=>{

        /* Ctrl + R
           Refresh Dashboard */

        if(

            event.ctrlKey &&

            event.key.toLowerCase()==="r"

        ){

            event.preventDefault();

            refreshApplication();

        }

        /* Ctrl + P
           Print */

        if(

            event.ctrlKey &&

            event.key.toLowerCase()==="p"

        ){

            event.preventDefault();

            DashboardRenderer.export();

        }

    }

);


/* ==========================================
   VISIBILITY
========================================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            document.hidden

        ){

            return;

        }

        refreshApplication();

    }

);


/* ==========================================
   DOM READY
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);


/* ==========================================
   PUBLIC
========================================== */

window.App={

    init:

    initializeApp,

    refresh:

    refreshApplication

};


/* ==========================================
   END OF FILE
========================================== */
