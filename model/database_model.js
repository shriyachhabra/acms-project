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

//Data Source Table
const datasource = db.define('Data_Source', {
    SNo:{type: Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:Sequelize.DataTypes.STRING,
    database:Sequelize.DataTypes.STRING,
    password:Sequelize.DataTypes.STRING,
    host:Sequelize.DataTypes.STRING,
    table:Sequelize.DataTypes.STRING,
    data_source_name:Sequelize.DataTypes.STRING,
    query:Sequelize.DataTypes.STRING

});

register.hasMany(datasource,{foreignKey:'email',sourceKey:'email'});


db.sync({success: true}).then(function () {
    console.log("Database is ready");
});



function addUser(data) {
    let success;

        return register.count({where:{email:data.Email}}).then(function(count){
            if(count!=0){
                success = 0;
                return success;
            }
            else{
                return register.create({
                    username: data.User_name,
                    email: data.Email,
                    password: data.Password
                }).then(function () {
                    success = 1;
                    return success;
                });
            }
        });


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

         return dashboard.create({
             title:data.dashboard_Title,
            query: data.Query,
            email: data.Email

        }).then(function (result) {
             return result.DNo;
         });

}



function updateQuery(data) {
   return dashboard.update({
        query:data.data,
        title:data.Dash_name
    },{where:{DNo:data.dno}})
}



function getQuery(data){

    return dashboard.findOne({
        attributes:['query','title','email'],
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

/*function getLastDashboard(data) {
    return dashboard.findOne({
        attributes:['title'],
        where:{
            DNo:data.id
        }
    })
}*/




function addSession(data){
    return register.update({
        last_session:data.id},
        {where:{
            email:data.Email}

    })
}





//datasource retrieve
function getDataSource(data) {
    return datasource.update({
            query: data.Query
        },
        {
            where: {
                email: data.Email,
                database: data.Database,
                data_source_name: data.Data_source,
                table: data.Table,
            }

        }).then(function (result) {
            return datasource.findOne({
            where: {
                email: data.Email,
                database: data.Database,
                data_source_name: data.Data_source,
                table: data.Table
            }
        }).then(function (answer) {
            return answer;

        });
    })
}



module.exports = {
    addUser, getLogin, addQuery, getQuery, getDashboard, updateQuery, addSession, getDataSource
};