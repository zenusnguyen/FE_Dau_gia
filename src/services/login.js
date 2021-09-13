import { backend_dev } from "../constants";

export async function login(data) {
  console.log("data: ", data);
  const url = `${backend_dev}/auth/local`;

  const response = await fetch(url, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  const result = await response.json();

  setTimeout(() => {
    console.log("result: ", result);
    localStorage.setItem("user", JSON.stringify(result));
  }, 1000);

  return result;
}
