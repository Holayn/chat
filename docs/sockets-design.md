### Event Interface
- `chat`
  - params: chat, session
  - adds chat to database
    - if the receiving user is connected, emits a `chat` event to the appropriate socket(s)
- `readChat`
  - params: session id, user id
  - updates session `read` flag in database to true
  - notes:
    - whenever a new message is added to a session, this session flag should be set to false
    - when the receiving user reads the message, the session flag should be set to true
    - why not set the flag on the chat message itself?
      - it's not efficient to have to look through all chat messages in a session to determine if there's an unread message in that session - it's easier to track on the session level
    - to track in group chats what message was read by whom, the session item that belongs to that user id can be enhanced to indicate the id of the chat message that the user has last read
- `disconnect`
  - removes socket and user id from maps of connected users and sockets

### Notes

- Connected users are mapped via their user id to their socket
  - This is so that events can be emitted to the appropriate user's socket (using their user id)
- Sockets are also mapped via their ids to the user id
  - This is so that we can know what socket ids correspond to what user id
    - Only useful for logging
