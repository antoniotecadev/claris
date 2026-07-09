_This project has been created as part of the 42 curriculum by txavier._

# ft_transcendence

## Description

**ft_transcendence** is a full-stack web application developed for the 42 curriculum. The project recreates and extends the classic Pong experience with a modern web interface, user accounts, multiplayer-oriented features, persistent data, and a modular architecture.

The goal of the project is to design, build, and deploy a complete application that combines frontend development, backend services, database design, authentication, security considerations, and team-based project organization.

Key features:

- Browser-based Pong game experience.
- User account management.
- Authentication and protected application areas.
- Player profiles and persistent user data.
- Match history and game-related statistics.
- Modular frontend and backend structure.
- Containerized execution for a reproducible local environment.

## Database Schema

The database stores User, Church, Organization, Membership,Friendship, Event, EventInterest, Message and EmailLoginCode. A typical structure is:

```text
// User: It represents system users, storing authentication information, personal data, and activity details. It is linked to Membership to represent the organizations the user belongs to; to Message as the sender and recipient of messages; to Friendship to represent friendships and the user who created them; to EventInterest to record events the user has shown interest in; and to EmailLoginCode to manage temporary authentication codes sent via email. 
model User {
  id                 String           @id @default(cuid())
  email              String           @unique
  passwordHash       String?
  displayName        String
  gender             String?
  birthDate          DateTime?
  avatarUrl          String?
  googleId           String?          @unique
  lastSeen           DateTime?
  createdAt          DateTime         @default(now())
  memberships        Membership[]
  sentMessages       Message[]        @relation("SentMessages")
  receivedMessages   Message[]        @relation("ReceivedMessages")
  friendshipsA       Friendship[]     @relation("FriendshipUserA")
  friendshipsB       Friendship[]     @relation("FriendshipUserB")
  createdFriendships Friendship[]     @relation("FriendshipCreator")
  eventInterests     EventInterest[]
  emailLoginCodes    EmailLoginCode[]
}


// Church: It represents a church registered in the system. It is related to Organization, allowing a church to have one or more organizations.
model Church {
  id            String         @id @default(cuid())
  name          String
  createdAt     DateTime       @default(now())
  organizations Organization[]
}

// Organization: It represents an organization (church) within the system, storing information such as name, identifier, address, description, and logo. It is related to Church (the entity to which it belongs), Membership (for managing its members), Event (for organized events), Message (for messages exchanged within its context), and Friendship (for friendships existing among its members).
model Organization {
  id          String       @id @default(cuid())
  churchId    String
  name        String
  slug        String       @unique
  address     String?
  description String?
  logoUrl     String?
  createdAt   DateTime     @default(now())
  memberships Membership[]
  events      Event[]
  messages    Message[]
  friendships Friendship[]
  church      Church       @relation(fields: [churchId], references: [id])
}

// Membership: It represents the association of a user with an organization, indicating their role and the date of joining. It is related to User, which represents the member, and to Organization, to which that member belongs.
model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           Role         @default(MEMBER)
  joinedAt       DateTime     @default(now())
  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId])
}

// Role: enumeração para os diferentes papéis que um membro pode ter dentro de uma organização, como ADMIN e MEMBER.
enum Role {
  ADMIN
  MEMBER
}

// Friendship: It represents a friendship between two users within an organization. It is linked to the Organization where the friendship exists, and to the User, identifying the two participants in the friendship and the user responsible for creating it.
model Friendship {
  id             String       @id @default(cuid())
  organizationId String
  userAId        String
  userBId        String
  createdById    String
  createdAt      DateTime     @default(now())
  organization   Organization @relation(fields: [organizationId], references: [id])
  userA          User         @relation("FriendshipUserA", fields: [userAId], references: [id])
  userB          User         @relation("FriendshipUserB", fields: [userBId], references: [id])
  createdBy      User         @relation("FriendshipCreator", fields: [createdById], references: [id])

  @@unique([organizationId, userAId, userBId])
  @@index([organizationId, userAId])
  @@index([organizationId, userBId])
  @@index([createdById])
}

// Event: representa os eventos organizados pelas igrejas, com campos para título, descrição, data, local, foto e relacionamentos com a organização, interessados.
model Event {
  id             String          @id @default(cuid())
  organizationId String
  title          String
  description    String?
  date           DateTime
  location       String?
  photoUrl       String?
  createdAt      DateTime        @default(now())
  organization   Organization    @relation(fields: [organizationId], references: [id])
  interests      EventInterest[]
}

// EventInterest: representa o interesse de um membro em participar de um evento.
model EventInterest {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  createdAt DateTime @default(now())
  event     Event    @relation(fields: [eventId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@unique([eventId, userId])
  @@index([userId])
}

// Message: representa as mensagens enviadas pelos membros, com campos para o conteúdo, data de criação e relacionamentos com o remetente e a organização.
model Message {
  id             String       @id @default(cuid())
  senderId       String
  recipientId    String?
  organizationId String
  content        String
  readAt         DateTime?
  createdAt      DateTime     @default(now())
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])
  recipient      User?        @relation("ReceivedMessages", fields: [recipientId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId, senderId, recipientId, createdAt])
  @@index([organizationId, recipientId, senderId, createdAt])
}

// EmailLoginCode: representa um código de login enviado por email, com expiração e uso único.
model EmailLoginCode {
  id        String    @id @default(cuid())
  userId    String
  codeHash  String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

## Resources

Classic references used for the project topic:

- 42 ft_transcendence subject.
- Docker documentation: https://docs.docker.com/
- Docker Compose documentation: https://docs.docker.com/compose/
- MDN Web Docs: https://developer.mozilla.org/
- PostgreSQL documentation: https://www.postgresql.org/docs/

AI usage:

- AI was used to help structure this README according to the requested 42 curriculum requirements.
- AI was used to improve wording, organize sections, and ensure that required topics such as team information, project management, technical stack, modules, database schema, and individual contributions were covered.
- AI was not used as a replacement for understanding or validating the project implementation.
- Any AI-generated documentation must be reviewed and adjusted to match the final code, selected modules, and team member responsibilities.

## License and Credits

This project was developed for educational purposes as part of the 42 curriculum.
