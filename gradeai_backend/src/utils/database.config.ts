import {connect} from 'mongoose'

import {MONGO_URI} from './secrets'

export const CONNECT_DB = async () => {
  try {
    const {connections} = await connect(MONGO_URI)
    console.info(`⚡️[DB]: Name:${connections[0].name}; ${connections[0].host}:${connections[0].port}`)
  } catch (err) {
    console.error(err)
  }
}
