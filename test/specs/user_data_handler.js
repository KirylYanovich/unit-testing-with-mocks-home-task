const UserDataHandler = require('../../src/data_handlers/user_data_handler.js')
const users = require('../data/users')
const usersEmails = require('../data/usersEmails')
const nock = require('nock')
const sinon = require('sinon')
const expect = require('chai').expect

describe('/test endpoint', () => {
  let userDataHandler

  beforeEach(() => {
    userDataHandler = new UserDataHandler()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('loadUsers should return error if error is got', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(400)
    try {
      await userDataHandler.loadUsers()
    } catch (err) {
      expect(err.message).to.equal('Failed to load users data: Error: Request failed with status code 400')
    }
  })

  it('getUserEmailsList should return list of emails', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, users)

    await userDataHandler.loadUsers()
    const userEmailsList = await userDataHandler.getUserEmailsList()

    expect(userEmailsList).to.equal(usersEmails)
  })

  it('getUserEmailsList should return Error if no users provided', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, [])

    await userDataHandler.loadUsers()
    try {
      await userDataHandler.getUserEmailsList()
    } catch (err) {
      expect(err.message).to.equal('No users loaded!')
    }
  })

  it('getNumberOfUsers should return number of users', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, users)

    await userDataHandler.loadUsers()
    const numberOfUsers = await userDataHandler.getNumberOfUsers()

    expect(numberOfUsers).to.equal(10)
  })

  it('getNumberOfUsers should return 0 if no users provided', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, [])

    await userDataHandler.loadUsers()
    const numberOfUsers = await userDataHandler.getNumberOfUsers()

    expect(numberOfUsers).to.equal(0)
  })

  it('isMatchingAllSearchParams should return true if the only parameter is matched', async () => {
    const user = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496'
        }
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets'
      }
    }
    const searchParamsObject = { website: 'hildegard.org' }

    return expect(await userDataHandler.isMatchingAllSearchParams(user, searchParamsObject)).to.be.true
  })

  it('isMatchingAllSearchParams should return true if all parameters are matched', async () => {
    const user = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496'
        }
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets'
      }
    }
    const searchParamsObject = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496'
        }
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets'
      }
    }

    return expect(await userDataHandler.isMatchingAllSearchParams(user, searchParamsObject)).to.be.true
  })

  it('isMatchingAllSearchParams should return false if any parameter is not matched', async () => {
    const user = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496'
        }
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets'
      }
    }
    const searchParamsObject = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret123',
      email: 'Sincere@april.biz'
    }

    return expect(await userDataHandler.isMatchingAllSearchParams(user, searchParamsObject)).to.be.false
  })

  it('findUsers should return all users matched', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, users)

    const searchParamsObject = { username: 'Antonette' }
    const expectedMatchingUsers = [{
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      address: {
        street: 'Victor Plains',
        suite: 'Suite 879',
        city: 'Wisokyburgh',
        zipcode: '90566-7771',
        geo: {
          lat: '-43.9509',
          lng: '-34.4618'
        }
      },
      phone: '010-692-6593 x09125',
      website: 'anastasia.net',
      company: {
        name: 'Deckow-Crist',
        catchPhrase: 'Proactive didactic contingency',
        bs: 'synergize scalable supply-chains'
      }
    }]

    await userDataHandler.loadUsers()
    const matchingUsers = await userDataHandler.findUsers(searchParamsObject)

    expect(matchingUsers).to.deep.equal(expectedMatchingUsers)
  })

  it('findUsers should return all users if all they are matched', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, users)

    sinon.stub(userDataHandler, 'isMatchingAllSearchParams').callsFake(function fakeFn () {
      return true
    })
    const searchParamsObject = {}

    await userDataHandler.loadUsers()
    const matchingUsers = await userDataHandler.findUsers(searchParamsObject)

    expect(matchingUsers).to.deep.equal(users)
  })

  it('findUsers should return error if no parameters are provided', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, users)

    const searchParamsObject = {}

    await userDataHandler.loadUsers()
    try {
      await userDataHandler.findUsers(searchParamsObject)
    } catch (err) {
      expect(err.message).to.equal('No search parameters provided!')
    }
  })

  it('findUsers should return error if no users loaded', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, [])

    const searchParamsObject = { username: 'Antonette' }

    await userDataHandler.loadUsers()
    try {
      await userDataHandler.findUsers(searchParamsObject)
    } catch (err) {
      expect(err.message).to.equal('No users loaded!')
    }
  })

  it('findUsers should return error if no users matched', async () => {
    nock('http://localhost:3000')
      .get('/users')
      .reply(200, users)

    const searchParamsObject = { username: 'test' }

    await userDataHandler.loadUsers()
    try {
      await userDataHandler.findUsers(searchParamsObject)
    } catch (err) {
      expect(err.message).to.equal('No matching users found!')
    }
  })
})
