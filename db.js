import Sequelize from 'sequelize'

const DB_NAME = 'houses'
const DB_USER = 'root'
const DB_PASS = 'root'

export const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, { dialect: 'postgres' })
export const House = db.define('House', {
	lat: Sequelize.FLOAT,
	lng: Sequelize.FLOAT,
	postedOn: Sequelize.DATE,
	craigslistId: Sequelize.INTEGER
	price: Sequelize.INTEGER
})