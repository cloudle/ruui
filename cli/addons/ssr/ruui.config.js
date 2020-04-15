const env = () => process.env.ENV || 'development';
const host = () => process.env.HOST || 'localhost';
const port = () => process.env.DEV_PORT || 3000;
const isProduction = env() === 'production';


module.exports = {
	env,
	publicPath: isProduction ? '/' : `http://${host()}:${port()}/`,
	port
};