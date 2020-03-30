export function extractBorderRadius(baseStyles) {
	return [
		'borderRadius',
		'borderTopLeftRadius',
		'borderTopRightRadius',
		'borderBottomLeftRadius',
		'borderBottomRightRadius',
	].reduce((accumulate, currentAttribute) => {
		if (baseStyles[currentAttribute]) {
			accumulate[currentAttribute] = baseStyles[currentAttribute];
		}

		return accumulate;
	}, {});
}
