# GrapghQL queries


## TO get all users
```graphql
query {
  users {
    id
    name
    email
    role
    isActive
    createdAt
  }
}
```

## TO get limited users

```graphql
query {
  users(limit: 2) {
    id
    name
    email
    role
    isActive
    createdAt
  }
}
```

## To get single user

```graphql
query {
  user(id: "60d3a405-d72a-4659-b54d-037645648d5c") {
    id
    name
    email
    role
    isActive
    createdAt
  }
}
```
