// تحميل الأدوات من ملف JSON
fetch("data/tools-index.json")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("toolsContainer");

        data.tools.forEach(tool => {
            const card = document.createElement("div");
            card.className = "tool-card";
            card.onclick = () => {
                window.location.href = `tool.html?id=${tool.id}`;
            };

            card.innerHTML = `
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
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

            document.getElementById("toolTitle").innerText = tool.name;
            document.getElementById("toolDesc").innerText = tool.description;
            document.getElementById("toolLink").href = tool.link;
        });
}
