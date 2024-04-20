// routes/blogRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Blog = require('../models/Blog');
const { validateUser } = require('../middleware/middleware');
const { getUserId } = require('../middleware/middleware');
const { logger } = require('../logger')
// Route to create a new blog (authenticated route)
router.post('/create', validateUser, async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({ message: 'JWT token is required' });
        }

        // Extract the user_id from the JWT token if needed
        // const decodedToken = jwt.decode(token.split(' ')[1]);
        // const user_id = decodedToken.userId;
        const { user_id } = req.body;
        const new_user_id = await getUserId(req, user_id)
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(404).json({ message: 'All parameters required' });
        }

        logger.info(new_user_id)
        const newBlog = new Blog({
            title,
            content,
            user_id: new_user_id, // Assign user_id if needed
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'An error occurred while creating the blog' });
    }
});



router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json(blogs);
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'An error occurred while getting blogs' });
    }
});


router.get('/user_blogs', validateUser, async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({ message: 'JWT token is required' });
        }

        // Extract the user_id from the JWT token if needed
        // const decodedToken = jwt.decode(token.split(' ')[1]);
        // const user_id = decodedToken.userId;
        const { user_id } = req.body;
        const new_user_id = await getUserId(req, user_id)
        logger.info(new_user_id)
        const blogs = await Blog.find({ user_id: user_id });
        res.status(200).json(blogs);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'An error occurred while creating the blog' });
    }
});



router.put('/edit_blog', validateUser, async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({ message: 'JWT token is required' });
        }

        // Extract the user_id from the JWT token if needed
        // const decodedToken = jwt.decode(token.split(' ')[1]);
        // const user_id = decodedToken.userId;
        const { user_id, blog_id } = req.body;
        const new_user_id = await getUserId(req, user_id)

        const blog = await Blog.findOne({ _id: blog_id, user_id: new_user_id });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        logger.info(new_user_id)
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(404).json({ message: 'All parameters required' });
        }
        blog.title = title;
        blog.content = content;
        const updatedBlog = await blog.save()
        res.status(200).json(updatedBlog);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'An error occurred while creating the blog' });
    }
});

router.put('/delete_blog', validateUser, async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({ message: 'JWT token is required' });
        }
        const { user_id, blog_id } = req.body;
        const new_user_id = await getUserId(req, user_id)
        const blogToDelete = await Blog.findOne({ _id: blog_id, user_id: new_user_id });
        if (!blogToDelete){
            return res.status(404).json({ message: 'Blog not found' });
        }
        const deletedBlog = blogToDelete.title
        const blog = await Blog.deleteOne({ _id: blog_id, user_id: new_user_id });
        if (blog.deletedCount === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        logger.info(new_user_id)
        res.status(200).json({message: `blog ${deletedBlog} has been deleted.`});
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'An error occurred while creating the blog' });
    }
});


module.exports = router;




/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieve all blogs stored in the database
 *     tags: [Blogs]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /user_blogs:
 *   get:
 *     summary: Get blogs by user ID
 *     description: Retrieve blogs created by a specific user
 *     tags: [Blogs]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request, JWT token is required
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/create:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog post.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the blog
 *               content:
 *                 type: string
 *                 description: Content of the blog
 *               user_id:
 *                 type: integer
 *                 description: ID of the user who created the blog
 *     responses:
 *       '201':
 *         description: Blog created successfully
 *       '400':
 *         description: Bad request, JWT token is required
 *       '401':
 *         description: Unauthorized, JWT token is invalid
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /edit_blog:
 *   put:
 *     summary: Update a blog
 *     description: Update a blog post by user_id and blog_id.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID of the blog author
 *               blog_id:
 *                 type: string
 *                 description: ID of the blog to be updated
 *               title:
 *                 type: string
 *                 description: New title of the blog
 *               content:
 *                 type: string
 *                 description: New content of the blog
 *     responses:
 *       '200':
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '403':
 *         description: JWT token is required
 *       '404':
 *         description: All parameters required or Blog not found
 *       '500':
 *         description: An error occurred while updating the blog
 *
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the blog
 *         content:
 *           type: string
 *           description: Content of the blog
 *         user_id:
 *           type: string
 *           description: User ID of the blog author
 */
/**
 * @swagger
 * /delete_blog:
 *   put:
 *     summary: Delete a blog
 *     description: Delete a blog post by user_id and blog_id.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID of the blog author
 *               blog_id:
 *                 type: string
 *                 description: ID of the blog to be deleted
 *     responses:
 *       '200':
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '403':
 *         description: JWT token is required
 *       '404':
 *         description: Blog not found
 *       '500':
 *         description: An error occurred while deleting the blog
 */
