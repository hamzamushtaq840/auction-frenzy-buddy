const desserts = [
    {
        title: 'Chocolate Cake',
        description: 'Chocolate cake is a cake flavored with melted chocolate',
        calories: 500,
    }
];

const newDesserts = desserts.map((dessert) => {
    return {
        title: dessert.title.toUpperCase(),
        ...dessert,
        kCal: dessert.calories / 1000,
    };
});
