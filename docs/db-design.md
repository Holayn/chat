best practices: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html

## use cases to support:
- get all chat messages for a session
  - this is supported by chat table having a partition & sort key
  - can take advantage of BatchGetItem
- get all sessions for a user
  - can use secondary index
  - search chat table for a user, return all entries that have match in sender or 
- get a user's name
- start a chat with a user
  - for each user create a new item in session table of type regular using same session id
- send a message to a user
  - add item to chat table
- delete a message in a chat
  - remove item from chat table
- delete a chat with a user
  - delete entry containing session-id & user-id from session table
  - if no session table no longer contains session-id, delete entries from chat table
- create a group chat
  - for each user, create a new item in session table of type group using same session id
- send a message to a group chat
  - add item to chat table
- delete a message from a group chat
  - remove item from chat table
- delete a group chat
  - delete entry containing session-id & user-id from session table
  - if no session table no longer contains session-id, delete entries from chat table
- support sticker
  - add a new item in chat table with type "sticker"


### user table
- user-id (primary key)
- name
- username
- password

### chat table
- session-id (primary key)
- chat-id
- user-id of sender
- message
- timestamp (primary sort key)
- type "text" "sticker" "image"

### session table
- session-id (primary key)
- user-id (primary sort key)
- type "group" or "regular"


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
