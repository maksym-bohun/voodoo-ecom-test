const productsList = document.querySelector(".products-list");
const chevronDownIcon = document.querySelector(".chevron-down");
const additionalInfo = document.querySelector("#additional-info");
const alphaContainer = document.querySelector("#alpha-container");
const imageContainers = document.querySelectorAll(".image-container");
const modal = document.createElement("div");
let currentItem, currentImagePosition;

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
    const minPrice = item.variants.reduce((min, variant) => {
      if (variant.price < min) {
        return variant.price;
      } else {
        return min;
      }
    }, item.variants[0].price);

    const maxPrice = item.variants.reduce((max, variant) => {
      if (variant.price > max) {
        return variant.price;
      } else {
        return max;
      }
    }, item.variants[0].price);
    let temp;

    console.log(minPrice, maxPrice);
    newProduct.id = "item-" + index;
    newProduct.className = "product-wrapper";
    newProduct.innerHTML = `<div class="image-container justify-self-center mb-20">
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
                <div class="price">${minPrice + " - " + maxPrice} KR.</div>
              </div>
              <div class="flex flex-col">
                <div class="self-end">Condition</div>
                <div class="condition">Slightly used</div>
              </div>
            </div>
            <div class="pick-up-line">
              PICK-UP IN <span class="underline ml-2"> 2200</span>
            </div>
          </div>`;

    productsList.appendChild(newProduct);
  });

  document.querySelectorAll(".product-wrapper").forEach((wrapper) =>
    wrapper.addEventListener("mouseover", (e) => {
      const targetElement = e.target.closest(".product-wrapper");
      if (targetElement === wrapper) {
        const pickUpLine = targetElement.querySelector(".pick-up-line");
        if (pickUpLine) pickUpLine.classList.add("pick-up-line-shown");
      }
    })
  );

  document.querySelectorAll(".product-wrapper").forEach((wrapper) =>
    wrapper.addEventListener("mouseleave", (e) => {
      const targetElement = e.target.closest(".product-wrapper");
      if (targetElement === wrapper) {
        const pickUpLine = targetElement.querySelector(".pick-up-line");
        if (pickUpLine) pickUpLine.classList.remove("pick-up-line-shown");
      }
    })
  );

  const convertDate = (date) => {
    const newDate = new Date(date);
    console.log(newDate);
    const day =
      newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    const month =
      newDate.getMonth() + 1 < 10
        ? "0" + newDate.getMonth()
        : newDate.getMonth();
    const year = newDate.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const createImagesSlider = () => {
    if (currentItem.images.length > 1) {
      console.log("YES");
      return `  
        <span class="chevron-left">
            <img src="./src/icons/chevron-left.svg" alt="Chevron Left" class="hidden arrow left-arrow">
        </span>
        <img class="main-image image-changable"  src="${currentItem.images[0].src}" alt="main image"/>
         <span class="chevron-right absolute top-1 right-1">
            <img src="./src/icons/chevron-right.svg" alt="Chevron Right" class="arrow right-arrow">
        </span>
        `;
    } else
      return `<img class="main-image" src="${currentItem.images[0].src}" alt="main image"/>`;
  };

  productsList.childNodes.forEach((item) => {
    item.addEventListener("click", () => {
      const itemIndex = item.id.split("-")[1];
      currentItem = data.products[itemIndex];
      modal.classList = "modal";
      modal.id = "modal";
      modal.innerHTML = `
      <div id="modal-bg" class="modal-bg"></div>

      <div class="modal-content">
        <h2 class="text-2xl font-bold mb-4">${currentItem.title}</h2>
        <div> 
            <div class='image-wrapper'>
              ${createImagesSlider()}
            </div>
            <div class="current-item-info">
                <div>Type: ${currentItem["product_type"]}</div>
                <div>
                    <p>Please choose a variant</p>
                    <select name="select-variant" id="variant">
                        ${currentItem.variants.map((variant) => {
                          return `<option id="${variant.id}" value="${variant.title}">${variant.title}</option>`;
                        })}
                    </select>
                </div>
                    <div class='availability'>
                        ${
                          currentItem.variants[0].available
                            ? "<span class='product-available'>Available</span>"
                            : "<span class='product-not-available'>Not available<span>"
                        }
                    </div>
                    <div class="current-product-price">
                        ${currentItem.variants[0].price + " KR."}
                    </div>
                    <div class="product-published-date">Published: ${convertDate(
                      currentItem["published_at"]
                    )}</div>
            </div>
        </div>

      </div>
    `;
      document.querySelector("body").appendChild(modal);
    });
  });
};

document.addEventListener("click", (e) => {
  console.log();

  console.log();
  if (Array.from(e.target.classList).includes("modal-bg")) {
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
    document.querySelector("body").removeChild(modal);
  }

  if (e.target.id === "variant") {
    document.querySelector(".current-product-price").textContent =
      currentItem.variants.filter(
        (variant) =>
          variant.id ===
          +document.querySelector("#variant").options[
            document.querySelector("#variant").selectedIndex
          ].id
      )[0].price + " KR.";

    document.querySelector(".availability").innerHTML =
      currentItem.variants.filter(
        (variant) =>
          variant.id ===
          +document.querySelector("#variant").options[
            document.querySelector("#variant").selectedIndex
          ].id
      )[0].available
        ? "<span class='product-available'>Available</span>"
        : "<span class='product-not-available'>Not available<span>";
  }

  if (Array.from(e.target.classList).includes("arrow")) {
    currentImagePosition = currentItem.images.filter(
      (image) => image.src === document.querySelector(".image-changable").src
    )[0].position;
    document.querySelector(".left-arrow").classList.remove("hidden");
    document.querySelector(".right-arrow").classList.remove("hidden");
    if (currentImagePosition === currentItem.images.length)
      document.querySelector(".right-arrow").classList.add("hidden");
    if (currentImagePosition === 1)
      document.querySelector(".left-arrow").classList.add("hidden");
    console.log(currentImagePosition);
  }

  if (Array.from(e.target.classList).includes("left-arrow")) {
    if (currentImagePosition !== 1) {
      document.querySelector(".image-changable").src =
        currentItem.images.filter(
          (image) => image.position === currentImagePosition - 1
        )[0].src;
    }
    currentImagePosition = currentItem.images.filter(
      (image) => image.src === document.querySelector(".image-changable").src
    )[0].position;
  }

  if (Array.from(e.target.classList).includes("right-arrow")) {
    if (currentImagePosition !== currentItem.images.length) {
      document.querySelector(".image-changable").src =
        currentItem.images.filter(
          (image) => image.position === currentImagePosition + 1
        )[0].src;
    }
    currentImagePosition = currentItem.images.filter(
      (image) => image.src === document.querySelector(".image-changable").src
    )[0].position;
  }
});

// document.addEventListener("mouseover", (e) => {
//   if (Array.from(e.target.classList).includes("image-wrapper")) {
//     const pickUpLine = e.target.children[e.target.children.length - 1];
//     pickUpLine.classList.add("pick-up-line-shown");
//   }
// });

alphaContainer.addEventListener("click", () => {
  if (Array.from(additionalInfo.classList).includes("hidden")) {
    additionalInfo.classList.remove("hidden");
    chevronDownIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
</svg>
`;
  } else {
    additionalInfo.classList.add("hidden");
    chevronDownIcon.innerHTML = `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>`;
  }
});

generateItems();
