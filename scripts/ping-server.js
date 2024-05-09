async function pingServer() {
  const res = await fetch(
    "https://interview-experience-backend.onrender.com/?query=%7B__typename%7D",
    {
      headers: {
        "apollo-require-preflight": true,
      },
    }
  );
  const data = await res.json();
  console.log("server pinged data: ", data);
}

pingServer()
  .then(function () {
    console.log("pinged server");
  })
  .catch(function (error) {
    console.error("error in pinging server: ", error);
  });
