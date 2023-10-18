const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "my_database",
  password: "postgres",
  port: 5432,
});

const getClientData = (body) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "SELECT * FROM clientdata where clientcode = $1",
      [body],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
};

// *file upload with date
// client master upload
// *getFromFile internal node level handling
// data from date and to date for client

// insert into

const fileUpload = (body) => {
  return new Promise(function (res, rej) {
    
  });
};

const saveCsvPerDay = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;

    pool.query(
      "INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(
          `A new merchant has been added added: ${JSON.stringify(
            results.rows[0]
          )}`
        );
      }
    );
  });
};

const deleteMerchant = (merchantId) => {
  return new Promise(function (resolve, reject) {
    const id = parseInt(merchantId);

    pool.query(
      "DELETE FROM merchants WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Merchant deleted with ID: ${id}`);
      }
    );
  });
};

module.exports = {
  getClientData,
  saveCsvPerDay,
  deleteMerchant,
  fileUpload,
};
