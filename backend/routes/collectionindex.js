const verifyToken = require('../middlewares/verifyToken');
const router = require('express').Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Work = require('../models/Work')
const Collection = require('../models/Collection');
const Photo = require('../models/Photo');
const fs = require('fs');
const path = require('path');
const ObjectId = require('mongoose').Types.ObjectId

router.post('/newCollection', verifyToken, async (req, res) => {
    const { type, thumbnail } = req.body
    const author = await User.findById(req.userId, ['_id'])
    let collection = new Collection()

    if (!collection.name) { collection.name = "New collection" }

    const item = new Item({ type: type, name: `New ${type}`, content: [], isThumbnail: true, parent: collection._id, coll: collection._id, thumbnail: thumbnail })
    item.save()

    collection.thumbnails.push({ _id: item._id, type: item.type, path: thumbnail })
    collection.authors.push(author._id)
    collection.content.push(item._id)
    collection.save()

    const URL = type == 'item' ?
        `Collection-Item-Template/${item._id}` :
        `Folder-Template/${item._id}`

    res.status(200).send({ URL: URL, id: item._id })
})

router.post('/newItem', verifyToken, async (req, res) => {
    const { id, type } = req.body
    const item = new Item({ type: type, name: `New ${type}`, public: false, parent: id, content: [] })
    if (item.type == 'folder') { item.thumbnail = '' }

    const collection = await Collection.findById(id)

    if (collection) {
        item.coll = collection._id
        collection.content.push(item._id)
        collection.save()
    } else {
        const parentItem = await Item.findById(id)
        item.coll = parentItem.coll

        parentItem.content.push(item._id)
        parentItem.save()
    }
    item.save()

    const URL = type == 'item' ?
        `Collection-Item-Template/${item._id}` :
        `Folder-Template/${item._id}`

    res.status(200).send({ URL: URL, id: item._id })
})

router.post('/getCollection', verifyToken, async (req, res) => {
    const { id } = req.body
    const user = await User.findById(req.userId, ['role']).lean()
    const canSeePrivate = ['Admin', 'Family member', 'Friend'].includes(user.role)
    
    if (ObjectId.isValid(id)) {
        const collection = await Collection.findById(id)

        if (collection) {
            const isAuthor = collection.authors.includes(req.userId) || user.role == 'Admin'
            const family = await User.find({ 'role': { $in: ['Family member', 'Admin'] } }, ['name', 'lastName', 'avatar']).lean()

            let result = { collection: collection, content: [], authors: [], isAuthor: isAuthor, family: family, editor: req.userId }

            for (let item of collection.content) {
                const info = await Item.findById(item).lean()
                result.content.push(info)
            }

            for (let i = collection.authors.length; i >= 0; i--) {
                const author = await User.findById(collection.authors[i], ['avatar']).lean()

                if (author) {
                    result.authors.push(author)
                } else {
                    collection.authors.splice(i, 1)
                }
            }

            result['pages'] = canSeePrivate ? await Collection.countDocuments() : await Collection.countDocuments({ public: true })
            result['position'] = await Collection.countDocuments({ _id: { $lt: collection._id } }) + 1
            const nextColls = await Collection.find({ _id: { $gt: collection._id } }, ['_id']).sort({ _id: 1 })
            const prevColls = await Collection.find({ _id: { $lt: collection._id } }, ['_id']).sort({ _id: -1 })

            result['next'] = !!nextColls[0] ? nextColls[0]._id : prevColls[prevColls.length - 1]._id
            result['prev'] = !!prevColls[0] ? prevColls[0]._id : nextColls[nextColls.length - 1]._id
            result['user'] = req.userId


            return res.status(200).send(result)
        }
    }

    res.status(404).send("Not found.")
})

router.post('/updateCollection', verifyToken, async (req, res) => {
    let i = 0
    for (let author of req.body.authors) {
        req.body.authors[i] = ObjectId(author)
        i++
    }
    Collection.findByIdAndUpdate(req.body._id, req.body,
        function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                res.status(200).send({ message: 'Updated' })
            }
        })
})

