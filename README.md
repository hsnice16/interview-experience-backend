<div align="center">

<img alt="interview experience logo" src="IE.png" width="150px" height="150px" />

# ✨ Interview Experience Backend

Backend for Interview Experience

![Forks](https://img.shields.io/github/forks/hsnice16/interview-experience-backend)
![Stars](https://img.shields.io/github/stars/hsnice16/interview-experience-backend)
![GraphQL](https://img.shields.io/badge/graphql-f6009b?logo=graphql)
![Node.JS](https://img.shields.io/badge/node.js-046e01?logo=node.js)
![TypeScript](https://img.shields.io/badge/typescript-gray?logo=typescript)

</div>

---

## 👀 Query

<details open>
<summary>1. Get all the blogs.</summary>

```graphql
query Query {
  blogs {
    _id
    author {
      name
      profile
    }
    forOrganization
    link
    title
  }
}
```

</details>

<details>
<summary>2. Get all the blogs for an organization.</summary>

```graphql
query Query($filter: BlogFilter) {
  blogs(filter: $filter) {
    author {
      name
      profile
    }
    _id
    forOrganization
    link
    title
  }
}

{
  "filter": {
    "forOrganization": "Google"
  }
}
```

</details>

<details>
<summary>3. Get paginated blogs.</summary>

```graphql
query Query($limit: Int!, $offset: Int!) {
  blogs(limit: $limit, offset: $offset) {
    author {
      name
      profile
    }
    _id
    forOrganization
    link
    title
  }
}

{
  "limit": 4,
  "offset": 2
}
```

</details>

<details>
<summary>4. Get all the organizations.</summary>

```graphql
query Query {
  organizations {
    _id
    blogCount
    name
  }
}
```

</details>

<details>
<summary>5. Get paginated organizations.</summary>

```graphql
query Query($offset: Int!, $limit: Int!) {
  organizations(offset: $offset, limit: $limit) {
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

</details>

<details>
<summary>6. Get staging blogs.</summary>

```graphql
query Query($status: String!) {
  stagingBlogs(status: $status) {
    _id
    author {
      name
      profile
    }
    forOrganization
    status
    link
    title
  }
}

{
  "status": "pending"
}
```

</details>

---

## 🏗️ Mutation

<details open>
<summary>1. Create a new blog.</summary>

```graphql
mutation Mutation(
  $title: String!
  $link: String!
  $forOrganization: String!
  $author: NewAuthor!
) {
  createBlog(
    title: $title
    link: $link
    forOrganization: $forOrganization
    author: $author
  ) {
    _id
    status
    author {
      name
      profile
    }
    forOrganization
    link
    title
  }
}

{
  "title": "blog-title",
  "link": "blog-link",
  "forOrganization": "blog-forOrganization",
  "author": {
    "name": "author-name",
    "profile": "author-profile"
  }
}
```

</details>

<details>
<summary>2. Update the new blog status.</summary>

```graphql
mutation CreateBlog($id: ID!, $status: String!) {
  updateBlogStatus(_id: $id, status: $status) {
    _id
    author {
      name
      profile
    }
    forOrganization
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

</details>

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
