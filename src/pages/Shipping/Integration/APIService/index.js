export const getEasyshipAccount = async (apikey) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apikey}`,
    },
  };
  try {
    const response = await fetch(
      "https://api.easyship.com/2023-01/account",
      options
    );
    const response_1 = await response.json();
    // console.log(response_1);
    return response_1;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getAllCourier = async (apikey, umbrella_name, country="") => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apikey}`,
    },
  };
  try {
    const response = await fetch(
      `https://api.easyship.com/2023-01/couriers?umbrella_name=${umbrella_name}&country_alpha2=${country.toUpperCase()}&page=1&per_page=100`,
      options
    );
    const response_1 = await response.json();
    // console.log(response_1);
    return response_1;
  } catch (err) {
    console.error(err);
    return err;
  }
};
