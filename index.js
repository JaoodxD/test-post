const express = require('express');
const {
    Sequelize,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    creator: {
        type: DataTypes.STRING,
        defaultValue: "Anonymous",
    },
    postBody: {
        type: DataTypes.STRING,
        defaultValue: "Empty Post..."

    }
});

const app = express();
const port = 3000;
app.set('query parser', 'simple');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
app.get('/:method', async (req, res) => {
    switch (req.params.method) {
        case `add`:
            await Post.create({
                creator: req.query.creator,
                postBody: req.query.postBody
            });
            await res.send("post added successfully");
            break;
        case `delete`:
            await Post.destroy({
                    where: {
                        id: req.query.id
                    }
                }).then((numberOfDestroyedItems) => res.send(`Destroyed posts: ${numberOfDestroyedItems}`))
                .catch((error) => res.send(error));
            break;
        case `show`:
            const requests = await Post.findAll({
                attributes: ['id', 'creator', 'postBody']
            });
            await res.send(JSON.stringify(requests));
            break;
    }
});
app.listen(port, async () => {
    console.log(`Exaple of listening on port ${port}`);
    await sequelize.sync({
        force: true
    });
});
