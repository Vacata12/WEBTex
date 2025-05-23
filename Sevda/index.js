const { MongoClient } = require("mongodb");
 
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
 
async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
 
        const db = client.db("newdb"); // нова база данни
        const clients = db.collection("clients"); // нова колекция
        await clients.deleteMany({})
        await clients.insertMany([
            { firstName: "Ivan", lastName: "Ivanov", age: 28, country: "Bulgaria" },
            { firstName: "Maria", lastName: "Petrova", age: 22, country: "Bulgaria" },
            { firstName: "Georgi", lastName: "Dimitrov", age: 35, country: "Bulgaria" },
            { firstName: "Dimitar", lastName: "Stoyanov", age: 31, country: "Bulgaria" },
            { firstName: "Nikolay", lastName: "Ivanov", age: 33, country: "Bulgaria" }
        ]);
 
        console.log("======================");
        // Пример 1 - итерация с курсор, документи с age >= 30
        const cursor = clients.find({ age: { $gte: 30 } }).batchSize(2);
        while (await cursor.hasNext()) {
            const user = await cursor.next();
            console.log(`Processing: ${user.firstName} ${user.lastName}, Age: ${user.age}`);
            console.log('*******');
        }
 
        console.log("======================");
 
        //Пример 2 - взимаме само първите 4 документа
        const limitedCursor = clients.find().limit(4).batchSize(2);
        const limitedDocs = await limitedCursor.toArray();
        limitedDocs.forEach(user => {
            console.log(`User: ${user.firstName} ${user.lastName}, Age: ${user.age}`);
        });
 
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}
 
main().catch(console.error);