import 'dotenv/config'
import mongoose from 'mongoose'

async function cleanup() {
  try {
    const uri = process.env.MONGODB_URI.replace(/\/+$/, '')
    await mongoose.connect(`${uri}/latexume`)
    console.log('✅ Connected to MongoDB latexume database')

    const usersCollection = mongoose.connection.collection('users')
    const resumesCollection = mongoose.connection.collection('resumes')

    // 1. Count & delete all accounts with legacy username field or missing fullName
    const oldUsersCount = await usersCollection.countDocuments({
      $or: [
        { username: { $exists: true } },
        { fullName: { $exists: false } }
      ]
    })
    console.log(`Found ${oldUsersCount} legacy user account(s) matching old schema.`)

    const deleteResult = await usersCollection.deleteMany({
      $or: [
        { username: { $exists: true } },
        { fullName: { $exists: false } }
      ]
    })
    console.log(`✅ Deleted ${deleteResult.deletedCount} old user account(s)`)

    // 2. Drop legacy username_1 index if present
    try {
      await usersCollection.dropIndex('username_1')
      console.log('✅ Legacy index username_1 dropped successfully')
    } catch (err) {
      if (err.code === 27 || err.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index username_1 was already removed')
      } else {
        console.log('Index username_1 note:', err.message)
      }
    }

    // 3. Remove orphan resumes belonging to deleted users
    const validUsers = await usersCollection.find({}, { projection: { _id: 1 } }).toArray()
    const validUserIds = validUsers.map((u) => u._id)
    const orphanResumesResult = await resumesCollection.deleteMany({
      owner: { $nin: validUserIds }
    })
    console.log(`✅ Cleaned up ${orphanResumesResult.deletedCount} orphan resume(s)`)

    await mongoose.disconnect()
    console.log('🎉 Cleanup completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  }
}

cleanup()
