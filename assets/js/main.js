// تحميل الأدوات من ملف JSON
fetch("data/tools-index.json")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("toolsContainer");
        // مسح المحتوى القديم لضمان عدم التكرار
        container.innerHTML = ""; 

        data.tools.forEach(tool => {
            const card = document.createElement("div");
            // إضافة الكلاس الأساسي للتنسيق
            card.classList.add("tool-card"); 
            
            card.onclick = () => {
                window.location.href = `tool.html?id=${tool.id}`;
            };

            // استخدام هيكل داخلي يضمن ظهور النصوص بشكل صحيح
            card.innerHTML = `
                <h3 style="color: #d4af37 !important;">${tool.name}</h3>
                <p style="color: #fff; opacity: 0.9;">${tool.description}</p>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error("Error loading tools:", error));

// قراءة تفاصيل أداة واحدة
function loadToolDetails() {
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get("id");

    if (!toolId) return;

    fetch("data/tools-index.json")
        .then(response => response.json())
        .then(data => {
            const tool = data.tools.find(t => t.id == toolId);
            if (!tool) return;

            // إضافة فحص أمان للعناصر قبل تعديلها
            const titleEl = document.getElementById("toolTitle");
            const descEl = document.getElementById("toolDesc");
            const linkEl = document.getElementById("toolLink");

            if (titleEl) titleEl.innerText = tool.name;
            if (descEl) descEl.innerText = tool.description;
            if (linkEl) linkEl.href = tool.link;
        })
        .catch(error => console.error("Error loading tool details:", error));
}
