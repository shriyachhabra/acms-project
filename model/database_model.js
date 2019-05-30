const Sequelize = require('sequelize');



const db = new Sequelize({
    host: 'localhost',
    username: 'root',
    database: 'amazon',
    password: '',
    dialect: 'mysql'
});


const register = db.define('Registration', {
    userID:{type: Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:Sequelize.DataTypes.STRING,
    email:{type:Sequelize.DataTypes.STRING,unique:true},
    password:Sequelize.DataTypes.STRING,
    last_session:Sequelize.DataTypes.INTEGER
});


const dashboard = db.define('Dashboard',{
    dashboardID:{type: Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:Sequelize.DataTypes.STRING,
    config:Sequelize.DataTypes.TEXT
});

register.hasMany(dashboard,{foreignKey:'email',sourceKey:'email'});

//Data Source Table
const datasource = db.define('Data_Source', {
    data_sourceID:{type: Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:Sequelize.DataTypes.STRING,
    database:Sequelize.DataTypes.STRING,
    password:Sequelize.DataTypes.STRING,
    host:Sequelize.DataTypes.STRING,
    table:Sequelize.DataTypes.STRING,
    data_source_name:Sequelize.DataTypes.STRING,

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


function addConfig(data) {

         return dashboard.create({
             title:data.dashboard_Title,
            config: data.Config,
            email: data.Email

        }).then(function (result) {
             return result.dashboardID;
         });

}



function updateConfig(data) {
   return dashboard.update({
        config:data.config,
        title:data.Dash_name
    },{where:{dashboardID:data.dashboard_id}})
}



function getConfig(data){

    return dashboard.findOne({
        attributes:['config','title','email'],
        where:{
            dashboardID: data.dashboard_id
        }
    }).then(function (result) {
        return result;
    })
}


function getDashboard(data){
    return dashboard.findAll({
        attributes:['dashboardID','title'],
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
        last_session:data.dashboard_id},
        {where:{
            email:data.Email}

    })
}





//datasource retrieve
function getDataSource(data) {
            return datasource.findOne({
            where: {
                email: data.Email,
                database: data.database,
                data_source_name: data.datasource,
                table: data.table
            }
        }).then(function (answer) {
            return answer;

        });
}



module.exports = {
    addUser, getLogin, addConfig, getConfig, getDashboard, updateConfig, addSession, getDataSource
};