router.post('/getItem', verifyToken, async (req, res) => {
    const { id } = req.body
    if (!ObjectId.isValid(id)) { return res.status(404).send({}) }
    let item = await Item.findById(id)

    if (!item) { return res.status(404).send({ error: "Not found" }) }

    let parent = await Collection.findById(item.parent).select({ _id: 1, content: 1 }).lean()
    if (!parent) {
        parent = await Item.findById(item.parent).select({ _id: 1, content: 1 }).lean()

        if (!parent) {
            return res.status(404).send({ error: "Not found" })
        }
    }

    const collection = await Collection.findById(item.coll).select({ authors: 1, content: 1, name: 1 })
    const root = item.type == 'folder' ? 'Collection-Folder' : 'Collection-Item'
    const user = await User.findById(req.userId).select({ role: 1 }).lean()

    response = {
        item: item,
        content: [],
        authors: [],
        isAuthor: collection.authors.includes(ObjectId(req.userId)) || user.role == 'Admin',
        collection: { name: collection.name, id: collection._id, content: collection.content },
        neighbors: [],
        next: '',
        prev: '',
        path: [{
            name: item.name,
            url: `${root}/${id}`
        }],
    }


    for (let itemId of parent.content) {
        const info = await Item.findById(itemId).select({ type: 1 })

        if (info.type == item.type) { response.neighbors.push(info._id) }
    }


    const index = response.neighbors.findIndex(obj => item._id.equals(obj))
    const next = response.neighbors[index + 1]
    const prev = response.neighbors[index - 1]

    response.next = next ? next._id : response.neighbors[0]
    response.prev = prev ? prev._id : response.neighbors[response.neighbors.length - 1]


    for (let author of collection.authors) {
        response.authors.push(await User.findById(author, ['avatar']).lean())
    }

    if (!item) { return res.status(404).send({}) }


    if (item.type == 'item') {
        for (let photoId of item.content) {
            const photo = await Photo.findById(photoId)

            if (photo) {
                response.content.push(photo)
            }
        }
    } else {
        for (let element of item.content) {
            const folderItem = await Item.findById(element)
            response.content.push(folderItem)
        }
    }

    let level = item.parent

    while (true) {
        if (level == item.coll) {
            response.path.push({
                name: collection.name,
                url: `Collection/${item.coll}`
            })
            break
        }

        let next = await Item.findById(level, ['type', 'parent', 'name']).lean()
        const route = next.type

        response.path.push({
            name: next.name,
            url: `${route}/${next._id}`
        })
        level = next.parent ? next.parent : item.coll
    }

    response.path.reverse()
    res.status(200).send(response)
})

router.post('/addItemPic', verifyToken, async (req, res) => {
    const { colId, picId } = req.body
    const item = await Item.findById(colId)

    item.content.push(picId)

    if (item.content.indexOf(picId) == 0) {
        const photo = await Photo.findById(picId)

        item.thumbnail = photo.imagePath
    }

    item.save()

    res.status(200).send({})
})

router.post('/updateItem', verifyToken, async (req, res) => {
    const { id, changes } = req.body

    Item.findByIdAndUpdate(id, changes, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            if (changes.thumbnail) {
                if (docs.content.length < 1) {
                    docs.thumbnail = './assets/img/no-image.png'
                } else {
                    docs.thumbnail = changes.thumbnail
                }
            }
            docs.save()
        }
    })

    res.status(200).send({})
})

router.post('/deleteCollection', verifyToken, async (req, res) => {
    const { id } = req.body

    await Collection.findByIdAndDelete(id)
    res.status(200).send({})
})

