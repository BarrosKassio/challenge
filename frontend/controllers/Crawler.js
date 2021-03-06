const got = require('got')
const cheerio = require('cheerio')

class Crawler {
  constructor (req) {
    this.req = req
  }

  async findPhone () {
    const response = await got(`http://${this.req.params.url}`)
    const result = response.body
    const $ = cheerio.load(result)
    const teste = $('body').text()

    const phone = teste.match(/(\(?\d{2,3}?\)?)?\s?\d{4,5}-?\d{4}/g)
    return phone
  }

  async findAddress () {
    try {
      const keys = [{ key: 'Rua' }, { key: 'Av.' }, { key: 'Av ' }, { key: 'Rod' }, { key: 'Bairro' }]
      const response = await got(`http://${this.req.params.url}`)
      const result = response.body
      const stringAddress = result.split('>')
      const address = []

      for (const item of keys) {
        const { key } = item
        for (const item of stringAddress) {
          if (item.includes(key) || item.match(/[0-9]{5}-[0-9]{3}/g)) {
            const element = item.replace(/(<.*)/g, '').trim()
            address.push(element)
          }
        }
      }
      return address
    } catch (error) {
      return error
    }
  }

  async get () {
    const data = {
      url: this.req.params.url,
      phones: await this.findPhone(),
      address: await this.findAddress()
    }
    return data
  }
}

module.exports = Crawler
