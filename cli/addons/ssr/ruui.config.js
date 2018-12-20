const env = () => process.env.ENV || 'development',
	isProduction = env() === 'production';

module.exports = {
	env,
	publicPath: isProduction ? '/' : 'http://localhost:3000/',
};
