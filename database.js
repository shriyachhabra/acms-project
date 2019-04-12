const Sequelize = require('sequelize');



const db = new Sequelize({
    host: 'localhost',
    username: 'root',
    database: 'amazon',
    password: '',
    dialect: 'mysql'
});



const register = db.define('Registration', {
    SNo:{type: Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:Sequelize.DataTypes.STRING,
    email:{type:Sequelize.DataTypes.STRING,unique:true},
    password:Sequelize.DataTypes.STRING,
    last_session:Sequelize.DataTypes.INTEGER
});



const dashboard = db.define('Database',{
    DNo:{type: Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:Sequelize.DataTypes.STRING,
    query:Sequelize.DataTypes.TEXT
});

register.hasMany(dashboard,{foreignKey:'email',sourceKey:'email'});



db.sync({success: true}).then(function () {
    console.log("Database is ready");
});



function addDo(data) {
    return register.create({
        username: data.User_name,
        email: data.Email,
        password: data.Password
    })
}


function getLogin(data){
    return register.findOne({
        where:{
            email: data.Email,
            password: data.Password
        }
    })
}


function addQuery(data) {

     return register.findOne({attributes:['email'],where:{email:data.Email}}).then(function (fetch) {
        console.log(fetch.email);
         return dashboard.create({
             title:data.dashboard_Title,
            query: data.Query,
            email: fetch.email

        }).then(function (result) {
             //console.log(result.DNo);
             return result.DNo;
         });
    })

}



function updateQuery(data) {
   return dashboard.update({
        query:data.data
    },{where:{DNo:data.dno}})
}



function getQuery(data){

    return dashboard.findOne({
        attributes:['query'],
        where:{
            DNo: data.id
        }
    }).then(function (result) {
        return result;
    })
}


function getDashboard(data){
    return dashboard.findAll({
        attributes:['DNo','title'],
        where:{
            email:data.Email
        }
    })
}




function addSession(data){
    return register.update({
        last_session:data.id},
        {where:{
            email:data.Email}

    })
}

module.exports = {
    addDo, getLogin, addQuery, getQuery, getDashboard, updateQuery, addSession
};