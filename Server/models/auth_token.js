module.exports = function(db) {

    // This model is implemented on node-orm2
    //
    // usages :
    // user.find({email: "aj@magice.co" }, function(err,users){
    //        console.log(users)
    // });
    //
    // ref : https://github.com/dresende/node-orm2

    var user = db.define('users', {
        email: String,
        provider: String,
        uid: String,
        token: String,
        token_secret: String,
        token_expires_at: Date,
        kind: String
    },{
        methods: {},
        validations:{}
    });


    return user;
};
