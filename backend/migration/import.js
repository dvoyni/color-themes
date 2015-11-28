var Database = require("../Database");

var themes;

Database.connect_p(process.env.SOURCE_DB)
    .then(() => Database.models.Theme.find({}))
    .then(allThemes => {
        themes = allThemes;
        return Database.disconnect_p();
    })
    .then(() => Database.connect_p(process.env.MONGO_URL))
    .then(() => Database.models.Theme.remove({}))
    .then(() => themes.map(data => new Database.models.Theme(data).save()))
    .all(() => process.exit())
    .catch(err => console.log(err));

