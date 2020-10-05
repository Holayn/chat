best practices: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html

An item in the `chat` table represents a message a user has sent.
- Every item or "chat" has an associated session it belongs to (denoted by its `session-id`), and who the item was sent by (denoted by its `user-id`)
  - Supports getting all chats in a session, and knowing who sent what chat

An item in the `sessions` table contains a session id and a user id.
  - Supports getting all sessions a user has
  - Supports getting all users in a session
  - Supports multiple users in a session, since there can be multiple items with the same session id.

## use cases to support:
- get all chat messages for a session
  - db operation: query against chat table using the session-id
- get all sessions for a user
  - db operation: query against session table's user-id index
  - search chat table for a user, return all entries that have match in sender
- start a chat between users
  - create a new session id, and for every user, create a new item in the session table using that session id
- delete a chat with a user
  - delete entry containing session-id & user-id from session table
  - if no session table no longer contains session-id, delete entries from chat table
- support stickers
  - add a new item in chat table with type "sticker"


### user table
- properties
  - user-id (primary key)
  - name
  - username
  - password
- indexes
  - user-id

### chat table
- properties
  - session-id (primary key)
  - chat-id
  - user-id of sender
  - message
  - timestamp (primary sort key)
  - type "text" "sticker" "image"

### session table
- properties
  - session-id (primary key)
  - user-id (primary sort key)
  - type "group" or "regular"
- indexes
  - user-id


## example items:

### user
```
{
  "user-id": 0,
  "name": "kai",
  "username": "holayn"
}
{
  "user-id": 1,
  "name": "jorden",
  "username": "jorden97"
}
{
  "user-id": 2,
  "name": "wendy",
  "username": "mioumeek"
}
```


### chat
```
{
  "session-id": "0",
  "chat-id": "0",
  "message": "hi",
  "timestamp": "202004111135",
  "type": "text",
  "user-id": "0"
}
{
  "session-id": "0",
  "chat-id": "1",
  "message": "hey man",
  "timestamp": "202004111138",
  "type": "text"
  "user-id": "1"
}
{
  "session-id": "1",
  "chat-id": "2",
  "message": "hello",
  "timestamp": "202004111139",
  "type": "text",
  "user-id": "0"
}
```

### session
```
{
  "session-id": "0",
  "user-id": "0",
  "type": "regular"
}
{
  "session-id": "0",
  "user-id": "1",
  "type": "regular"
}
{
  "session-id": "1",
  "user-id": "0",
  "type": "regular"
}
{
  "session-id": "1",
  "user-id": "2",
  "type": "regular"
}
```
