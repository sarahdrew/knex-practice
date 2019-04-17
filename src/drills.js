require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
    client: "pg",
    connection: process.env.DB_URL
});
console.log("connection successful");

function getAllItemsThatContainText(searchTerm) {
    //query shopping_list table using knex moethods
    knexInstance.select('name', 'price', 'checked', 'category').
        from('shopping-list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
    //select the rows which have a name that contains the searchTerm using a case insensitive match
}

function paginateItems(pageNumber) {
    //6 items per page
    const limit = 6
    const offset = limit * (pageNumber - 1)
    //query the shopping-list and select pageNumber of rows paginated to 6 items per page
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(limit)
        .offset(offset)
        .then(result => {
            console.log('PAGINATE ITEMS', { pageNumber })
            console.log(result)
        })
}

paginateItems(5)

function itemsAfterDate(daysAgo) {
    //query shopping list and select the rows which have a date_added that is greater than daysAgo
    knexInstance.select('*')
        .from('shopping_list')
        .where('date_added', '>', knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo))
        .then(results => {
            console.log(results)
        })
}
itemsAfterDate(3)

function totalCost() {
    //query shopping_list using knex and select the rows grouped by their category and showing total price for each category
    knexInstance
        .select('category')
        .count('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log('COST PER CATEGORY', result)

        })
}