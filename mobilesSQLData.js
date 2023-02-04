let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port jai~ ${port}!`));
const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Jalmejay@10",
  database: "postgres",
  port: 5432,
  host: "db.mrphsrqzqihkmmwbixng.supabase.co",
  ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {
  console.log(`Connected!!!`);
});
app.get("/svr/mobiles", function (req, res) {
  let brand = req.query.brand;
  let ram = req.query.ram;
  let rom = req.query.rom;
  let brandArr=brand?brand.split(","):[];
  let ramArr=ram?ram.split(","):[];
  let romArr=rom?rom.split(","):[];
  console.log(brandArr);
  console.log("Inside /svr/mobiles get api");
  const query = "SELECT * FROM mobiles";
  client.query(query, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      // console.log("result", result);
      if (brand) {
        console.log(brand);
        result.rows = result.rows.filter((e) =>brandArr.find(m=>m===e.brand));
      }
      if (ram) {
        console.log(ram);
        result.rows = result.rows.filter(
          (e) => ramArr.find(m=>m===e.ram)
        );
      }
      if (rom) {
        console.log(rom);
        result.rows = result.rows.filter((e) =>romArr.find(m=>m===e.rom));
      }
      // console.log("result.row", result.rows);
      res.send(result.rows);
      
    }
  });
});
app.get("/svr/mobiles/:id", function (req, res) {
  let id = +req.params.id;
  let values = [id];
  const query = "SELECT * FROM mobiles WHERE id=$1";
  client.query(query, values, function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
      
    }
  });
});
app.get("/svr/mobiles/brand/:brand", function (req, res) {
  let brand = req.params.brand;
  console.log(brand);
  let values = [brand];
  console.log(values);
  let query = "SELECT * FROM mobiles WHERE brand=$1";
  client.query(query, values, function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
      
    }
  });
});
app.get("/svr/mobiles/ram/:ram", function (req, res) {
  let ramStr = req.params.ram;
  console.log(ramStr);
  let query = "SELECT * FROM mobiles WHERE ram=$1";
  client.query(query, [ramStr], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
      
    }
  });
});
app.get("/svr/mobiles/rom/:rom", function (req, res) {
  let romStr = req.params.rom;
  console.log(romStr);
  let query = "SELECT * FROM mobiles WHERE rom=$1";
  client.query(query, [romStr], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
      
    }
  });
});
app.get("/svr/mobiles/os/:os", function (req, res) {
  let osStr = req.params.os;
  console.log(osStr);
  let query = "SELECT * FROM mobiles WHERE os=$1";
  client.query(query, [osStr], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
      
    }
  });
});
app.post("/svr/mobiles", function (req, res) {
  console.log("Inside post of mobiles");
  let body = req.body;
  const query = "SELECT * FROM mobiles";
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else {
      console.log(result.rows);
        newmobiles = { ...body };
      console.log(newmobiles);
      let values = Object.values(newmobiles);
      console.log("values", values);
      const query = `INSERT INTO mobiles (name,price,brand,ram,rom,os) VALUES ($1,$2,$3,$4,$5,$6)`;
      client.query(query, values, function (err, result) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(`${result.rows} insertion successfull`);
          
        }
      });
    }
  });
});

app.put("/svr/mobiles/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  console.log("id put",id);
  let query = "SELECT * FROM mobiles";
  client.query(query, function (err, result) {
    if (err) {
      console.log("error");
      res.status(400).send(err);
    } else {
      let index = result.rows.findIndex((e) => e.id === id);
      console.log(index);
      if (index >= 0) {
        let update=[{...body,id:id}];
        let arr=update.map(e=>[e.name,e.price,e.brand,e.ram,e.rom,e.os,e.id])
        let values = Object.values(body);
        console.log("arr",arr[0]);//name,price,brand,ram,rom,os
        console.log("values",values);//name,price,brand,ram,rom,os
        const query =
          "UPDATE mobiles SET name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 WHERE id=$7";
        client.query(query, arr[0], function (err, result) {
          if (err) res.status(400).send(err);
          else {
            res.send(update);
            
          }
        });
      } else {
        res.status(400).send("No Employee Found");
      }
    }
  });
});

app.delete("/svr/mobiles/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  console.log(id);
  const query = "SELECT * FROM mobiles";
  client.query(query, function (err, result) {
    if (err) res.status(400).send(err);
    else {
      let index = result.rows.findIndex((e) => e.id === id);
      if (index >= 0) {
        let deleteEmp = { ...body, empcode: id };
        const query = "DELETE FROM mobiles WHERE id=$1";
        client.query(query, [id], function (err, result) {
          if (err) res.status(404).send(err);
          else {
            res.send(deleteEmp);
          }
        });
      } else {
        res.status(404).send("No Mobile Found");
      }
    }
  });
});
