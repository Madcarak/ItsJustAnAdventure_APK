function animateLootToInventory(imgSrc, startElement, targetElement) {

console.log("Animation déclenchée");


    if (!startElement || !targetElement) {
        console.warn("Animation impossible : élément manquant");
        return;
    }

    const startRect = startElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

const lootImg = document.createElement("img");
lootImg.src = imgSrc;

lootImg.style.position = "fixed";
lootImg.style.left = "200px";
lootImg.style.top = "200px";
lootImg.style.width = "100px";
lootImg.style.height = "100px";
lootImg.style.zIndex = "999999999";
lootImg.style.pointerEvents = "none";

lootImg.style.border = "5px solid red";

document.body.appendChild(lootImg);


    requestAnimationFrame(() => {

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    lootImg.style.transform =
        `translate(${deltaX}px, ${deltaY}px) scale(0.3)`;

    lootImg.style.opacity = "0.2";
});



    setTimeout(() => {
        lootImg.remove();
    }, 700);
}
