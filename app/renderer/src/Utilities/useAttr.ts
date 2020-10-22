import { detachMerge } from './mergeUtils'
import uuidv4 from 'uuid/v4'

function internalUse(obj: any, path: string[], del = true): any {
	if (obj === undefined) return
	let key = path.shift()

	if (path.length === 0) {
		let o = obj[key]
		if (del && obj[key] !== undefined) delete obj[key]

		return o
	}
	return internalUse(obj[key], path, del)
}

export function use(obj: any, path: string, del = true) {
	return internalUse(obj, path.split('/'), del)
}

function internalSet(obj: any, path: string[], data: any): any {
	let key = path.shift()

	if (path.length === 0) {
		if (obj[key] === undefined) obj[key] = data
		else if (Array.isArray(obj[key]) && !Array.isArray(data))
			obj[key].push(data)
		else if (Array.isArray(obj[key]) && Array.isArray(data))
			obj[key].push(...data)
		else obj[key] = detachMerge(obj[key], data)
		return obj
	} else if (obj[key] === undefined) {
		obj[key] = {}
	}

	return internalSet(obj[key], path, data)
}

export function set(obj: any, path: string, data: any) {
	return internalSet(obj, path.split('/'), data)
}

export function uuid() {
	return uuidv4().replace(/\-/g, '_')
}
