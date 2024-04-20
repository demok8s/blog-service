# Blog-service

This is the Blog service microservice.

## Installation

To install and run this microservice locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/demok8s/blog-service.git
   ```

2. Navigate into the project directory:
   ```bash
   cd blog-service
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables to the `.env` file:
     ```plaintext
     MONGODB_URI=mongodb://localhost:27017/your_database_name
     AUTH_API_URL=<URL OF AUTH API>
     ```

5. Start the server:
   ```bash
   npm start
   ```

6. The server should now be running. You can access the endpoints at `http://localhost:30001`.

## Usage

- **Create a new blog (protected route):** `POST /blog/create`
- **Get all blogs:** `GET /blog/blogs`
- **Get blogs by user_id (protected route):** `GET /blog/user_blogs`
- **Update a blog (protected route):** `PUT /blog/edit_blog`
- **Delete a blog (protected route):** `DELETE /blog/delete_blog`


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

Feel free to customize the instructions and add any additional details as needed.