router.post('/deleteItem', verifyToken, async (req, res) => {
    const { id, deletingCollection } = req.body

    const item = await Item.findById(id)
    let parent = await Collection.findById(item.parent)

    let URL = parent ?
        `Collection-Template/${item.parent}` :
        `Folder-Template/${item.parent}`

    parent = parent ? parent : await Item.findById(item.parent)



    if (!deletingCollection && URL.includes('Collection')) {
        if (parent.content.length > 1) {

            const itemIndex = parent.content.indexOf(item._id)

            if (item.isThumbnail) {
                const index = parent.thumbnails.findIndex(x => x._id == item._id)
                parent.thumbnails.splice(index, 1)

                if (parent.thumbnails.length < 1) {
                    const n = itemIndex == 0 ? 1 : 0
                    const newThumbnail = await Item.findById(parent.content[n])
                    newThumbnail.isThumbnail = true
                    newThumbnail.save()

                    parent.thumbnails.push({ _id: newThumbnail._id, type: newThumbnail.type, path: newThumbnail.thumbnail })
                    parent.markModified('thumbnails')
                }

            }
            parent.content.splice(itemIndex, 1)
            parent.save()
        } else {
            URL = `Profile`
            parent.delete()
        }
    }

    async function cascadeDelete(itemId) {
        const folder = await Item.findById(itemId).select({ content: 1 })

        for (let element of folder.content) {
            const child = await Item.findById(element).select({ type: 1 })

            if (child.type == 'item') {
                await deletePics(element)
            } else {
                await cascadeDelete(element)
            }
        }
        folder.delete()
    }

    async function deletePics(itemId) {
        const picItem = await Item.findById(itemId)

        for (let picture of picItem.content) {
            const photo = await Photo.findById(picture)
            fs.unlink(path.resolve(photo.Ipath), (err) => {
                console.log(err)
            })
            photo.delete()
        }
        picItem.delete()
    }

    if (item.type == 'item') {
        for (let picture of item.content) {
            const photo = await Photo.findById(picture)

            fs.unlink(path.resolve(photo.Ipath), (err) => {
                console.log(err)
            })
            photo.delete()
        }
        item.delete()
        return res.status(200).send({ URL: URL })
    } else {
        await cascadeDelete(item._id)
    }

    res.status(200).send({ URL: URL })
})

router.post('/delItemPic', verifyToken, async (req, res) => {
    const { id, index } = req.body
    const item = await Item.findById(id, ['content'])
    item.content.splice(index, 1)
    item.markModified('content')

    item.save()

    res.status(200).send({})
})

router.post('/collections', verifyToken, async (req, res) => {
    const { filters, skip, limit } = req.body
    const user = await User.findById(req.userId).lean()
    if (filters.authors) { filters.authors = ObjectId(filters.authors) }

    const collections = await Collection.find(filters, ['name', 'public', 'content', 'authors', 'thumbnails']).sort({ _id: -1 }).skip(skip).limit(limit).lean()

    for (let collection of collections) {
        collection['locked'] == false

        if (!collection.public && ['Guest'].includes(user.role)) {
            collection['locked'] = true
        }

        for (let i = collection.authors.length; i >= 0; i--) {

            const info = await User.findById(collection.authors[i], ['name', 'avatar'])

            if (info) {
                collection.authors[i] = info
            } else {
                collection.authors.splice(i, 1)
            }
        }
    }

    res.status(200).send(collections)
})

router.get('/demoCollections', async (req, res) => {
    const collections = await Collection.find({ public: true }, ['name', 'public', 'content', 'authors', 'thumbnails']).sort({ _id: -1 }).limit(4).lean()

    for (let collection of collections) {
        for (let i = collection.authors.length; i >= 0; i--) {

            const info = await User.findById(collection.authors[i], ['name', 'avatar'])

            if (info) {
                collection.authors[i] = info
            } else {
                collection.authors.splice(i, 1)
            }
        }
    }

    res.status(200).send(collections)
})

router.get('/demoWorks', async (req, res) => {
    const works = await Work.find({ public: true }, ['name', 'medium', 'thumbnail', 'authors', 'public'], { sort: { _id: -1 } }).limit(6).lean();

    for (let work of works) {
        const authors = []

        for (let id of work.authors) {
            const user = await User.findById(id, ['name', 'avatar']).lean()
            authors.push(user)
        }
        work.authors = authors
    }

    res.status(200).json(works);
})

module.exports = router;
