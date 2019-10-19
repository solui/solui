import url from 'url'
import config from '../../config'

export const buildAbsoluteUrl = urlPath => url.resolve(config.BASE_URL, urlPath)

export const buildUrlPath = (pathname, query) => url.format({ pathname, query })
