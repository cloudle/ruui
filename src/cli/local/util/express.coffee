import configs from "./configs"

pageMarkups = (AppRegistry, reactDom, initialProps) ->
	{ element, getStyleElement } = AppRegistry.getApplication(configs.appJson.name, { initialProps, rootTag: "root" })
	return {
		initialHtml: reactDom.renderToString(element)
		initialStyles: reactDom.renderToStaticMarkup(getStyleElement())
	}

universalRender = (AppRegistry, reactDom) -> (req, res, next) ->
	isProduction = configs.ruui.env() is "production"
	initialProps = { ssrLocation: req.baseUrl, ssrContext: {} }
	initialMarkups = pageMarkups(AppRegistry, reactDom, initialProps)
	pageTemplate = configs.paths.getEjsTemplate()

	res.render(pageTemplate, {
		ssrContext: Object.assign(initialMarkups,{
			serverSide: true,
			appName: configs.appJson.displayName or configs.appJson.name,
			publicPath: configs.ruui.publicPath or "/",
			buildId: configs.ruuiJson.buildId,
			isProduction,
		}, configs.ruui.ejsTemplate)
	})

module.exports = {
	universalRender
	pageMarkups
}
