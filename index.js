var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
    {
        id: 0,
        name: "WoodsHill",
        description: "American cuisine, farm to table, with fresh produce every day",
        dishes: [
            {
                name: "Swordfish grill",
                price: 27,
            },
            {
                name: "Roasted Broccily",
                price: 11,
            },
        ],
    },
    {
        id: 1,
        name: "Fiorellas",
        description: "Italian-American home cooked food with fresh pasta and sauces",
        dishes: [
            {
                name: "Flatbread",
                price: 14,
            },
            {
                name: "Carbonara",
                price: 18,
            },
            {
                name: "Spaghetti",
                price: 19,
            },
        ],
    },
    {
        id: 2,
        name: "Karma",
        description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
        dishes: [
            {
                name: "Dragon Roll",
                price: 12,
            },
            {
                name: "Pancake roll",
                price: 11,
            },
            {
                name: "Cod cakes",
                price: 13,
            },
        ],
    },
];

var schema = buildSchema(`
    type Query{
        restaurant(id: Int): restaurant
        restaurants: [restaurant]
    },
    type restaurant {
        id: Int
        name: String
        description: String
        dishes:[Dish]
    },
    type Dish{
        name: String
        price: Int
    },
    type DeleteResponse{
        ok: Boolean!
    },
    input RestaurantInput {
        id: Int
        name: String
        description: String
        dishes:[DishInput]
    }
    input DishInput {
        name: String
        price: Int
    },
    input RestaurantEditInput {
        id: Int
        name: String
        description: String
    }
    type Mutation{
        setrestaurant(input: RestaurantInput): restaurant
        deleterestaurant(id: Int): DeleteResponse
        editrestaurant(input: RestaurantEditInput): restaurant
    }
`);

// The root provides a resolver function for each API endpoint
var root = {
    restaurant: (arg) => restaurants[arg.id],
    restaurants: () => restaurants,
    setrestaurant: ({ input }) => {
        restaurants.push({
            id: restaurants.length,
            name: input.name,
            description: input.description,
            dishes: input.dishes
        });
        return input;
    },
    deleterestaurant: ({ id }) => {
        const ok = Boolean(restaurants[id]);
        let delc = restaurants[id];
        restaurants = restaurants.filter((item) => item.id !== id);
        console.log(JSON.stringify(delc));
        return { ok };
    },
    editrestaurant: ({ input }) => {
        if (!restaurants[input.id]) {
            throw new Error("restaurant doesn't exist");
        }
        restaurants[input.id] = {
            ...restaurants[input.id],
            ...input,
        };
        return restaurants[input.id];
    }
};

var app = express();
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
