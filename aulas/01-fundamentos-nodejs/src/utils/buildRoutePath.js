
export function buildRoutePath(path){

    //users/:id
        
    const routeParameterRegex = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(routeParameterRegex,'(?<$1>[a-z0-9\-_]+)')

    //console.log(pathWithParams)

   // const test = /\/users\/([a-z0-9-_]+)/
    const pathRegex = new RegExp(`^${pathWithParams}`)
    //console.log(Array.from(path.matchAll(routeParameterRegex)))

    return pathRegex
}