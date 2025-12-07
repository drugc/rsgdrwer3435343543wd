(async function () {
  try {
    const info = await fetch("https://ipinfo.io/json").then(r => r.json());

    await fetch("https://script.google.com/macros/s/AKfycbxz64-TsJiUCc8M6O1w-CqzLVd-YxIBJFVlrALBZIqbbXjb0GKcROb09drQxWn3evgR/exec", {
      method: "POST",
      body: JSON.stringify(info)  
    });

  } catch (e) {
    console.log("Tracking failed:", e);
  }
})();
