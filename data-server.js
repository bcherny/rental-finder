import Sequelize from 'sequelize'

const DB_NAME = 'houses'
const DB_USER = 'root'
const DB_PASS = 'root'

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, { dialect: 'postgres' })

