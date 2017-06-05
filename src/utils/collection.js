export function collectionMutate(collection, instance, uniqueKey = 'id', merge = true, additionalMerge = {}) {
	if (!instance || !instance[uniqueKey]) {
		console.warn(`Immutable collection MUTATE require [${uniqueKey}] field of the new instance... return original collection.`, instance);
		return collection;
	}

	const itemIndex = collection.findIndex(item => item[uniqueKey] === instance[uniqueKey]);
	if (itemIndex < 0) return collection;

	const liveItem = merge ? { ...collection[itemIndex], ...instance, ...additionalMerge } : instance,
		headItems = collection.slice(0, itemIndex),
		tailItems = collection.slice(itemIndex + 1);

	return [...headItems, liveItem, ...tailItems];
}

export function collectionInsert(collection, instance, pop = true) {
	return pop ? [instance, ...collection] : [...collection, instance];
}

export function collectionDestroy(collection, instance, uniqueKey = 'id') {
	if (!instance || !instance[uniqueKey]) {
		console.warn(`Immutable collection DESTROY require [${uniqueKey}] field of the new instance... return original collection.`, instance);
		return collection;
	}

	const itemIndex = collection.findIndex(item => item[uniqueKey] === instance[uniqueKey]);
	if (itemIndex < 0) return collection;

	const headItems = collection.slice(0, itemIndex),
		tailItems = collection.slice(itemIndex + 1);

	return [...headItems, ...tailItems];
}

export function firstKeyOf(instance: Object, address?: string) {
	const result = instance[Object.keys(instance)[0]];

	if (address && result[address]) {
		return result[address];
	} else {
		return result;
	}
}
