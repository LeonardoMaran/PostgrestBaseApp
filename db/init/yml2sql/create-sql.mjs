import ejs from "ejs";
import fs from "fs";
import yml from "yaml";
import async from "async";
import path from "path";

const services = [
  {
    community: [
      "user",
      "group",
      "post",
      "star",
      "message",
      "comment",
      "follow",
      "usergroup"
    ]
    // ecommerce: ["store", "product", "address", "order", "payment"]
  }
];

export default function(dir) {
  fs.mkdirSync(dir);

  const tables = services
    .map(item => {
      const appName = Object.keys(item)[0];
      fs.mkdirSync(`${dir}/${appName}`);

      const tables = item[appName];
      return tables.map(item => `${appName}/${item}`);
    })
    .reduce((acc, val) => acc.concat(val), []);

  let init = "";
  async.mapSeries(
    tables,
    async name => {
      const text = fs.readFileSync(`./yml/${name}.yml`, "utf8");
      const config = yml.parse(text);

      const data = await ejs.renderFile("template.ejs", config);

      await fs.writeFile(`${dir}/${name}.sql`, data, err => {
        if (err) console.error(err);
      });

      init = init + `\\ir ${name}.sql\n`;
    },
    (err, results) => {
      if (err) console.error(err);

      fs.writeFile(`${dir}/init.sql`, init, err => {
        if (err) console.error(err);
      });
    }
  );
}
