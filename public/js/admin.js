function open_new_window(location) {
    window.location.href = location;
};

async function logIn(usernameOrEmail, password){
  await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
        username: usernameOrEmail,
        email: usernameOrEmail,
        password: password
    })
  }).then(async (response) => {
    let responseJson = await response.json();
    if (response.ok) {
        if (responseJson.data.roleid !== 1) {
          await $("#usernameOrEmail").val("");
          await $("#password").val("");
          return $("#modalUnauthorizedError").modal("show");
        } else {
          return open_new_window("http://localhost:3000/admin/products");
        };
    };
    return Promise.reject(response);
  }).catch(async () => {
    $("#modalLoginError").modal("show");
  });
};

async function logOut(){
    await fetch('http://localhost:3000/logout', {
      method: 'GET',
      headers: {
        'content-type': 'application/JSON'
      }
    }).then(async (response) => {
      if (response.ok) {
        location.reload();
      };
      return Promise.reject(response);
    }).catch(() => {
      open_new_window("http://localhost:3000");
    });
};

async function addProduct(product, description, unitprice, imgurl, quantity, brandid, categoryid, token){
  await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      product: product,
      description: description,
      unitprice: parseFloat(unitprice),
      imgurl: imgurl,
      quantity: parseInt(quantity),
      brandid: parseInt(brandid),
      categoryid: parseInt(categoryid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Product added';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'there already exists such product!') {
      $("#modalAdd").modal("hide");
      $("#modalDuplicateError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function changeProduct(productid, product, description, unitprice, imgurl, quantity, isdeleted, brandid, categoryid, token){
  if (isdeleted === true) {
    isdeleted = 0;
  } else {
    isdeleted = 1;
  };

  await fetch('http://localhost:3000/products', {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      productid: parseInt(productid),
      product: product,
      description: description,
      unitprice: parseFloat(unitprice),
      imgurl: imgurl,
      quantity: parseInt(quantity),
      isdeleted: isdeleted,
      brandid: parseInt(brandid),
      categoryid: parseInt(categoryid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Product changed';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'there already exists such product!') {
      $(`#modal${productid}`).modal("hide");
      $("#modalDuplicateError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function deleteProduct(productid, token){
  await fetch('http://localhost:3000/products', {
    method: 'DELETE',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
        productid: parseInt(productid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Product deleted';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function addBrand(brand, token){
  await fetch('http://localhost:3000/brands', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      brand: brand
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Brand added';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'there already exists such brand!') {
      $("#modalAdd").modal("hide");
      $("#modalDuplicateError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function changeBrand(brandid, brand, token){
  await fetch('http://localhost:3000/brands', {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      brandid: parseInt(brandid),
      brand: brand
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Brand changed';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'there already exists such brand!') {
      $(`#modal${brandid}`).modal("hide");
      $("#modalDuplicateError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function deleteBrand(brandid, token){
  await fetch('http://localhost:3000/brands', {
    method: 'DELETE',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
        brandid: parseInt(brandid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Brand deleted';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'cannot remove the brand! there exists one or more products related to this brand!') {
      $("#modalCannotRemoveError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function addCategory(category, token){
  await fetch('http://localhost:3000/categories', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      category: category
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Category added';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result[0] === 'there already exists such category!') {
      $("#modalAdd").modal("hide");
      $("#modalDuplicateError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function changeCategory(categoryid, category, token){
  await fetch('http://localhost:3000/categories', {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      categoryid: parseInt(categoryid),
      category: category
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Category changed';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'there already exists such category!') {
      $(`#modal${categoryid}`).modal("hide");
      $("#modalDuplicateError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function deleteCategory(categoryid, token){
  await fetch('http://localhost:3000/categories', {
    method: 'DELETE',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      categoryid: parseInt(categoryid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Category deleted';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'cannot remove the category! there exists one or more products related to this category!') {
      $("#modalCannotRemoveError").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function changeUser(userid, firstname, lastname, address, telephone, roleid, token){
  await fetch('http://localhost:3000/users', {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      userid: parseInt(userid),
      firstname: firstname,
      lastname: lastname,
      address: address,
      telephonenumber: telephone,
      roleid: parseInt(roleid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'User changed';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function deleteUser(userid, token){
  await fetch('http://localhost:3000/users', {
    method: 'DELETE',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      userid: parseInt(userid)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'User deleted';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'You canNOT delete the admin users!') {
      $("#modalCannotRemoveError1").modal("show");
    } else if (errorMessage.data.result === 'cannot remove the user! there exists one or more carts / orders related to this user!') {
      $("#modalCannotRemoveError2").modal("show");
    } else if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};

async function changeOrder(ordernumber, status, token){
  await fetch('http://localhost:3000/orders', {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/JSON'
    },
    body: JSON.stringify({
      ordernumber: ordernumber,
      orderstatusid: parseInt(status)
    })
  }).then((response) => {
    if (response.ok) {
      const resData = 'Order changed';
      location.reload();
      return Promise.resolve(resData);
    };
    return Promise.reject(response);
  }).catch(async (response) => {
    let errorMessage = await response.json();
    if (errorMessage.data.result === 'no such user associated with given token!') {
      open_new_window("http://localhost:3000/logout");
    } else {
      location.reload();
    };
  });
};
