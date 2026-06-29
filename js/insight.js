/* ==========================================================
   Finance Dashboard
   File : js/insight.js
   Description : Insight Renderer
   ========================================================== */


/* ==========================================
   CREATE CARD
========================================== */

function createInsightCard(item){

    const card=

    createElement(

        "div",

        `insight-box ${item.type||""}`

    );

    card.innerHTML=`

        <div class="insight-box__icon">

            <span class="material-symbols-outlined">

                ${item.icon}

            </span>

        </div>

        <div class="insight-box__content">

            <div class="insight-box__title">

                ${item.title}

            </div>

            <div class="insight-box__description">

                ${item.description}

            </div>

        </div>

    `;

    return card;

}


/* ==========================================
   EMPTY
========================================== */

function renderEmptyInsight(){

    const wrapper=

    DOM.insightContainer;

    if(!wrapper) return;

    wrapper.innerHTML=`

    <div class="empty-card">

        <div class="empty-card__icon">

            <span class="material-symbols-outlined">

                psychology

            </span>

        </div>

        <div class="empty-card__title">

            Belum Ada Insight

        </div>

        <div class="empty-card__description">

            Insight akan muncul setelah dashboard
            memiliki data transaksi yang cukup.

        </div>

    </div>

    `;

}


/* ==========================================
   RENDER
========================================== */

function renderInsight(){

    const wrapper=

    DOM.insightContainer;

    if(!wrapper) return;

    removeChildren(wrapper);

    const insights=

    Finance.dashboard.insight;

    if(

        !insights ||

        insights.length===0

    ){

        renderEmptyInsight();

        return;

    }

    insights.forEach(item=>{

        wrapper.appendChild(

            createInsightCard(item)

        );

    });

}


/* ==========================================
   REFRESH
========================================== */

function refreshInsight(){

    renderInsight();

}


/* ==========================================
   PUBLIC API
========================================== */

window.InsightRenderer={

    render:

    refreshInsight,

    refresh:

    refreshInsight

};


/* ==========================================
   END OF FILE
========================================== */
