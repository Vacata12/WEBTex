const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'demoDB';

function calculateAge(birthdate) {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

async function runRangeQueries() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('usersPolly');

        console.log('Потребители с възраст > 25:');
        const users = await collection.find({}).toArray();
        console.log(users.filter(user => calculateAge(user.birthdate) > 25));

        console.log('Потребители с резултат между 80 и 90:');
        console.log(await collection.find({ score: { $gte: 80, $lte: 90 } }).toArray());

        console.log('Потребители с възраст < 30:');
        console.log(users.filter(user => calculateAge(user.birthdate) < 30));

        console.log('Потребители с резултат > 50:');
        console.log(await collection.find({ score: { $gt: 50 } }).toArray());

        console.log('Потребители с възраст между 20 и 40:');
        console.log(users.filter(user => {
            const age = calculateAge(user.birthdate);
            return age >= 20 && age <= 40;
        }));

        console.log('Потребители с резултат < 60:');
        console.log(await collection.find({ score: { $lt: 60 } }).toArray());

        console.log('Потребители с възраст = 35:');
        console.log(users.filter(user => calculateAge(user.birthdate) === 35));

        console.log('Потребители с резултат между 70 и 100:');
        console.log(await collection.find({ score: { $gte: 70, $lte: 100 } }).toArray());

        console.log('Потребители с възраст > 50:');
        console.log(users.filter(user => calculateAge(user.birthdate) > 50));

        console.log('Потребители с резултат = 85:');
        console.log(await collection.find({ score: 85 }).toArray());
    } catch (err) {
        console.error('Error running range queries:', err);
    } finally {
        await client.close();
    }
}

runRangeQueries();