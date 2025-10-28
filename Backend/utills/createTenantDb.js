const { Sequelize } = require("sequelize");
const user = require("../models/Tenant/User");
const freelancer = require("../models/Tenant/FreelancerProfile");
const clientProfile = require("../models/Tenant/ClientProfile");
const project = require("../models/Tenant/Project");
const application = require("../models/Tenant/Application");
const contract = require("../models/Tenant/Contract");
const payment = require("../models/Tenant/Payment");
const setting = require("../models/Tenant/Setting");
const role = require('../models/Tenant/role')

const createTenantDb = async (companyName) => {
  const dbName = companyName.replace(/\s+/g, "_").toLowerCase();

  const rootSequelize = new Sequelize("mysql://root@localhost/mysql");
  await rootSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

  // Create Sequelize tenant
  const tenantSequelize = new Sequelize(dbName, "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });
  
  const Role = role(tenantSequelize)
  const User = user(tenantSequelize);
  const FreelancerProfile = freelancer(tenantSequelize);
  const ClientProfile = clientProfile(tenantSequelize);
  const Project = project(tenantSequelize);
  const Application = application(tenantSequelize);
  const Contract = contract(tenantSequelize);
  const Payment = payment(tenantSequelize);
  const Setting = setting(tenantSequelize);

  // associations

  //user - role
  Role.hasMany(User, { foreignKey: "roleId"});
  User.belongsTo(Role, { foreignKey: "roleId" });

  // user - freelancer
  User.hasOne(FreelancerProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
  FreelancerProfile.belongsTo(User, { foreignKey: 'userId' });

  //user - client
  User.hasOne(ClientProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
  ClientProfile.belongsTo(User, { foreignKey: 'userId' });

  //user - setting
  User.hasOne(Setting, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Setting.belongsTo(User, { foreignKey: 'userId' });

  // client - project
  ClientProfile.hasMany(Project, { foreignKey: 'clientId', onDelete: 'CASCADE' });
  Project.belongsTo(ClientProfile, { foreignKey: 'clientId' });

  // project - application
  Project.hasMany(Application, { foreignKey: 'projectId', onDelete: 'CASCADE' });
  Application.belongsTo(Project, { foreignKey: 'projectId' });

  // freelancer - application
  FreelancerProfile.hasMany(Application, { foreignKey: 'freelancerId', onDelete: 'CASCADE' });
  Application.belongsTo(FreelancerProfile, { foreignKey: 'freelancerId' });

  // project - contract
  Project.hasOne(Contract, { foreignKey: 'projectId', onDelete: 'CASCADE' });
  Contract.belongsTo(Project, { foreignKey: 'projectId' });

  // freelancer - contract
  FreelancerProfile.hasMany(Contract, { foreignKey: 'freelancerId', onDelete: 'CASCADE' });
  Contract.belongsTo(FreelancerProfile, { foreignKey: 'freelancerId' });

  // client - contract
  ClientProfile.hasMany(Contract, { foreignKey: 'clientId', onDelete: 'CASCADE' });
  Contract.belongsTo(ClientProfile, { foreignKey: 'clientId' });

  // contract - payment
  Contract.hasMany(Payment, { foreignKey: 'contractId', onDelete: 'CASCADE' });
  Payment.belongsTo(Contract, { foreignKey: 'contractId' });


  //sync
  await tenantSequelize.sync({ alter: true });

  console.log(`✅ Tenant DB '${dbName}' synced successfully!`);

  return {
    tenantSequelize,
    Role,
    User,
    FreelancerProfile,
    ClientProfile,
    Project,
    Application,
    Contract,
    Payment,
    Setting,
  };
};

module.exports = createTenantDb;
