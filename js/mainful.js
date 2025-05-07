let model = document.getElementById("modelInput");
let shase = document.getElementById("shaseInput");
let motor = document.getElementById("motorInput");
let store = document.getElementById("storeInput");
let color = document.getElementById("colourInput");
let arrData = [];
let currentEditingId = null;

window.addEventListener("load", getProducts);
let isAdmin = false;

async function initApp() {
  const password = prompt("من فضلك أدخل كلمة مرور الإدارة:");

  if (password === "123456") {
    isAdmin = true;
    alert("تم الدخول كأدمن ✅");
  } else {
    alert("دخول كمستخدم فقط ❗ لا يمكنك الإضافة أو الحذف أو التعديل.");
  }

  await getProducts(); // لازم بعد ما نحدد isAdmin
  displayProducts(); // دي بقى بتشوف isAdmin الحقيقي
}

window.onload = initApp;

async function addProduct() {
  if (!isAdmin) {
    alert("لا تملك صلاحية الإضافة");
    return;
  }

  if (
    !model.value ||
    !shase.value ||
    !motor.value ||
    !store.value ||
    !color.value
  ) {
    alert("اضف حميع البيانات يبني ...");
    return;
  }

  let prodData = {
    model: model.value,
    shase: shase.value,
    motor: motor.value,
    store: store.value,
    color: color.value,
  };

  let response = await fetch(
    `https://681880365a4b07b9d1cf6782.mockapi.io/elsalambikesstore/scooters`,
    {
      method: "POST",
      body: JSON.stringify(prodData),
      headers: { "Content-Type": "application/json" },
    }
  );

  let finalResponse = await response.json();
  arrData.push(finalResponse);
  console.log(finalResponse);
  displayProducts(arrData);
  alert("تمت الاضافة بنجاح....");
  clearInputs();
}

async function getProducts() {
  let response = await fetch(
    `https://681880365a4b07b9d1cf6782.mockapi.io/elsalambikesstore/scooters`
  );
  arrData = await response.json();
  displayProducts();
}

function displayProducts(data = arrData) {
  let categoryRow = "";
  for (let i = 0; i < data.length; i++) {
    categoryRow += `
    
     <tr>
        <td class="text-danger">${i + 1}</td>
        <td class='model' >${data[i].model}</td>
        <td>${data[i].shase}</td>
        <td>${data[i].motor}</td>
        <td>${data[i].store}</td>

        <td>${data[i].color}</td>
      <td>${
        isAdmin
          ? `<button class="btn btn-danger btn-sm" onclick="deleteProduct('${arrData[i].id}')">حذف</button>`
          : "🚫​"
      }</td>
        <td>${
          isAdmin
            ? `<button class="text-white btn btn-primary btn-sm" onclick="editProduct('${arrData[i].id}')">تعديل</button>`
            : "🚫​"
        }</td>


     </tr>

    `;
  }
  document.getElementById("tRow").innerHTML = categoryRow;
}
async function deleteProduct(id) {
  let confirmDelete = confirm("هل أنت متأكد من الحذف؟");
  if (!confirmDelete) return;

  let response = await fetch(
    `https://681880365a4b07b9d1cf6782.mockapi.io/elsalambikesstore/scooters/${id}`,
    {
      method: "DELETE",
    }
  );

  if (response.ok) {
    getProducts();
    alert('تم الحذف بنجاح ...')
  } else {
    alert("فشل في الحذف...");
  }
}

function editProduct(id) {
  const product = arrData.find((item) => item.id == id);
  if (!product) return;

  model.value = product.model;
  shase.value = product.shase;
  motor.value = product.motor;
  store.value = product.store;
  color.value = product.color;

  currentEditingId = id;
}
async function updateProduct() {
  if (!currentEditingId) {
    alert("اختر عنصرًا للتعديل أولاً");
    return;
  }

  let updatedData = {
    model: model.value,
    shase: shase.value,
    motor: motor.value,
    store: store.value,
    color: color.value,
  };

  let response = await fetch(
    `https://681880365a4b07b9d1cf6782.mockapi.io/elsalambikesstore/scooters/${currentEditingId}`,
    {
      method: "PUT",
      body: JSON.stringify(updatedData),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.ok) {
    console.log("Updated successfully");
    currentEditingId = null;
    alert("تم تعديل المنتج...");
    getProducts();
  } else {
    console.error("Failed to update");
  }

  clearInputs();
}
function clearInputs() {
  model.value = "";
  shase.value = "";
  motor.value = "";
  color.value = "";
  store.value = "";
}
function searchProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  const filteredData = arrData.filter(
    (product) =>
      product.model.toLowerCase().includes(searchTerm) ||
      product.shase.toLowerCase().includes(searchTerm) ||
      product.motor.toLowerCase().includes(searchTerm) ||
      product.store.toLowerCase().includes(searchTerm)
  );

  displayProducts(filteredData);
}
function logOut() {
  location.reload();
}
