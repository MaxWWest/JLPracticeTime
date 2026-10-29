(function() {
    "use strict";
    const toggle=document.querySelector("#print-furigana");
    const button=document.querySelector("#print-save");
    toggle.addEventListener("change",()=>document.body.classList.toggle("no-furigana",!toggle.checked));
    document.querySelector("#print-explanations")?.addEventListener("change",event=>{
        document.body.classList.toggle("answers-only",!event.target.checked);
    });
    button.addEventListener("click",async()=>{
        button.disabled=true;
        try {
            await document.fonts.ready;
            window.print();
        }catch{
            document.querySelector("#print-status").textContent="Printing could not open. Use your browser's Print command.";
        }finally{button.disabled=false;}
    });
})();
