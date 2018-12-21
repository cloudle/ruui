import fs from "fs"
import path from "path"
import { localModule, writeFile } from "./helper"
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

	res.render pageTemplate,
		ssrContext: Object.assign(initialMarkups,{
			serverSide: true,
			appName: configs.appJson.displayName or configs.appJson.name,
			publicPath: configs.ruui.publicPath or "/",
			buildId: configs.ruuiJson.buildId,
			isProduction,
		}, configs.ruui.ejsTemplate)

defaultPageExtractor = (routeConfig) -> routeConfig[0]?.routes or []
hydrate = (AppRegistry, reactDom, routeConfig, pageExtractor = defaultPageExtractor) ->
	ejs = require(localModule("node_modules", "ejs"))
	isProduction = configs.ruui.env() is "production"
	pages = pageExtractor(routeConfig)
	templatePath = configs.paths.getEjsTemplate()
	unless fs.existsSync
		console.log "can not find page template at #{templatePath}"
		return
	pageTemplate = fs.readFileSync(templatePath, "utf-8")
	generateMarkup = ejs.compile(pageTemplate, {})

	for page in pages
		pageLocation = page.path or "/404"
		initialMarkups = pageMarkups(AppRegistry, reactDom, { ssrLocation: pageLocation, ssrContext: {} })
		options =
			ssrContext: Object.assign(initialMarkups, {
				serverSide: true,
				appName: configs.appJson.displayName or configs.appJson.name,
				publicPath: configs.ruui.publicPath or "/",
				buildId: configs.ruuiJson.buildId,
				isProduction,
			}, configs.ruui.ejsTemplate)
		finalMarkups = generateMarkup(options)

		fileName = "#{pageLocation.replace('/', '')}.html"
		fileName = "index.html" if page.path is "/"
		writeFile(path.resolve(configs.paths.ruui, fileName), finalMarkups)

module.exports = {
	universalRender
	pageMarkups
	hydrate
}
