# Interview Experience Backend

Backend for Interview Experience

---

## Query

1. Get all the Blogs.

```graphql
query Query {
  blogs {
    _id
    author {
      name
      profile
    }
    forOrganisation
    link
    title
  }
}
```

2. Get all the Blogs for an Organisation.

```graphql
query Query($filter: BlogFilter) {
  blogs(filter: $filter) {
    author {
      name
      profile
    }
    _id
    forOrganisation
    link
    title
  }
}

{
  "filter": {
    "forOrganisation": "Google"
  }
}
```

3. Get paginated Blogs.

```graphql
query Query($limit: Int!, $offset: Int!) {
  blogs(limit: $limit, offset: $offset) {
    author {
      name
      profile
    }
    _id
    forOrganisation
    link
    title
  }
}

{
  "limit": 4,
  "offset": 2
}
```

4. Get all the Organisations.

```graphql
query Query {
  organisations {
    _id
    blogCount
    name
  }
}
```

5. Get paginated Organisations.

```graphql
query Query($offset: Int!, $limit: Int!) {
  organisations(offset: $offset, limit: $limit) {
    _id
    blogCount
    name
  }
}

{
  "limit": 4,
  "offset": 2
}
```

6. Get staging Blogs.

```graphql
query Query($status: String!) {
  stagingBlogs(status: $status) {
    _id
    author {
      name
      profile
    }
    forOrganisation
    status
    link
    title
  }
}

{
  "status": "pending"
}
```

---

## Mutation

1. Create a new Blog.

```graphql
mutation Mutation(
  $title: String!
  $link: String!
  $forOrganisation: String!
  $author: NewAuthor!
) {
  createBlog(
    title: $title
    link: $link
    forOrganisation: $forOrganisation
    author: $author
  ) {
    _id
    status
    author {
      name
      profile
    }
    forOrganisation
    link
    title
  }
}

{
  "title": "blog-title",
  "link": "blog-link",
  "forOrganisation": "blog-forOrganisation",
  "author": {
    "name": "author-name",
    "profile": "author-profile"
  }
}
```

2. Update the new Blog status.

```graphql
mutation CreateBlog($id: ID!, $status: String!) {
  updateBlogStatus(_id: $id, status: $status) {
    _id
    author {
      name
      profile
    }
    forOrganisation
    link
    status
    title
  }
}

{
  "id": "new_blog_000",
  "status": "rejected"
}
```

---

## 🔌 Getting Started

1. Clone the repository on your local machine with the command below in your terminal, and cd into the **interview-experience-backend** folder.

```shell
git clone https://github.com/hsnice16/interview-experience-backend.git

cd interview-experience-backend
```

2. Install dependencies (if you are using **yarn** then do with that).

```shell
npm install
```

3. Start the development server.

```shell
npm run watch
```
