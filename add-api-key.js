//  db entry script

apiKey = "valid-api-key";
 const sha512 = function (key) {
  return crypto.createHash("sha512").update(key).digest("base64");
};

async function createOrganization({ name }) {
  const organization = {
    _id: new ObjectId(),
    name: name || `org-${Math.random().toString(36).substring(2, 15)}`,
    createdAt: new Date(),
  };
  const resp = await db.getCollection("organizations").insertOne(organization);
  organization._id = resp.insertedId;
  return organization;
}
async function createRole({ name, scopes }) {
  const role = {
    _id: new ObjectId(),
    name: name || `role-${Math.random().toString(36).substring(2, 15)}`,
    scopes: scopes || [],
  };
  const resp = await db.getCollection("roles").insertOne(role);
  role._id = resp.insertedId;
  return role;
}

async function createUser({
  username = `user-e8f1bf47-2f28-4af5-aa94-c3165d59c68e`,
  email,
  apiKeyHash,
  apiKeyHistory,
  organizationId,
  providers,
  scopes = [],
}) {
  let role = null;
  if (Array.isArray(scopes)) {
    role = await createRole({ scopes });
  }
  const user = {
    _id: new ObjectId(),
    organization: organizationId || (await createOrganization({ name: username }))._id,
    username: username,
    email: email || `${username}@jc.test`,
    apiKeyHash: apiKeyHash,
    apiKeyHistory: apiKeyHistory,
    providers: providers || [],
    createdAt: new Date(),
    role: role?._id,
  };
  const resp = await db.getCollection("users").insertOne(user);
  user._id = resp.insertedId;
  return user;
}

createUser({
        apiKeyHash: {
          createdAt: new Date(),
          expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          sha512: sha512(apiKey),
        },
        providers: [{ _id: new ObjectId() }],
        scopes: ["organization:read", "organization:write", "scim"],
      });   