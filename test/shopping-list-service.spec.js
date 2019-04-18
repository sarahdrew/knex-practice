const ShoppingListService = (require('..src/shopping-list-service'))
const knex = require('knex')

describe(`Shopping List service object`, function () {
    let db
    let testItems = [
        {
            id: 1,
            name: 'first item',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            price: '1.00',
            category: 'Main'
        },
        {
            id: 2,
            name: 'second item',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            price: '2.00',
            category: 'Snack'
        },
        {
            id: 3,
            name: 'third item',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            price: '3.00',
            category: 'Lunch'
        },
        {
            id: 4,
            name: 'fourth item',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            price: '4.00',
            category: 'Breakfast'
        }

    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })
    before(() => db('shopping_list').truncate())
    afterEach(() => db('shopping_list').truncate())
    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            const testItems = testItems.map(item => ({
                ...item,
                checked: false,
            }))
            // test that ShoppingListService.getAllItems gets data from table
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
        it(`getById() resolves an article by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdItem.name,
                        date_added: thirdItem.date_added,
                        price: thirdItem.price,
                        category: thirdItem.category,
                        checked: false,
                    })
                })
        })
        it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
            const articleId = 3
            return ShoppingListService.deleteItem(db, articleId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    // copy the array of test items without the "deleted" article
                    const expected = testItems
                        .filter(article => article.id !== articleId)
                        .map(item => ({
                            ...item,
                            checked: false,
                        }))
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an article from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                //test with updated information for each key
                name: 'updated title',
                price: '99.99',
                date_added: new Date(),
                checked: true,
            }
            const originalItem = testItems[idOfItemToUpdate - 1]
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    })
                })
        })
    })

})
context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
        return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([])
            })
    })

    it(`insertItem() inserts an article and resolves the article with an 'id'`, () => {
        const newItem = {
            name: 'Test new name name',
            price: '5.00',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'Lunch',
        }
        return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    date_added: newItem.date_added,
                    checked: newItem.checked,
                    category: newItem.category,
                })
            })
    })
})



// it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
//     const newItem = {
//         title: 'Test new title',
//         content: 'Test new content',
//         date_published: new Date('2020-01-01T00:00:00.000Z'),
//     }
//     return ArticlesService.insertArticle(db, newArticles)
//         .then(actual => {
//             expect(actual).to.eql({
//                 id: 1,
//                 title: newArticle.title,
//                 content: newArticle.content,
//                 date_published: newArticle.date_published,
//             })
//         })
// })