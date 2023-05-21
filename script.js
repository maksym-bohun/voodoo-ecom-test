const productsList = document.querySelector(".products-list");
const modal = document.createElement("div");

const fetchData = async () => {
  const res = await fetch(
    "https://voodoo-sandbox.myshopify.com/products.json?limit=12"
  );
  const data = await res.json();
  return data;
};

const generateItems = async () => {
  const data = await fetchData();
  data.products.forEach((item, index) => {
    // productsList.appendChild(imageContainer.innerHTML);
    const newProduct = document.createElement("div");
    newProduct.id = "item-" + index;
    newProduct.className = "product-wrapper";
    newProduct.innerHTML = `
        <div class="image-container justify-self-center mb-20 ">
        <span class="condition-status">USED</span>
        <img
        src="${item.images[0].src}"
        alt="item image"
        class="h-full border border-black rounded z-10 justify-self-center"
        />
        <!-- <div class="h-full border border-black rounded"></div> -->
        <div class="info-container">
        <div class="font-semibold text">
        <div class="product-name">${item.title}</div>
        <div class="price">000 KR.</div>
        </div>
        <div class="flex flex-col">
        <div class="self-end">Condition</div>
        <div class="condition">Slightly used</div>
              </div>
            </div>
            <div
            class="pick-up-line"
            >
            PICK-UP IN <span class="underline ml-2"> 2200</span>
            </div>
            </div>
            `;

    productsList.appendChild(newProduct);
    const brElement = document.createElement("br");
    if ((index + 1) % 4 === 0) productsList.appendChild(brElement);
  });
};

generateItems();
