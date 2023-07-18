const axios = require('axios');
const fs = require('fs');
const path = require('path');

function saveToLocal(newData) {
  const filePath = path.join(__dirname, 'dataset.json');

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    let data = [];

    // If the file exists, read it and parse it to a JavaScript object
    if (!err) {
      const oldDataRaw = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(oldDataRaw);
    }
    // Concatenate the old and new data
    data = data.concat(newData);

    // Write the full data back into the file
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('Data saved to dataset.json');
    });
  });
}

async function fetchTransactions() {
  const response = await axios.get("http://localhost:9000/testAPI");
  return response.data;
}

fetchTransactions()
  .then(newData => {
    saveToLocal(newData);
  })
  .catch(error => console.error(error));