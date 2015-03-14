var mongoose    = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/rbAppDb', {db: {safe: true }});
var Schema = mongoose.Schema;


db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function callback () {
    console.log("Connected!")
});


var userSchema = Schema(
    {
        name:                   {type: String},
        password:				{type: String}
    }
);

var projectSchema = Schema(
    {
        name:           {type: String, required: true, unique: true},
        username:       {type: String},
        tasks:          [{order: Number, content: String, deadline: Date, isDone : Boolean}]
    }
);


var user		= db.model('user', userSchema);
var project	= db.model('project', projectSchema);

/* ---- Exports ---- */

exports.user                = user;
exports.project             = project;
// module.exports              = db;